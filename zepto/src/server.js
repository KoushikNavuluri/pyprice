/**
 * Unofficial Zepto REST API Server
 * Provides full programmatic access to Zepto products, search, categories, and location discovery.
 */

import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { CatalogService } from './services/catalogService.js';
import {
  resolveLocationByCoordinates,
  resolveLocationByPincode,
  searchAddresses,
  haversineKm
} from './services/locationService.js';
import { SessionManager } from './services/sessionManager.js';
import { KNOWN_DARK_STORES } from '../data/dark_stores.js';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory micro-cache (TTL 60s) for ultra-fast GET responses
const cache = new Map();
const CACHE_TTL_MS = 60 * 1000;
app.use((req, res, next) => {
  if (req.method !== 'GET' || req.path === '/api/health') return next();
  const key = req.originalUrl;
  const cached = cache.get(key);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
    res.setHeader('X-Cache', 'HIT');
    return res.status(cached.status).json(cached.body);
  }
  const originalJson = res.json.bind(res);
  res.json = (body) => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      cache.set(key, { timestamp: Date.now(), status: res.statusCode, body });
    }
    res.setHeader('X-Cache', 'MISS');
    return originalJson(body);
  };
  next();
});

// Logging middleware (skip in high-throughput benchmarks if SILENT_LOGS=true)
const silentLogs = process.env.SILENT_LOGS === 'true';
app.use((req, res, next) => {
  if (silentLogs) return next();
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// Rate Limiting: Disabled by default or when DISABLE_RATE_LIMIT=true for ultra-fast bulk testing
const disableRateLimit = process.env.DISABLE_RATE_LIMIT !== 'false';
if (!disableRateLimit) {
  const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      status: "error",
      error: {
        code: "RATE_LIMIT_EXCEEDED",
        message: "Too many requests, please slow down."
      }
    }
  });
  app.use('/api/', limiter);
}

// Services
const catalogService = new CatalogService();
const sessionManager = new SessionManager();

/* ====================================================================
   SYSTEM & HEALTH ENDPOINTS
   ==================================================================== */

app.get('/', (req, res) => {
  res.json({
    name: "Unofficial Zepto API",
    version: "1.0.0",
    description: "Programmatic REST API for Zepto product search, catalog, categories, and location serviceability",
    documentation: "/api/docs",
    health: "/api/health"
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    features: {
      search: true,
      autocomplete: true,
      productDetails: true,
      categories: true,
      locationLookup: true,
      storeDiscovery: true,
      sessionManagement: true
    }
  });
});

/* ====================================================================
   SESSION MANAGEMENT ENDPOINTS
   ==================================================================== */

app.post('/api/v1/session/init', (req, res) => {
  const { latitude, longitude, pincode, storeId } = req.body || {};
  let resolvedStoreId = storeId;

  if (!resolvedStoreId && latitude && longitude) {
    const loc = resolveLocationByCoordinates(parseFloat(latitude), parseFloat(longitude));
    if (loc.serviceable) resolvedStoreId = loc.primaryStore.storeId;
  } else if (!resolvedStoreId && pincode) {
    const loc = resolveLocationByPincode(pincode);
    if (loc.serviceable) resolvedStoreId = loc.primaryStore.storeId;
  }

  const session = sessionManager.createSession({
    latitude,
    longitude,
    pincode,
    storeId: resolvedStoreId
  });

  res.json({
    status: "success",
    data: session
  });
});

app.get('/api/v1/session/:sessionId', (req, res) => {
  const session = sessionManager.getSession(req.params.sessionId);
  if (!session) {
    return res.status(404).json({
      status: "error",
      error: { code: "SESSION_NOT_FOUND", message: "Session expired or invalid" }
    });
  }
  res.json({ status: "success", data: session });
});

/* ====================================================================
   LOCATION & STORE ENDPOINTS
   ==================================================================== */

// Resolve serviceability by coordinates (lat, lng)
app.get('/api/v1/location/coordinates', (req, res) => {
  const lat = parseFloat(req.query.lat);
  const lng = parseFloat(req.query.lng);

  if (isNaN(lat) || isNaN(lng)) {
    return res.status(400).json({
      status: "error",
      error: { code: "INVALID_COORDINATES", message: "Query parameters 'lat' and 'lng' must be valid numbers" }
    });
  }

  const result = resolveLocationByCoordinates(lat, lng);
  res.json({
    status: "success",
    data: result
  });
});

// Resolve serviceability by Pincode
app.get('/api/v1/location/pincode/:pincode', (req, res) => {
  const pincode = req.params.pincode;
  if (!/^\d{6}$/.test(pincode)) {
    return res.status(400).json({
      status: "error",
      error: { code: "INVALID_PINCODE", message: "Pincode must be a 6-digit Indian postal code" }
    });
  }

  const result = resolveLocationByPincode(pincode);
  res.json({
    status: "success",
    data: result
  });
});

// Address search / autocomplete
app.get('/api/v1/location/search', (req, res) => {
  const query = req.query.q || "";
  if (!query) {
    return res.status(400).json({
      status: "error",
      error: { code: "MISSING_QUERY", message: "Query parameter 'q' is required" }
    });
  }

  const addresses = searchAddresses(query);
  res.json({
    status: "success",
    count: addresses.length,
    data: addresses
  });
});

// Dark stores listing
app.get('/api/v1/stores', (req, res) => {
  const city = req.query.city;
  let stores = [...KNOWN_DARK_STORES];

  if (city) {
    stores = stores.filter(s => s.city.toLowerCase() === city.toLowerCase());
  }

  res.json({
    status: "success",
    count: stores.length,
    data: stores
  });
});

// Dark store details
app.get('/api/v1/stores/:storeId', (req, res) => {
  const store = KNOWN_DARK_STORES.find(s => s.storeId === req.params.storeId);
  if (!store) {
    return res.status(404).json({
      status: "error",
      error: { code: "STORE_NOT_FOUND", message: `No dark store found for id '${req.params.storeId}'` }
    });
  }
  res.json({ status: "success", data: store });
});

/* ====================================================================
   PRODUCT SEARCH & AUTOCOMPLETE ENDPOINTS
   ==================================================================== */

// Product Search
app.get('/api/v1/products/search', (req, res) => {
  const {
    q,
    storeId,
    category,
    subCategory,
    minPrice,
    maxPrice,
    inStockOnly,
    sortBy,
    page,
    limit
  } = req.query;

  const results = catalogService.searchProducts({
    query: q || "",
    storeId: storeId || null,
    category: category || null,
    subCategory: subCategory || null,
    minPrice: minPrice ? parseFloat(minPrice) : null,
    maxPrice: maxPrice ? parseFloat(maxPrice) : null,
    inStockOnly: inStockOnly === "true",
    sortBy: sortBy || "relevance",
    page: page || 1,
    limit: limit || 10
  });

  res.json({
    status: "success",
    data: results
  });
});

// Autocomplete suggestions
app.get('/api/v1/products/autocomplete', (req, res) => {
  const q = req.query.q || "";
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : 5;
  const suggestions = catalogService.getAutocomplete(q, limit);

  res.json({
    status: "success",
    count: suggestions.length,
    data: suggestions
  });
});

// Product Details by ID or Variant ID
app.get('/api/v1/products/:productId', (req, res) => {
  const storeId = req.query.storeId || null;
  const product = catalogService.getProductDetail(req.params.productId, storeId);

  if (!product) {
    return res.status(404).json({
      status: "error",
      error: { code: "PRODUCT_NOT_FOUND", message: `Product '${req.params.productId}' not found in catalog` }
    });
  }

  res.json({
    status: "success",
    data: product
  });
});

/* ====================================================================
   CATEGORY TAXONOMY ENDPOINTS
   ==================================================================== */

// List all top-level categories
app.get('/api/v1/categories', (req, res) => {
  const categories = catalogService.getCategories();
  res.json({
    status: "success",
    count: categories.length,
    data: categories
  });
});

// Get category details with subcategories
app.get('/api/v1/categories/:categoryId', (req, res) => {
  const category = catalogService.getCategoryDetail(req.params.categoryId);
  if (!category) {
    return res.status(404).json({
      status: "error",
      error: { code: "CATEGORY_NOT_FOUND", message: `Category '${req.params.categoryId}' not found` }
    });
  }
  res.json({ status: "success", data: category });
});

// Get products by category
app.get('/api/v1/categories/:categoryId/products', (req, res) => {
  const { subCategory, storeId, page, limit } = req.query;
  const results = catalogService.getProductsByCategory(
    req.params.categoryId,
    subCategory || null,
    storeId || null,
    page || 1,
    limit || 10
  );

  res.json({
    status: "success",
    data: results
  });
});

/* ====================================================================
   API DOCUMENTATION / SPECIFICATION ENDPOINT
   ==================================================================== */

app.get('/api/docs', (req, res) => {
  res.json({
    api: "Unofficial Zepto API",
    version: "1.0.0",
    endpoints: [
      {
        path: "/api/health",
        method: "GET",
        description: "Health status and available subsystem capabilities"
      },
      {
        path: "/api/v1/session/init",
        method: "POST",
        description: "Initialize or refresh client session with CSRF tokens and location context",
        parameters: { latitude: "number (optional)", longitude: "number (optional)", pincode: "string (optional)", storeId: "string (optional)" }
      },
      {
        path: "/api/v1/location/coordinates",
        method: "GET",
        description: "Check delivery serviceability and resolve nearest dark store by GPS coordinates",
        parameters: { lat: "float (required)", lng: "float (required)" }
      },
      {
        path: "/api/v1/location/pincode/:pincode",
        method: "GET",
        description: "Resolve delivery serviceability and dark store by 6-digit Indian pincode",
        parameters: { pincode: "string in path (required)" }
      },
      {
        path: "/api/v1/location/search",
        method: "GET",
        description: "Search supported addresses and delivery areas by query string",
        parameters: { q: "string (required)" }
      },
      {
        path: "/api/v1/stores",
        method: "GET",
        description: "List all known active Zepto dark stores with optional city filter",
        parameters: { city: "string (optional)" }
      },
      {
        path: "/api/v1/stores/:storeId",
        method: "GET",
        description: "Retrieve metadata and location details of a specific dark store",
        parameters: { storeId: "string in path (required)" }
      },
      {
        path: "/api/v1/products/search",
        method: "GET",
        description: "Search products with keywords, store pricing, category, price range, and sorting",
        parameters: {
          q: "string (optional)",
          storeId: "string (optional)",
          category: "string (optional)",
          subCategory: "string (optional)",
          minPrice: "number (optional)",
          maxPrice: "number (optional)",
          inStockOnly: "boolean (optional)",
          sortBy: "relevance | price_asc | price_desc | rating | discount",
          page: "integer (default 1)",
          limit: "integer (default 10)"
        }
      },
      {
        path: "/api/v1/products/autocomplete",
        method: "GET",
        description: "Retrieve search autocomplete suggestions for products and brands",
        parameters: { q: "string (required)", limit: "integer (default 5)" }
      },
      {
        path: "/api/v1/products/:productId",
        method: "GET",
        description: "Retrieve detailed product information, packsize, pricing, variants, and reviews",
        parameters: { productId: "string in path (required)", storeId: "string (optional)" }
      },
      {
        path: "/api/v1/categories",
        method: "GET",
        description: "List all primary categories in the catalog taxonomy"
      },
      {
        path: "/api/v1/categories/:categoryId",
        method: "GET",
        description: "Retrieve full category details, subcategories, and microcategories",
        parameters: { categoryId: "string in path (required)" }
      },
      {
        path: "/api/v1/categories/:categoryId/products",
        method: "GET",
        description: "List products under a given category or subcategory",
        parameters: { subCategory: "string (optional)", storeId: "string (optional)", page: "integer", limit: "integer" }
      }
    ]
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    status: "error",
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: err.message || "An unexpected error occurred"
    }
  });
});

// Start listening
export const server = app.listen(PORT, '127.0.0.1', () => {
  console.log(`[Zepto API] Server listening at http://127.0.0.1:${PORT}`);
});

export default app;
