/**
 * Unofficial Swiggy Instamart REST API Server
 * Provides ultra-fast, programmatic access to Instamart product catalog, search, dark store pods, and location validation.
 */

import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { CatalogService } from './services/catalogService.js';
import {
  resolveLocationByCoordinates,
  resolveLocationByPincode,
  searchAddresses,
  getPods
} from './services/locationService.js';
import { SessionManager } from './services/sessionManager.js';

const app = express();
const PORT = process.env.PORT || 5000;

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

// Logging middleware (silenced when SILENT_LOGS=true)
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

// Rate Limiting: Disabled by default or when DISABLE_RATE_LIMIT=true
const disableRateLimit = process.env.DISABLE_RATE_LIMIT !== 'false';
if (!disableRateLimit) {
  const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      status: "error",
      error: { code: "RATE_LIMIT_EXCEEDED", message: "Too many requests, please slow down." }
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
    name: "Unofficial Swiggy Instamart API",
    version: "1.0.0",
    description: "Programmatic REST API for Swiggy Instamart product search, catalog, pods, and location serviceability",
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
      podDiscovery: true,
      sessionManagement: true
    }
  });
});

/* ====================================================================
   SESSION MANAGEMENT ENDPOINTS
   ==================================================================== */

app.post('/api/v1/session/init', (req, res) => {
  const { latitude, longitude, pincode, podId } = req.body || {};
  let resolvedPodId = podId;

  if (!resolvedPodId && latitude && longitude) {
    const loc = resolveLocationByCoordinates(parseFloat(latitude), parseFloat(longitude));
    if (loc.serviceable) resolvedPodId = loc.primaryPod.podId;
  } else if (!resolvedPodId && pincode) {
    const loc = resolveLocationByPincode(pincode);
    if (loc.serviceable) resolvedPodId = loc.primaryPod.podId;
  }

  const session = sessionManager.createSession({
    latitude,
    longitude,
    pincode,
    podId: resolvedPodId
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
   LOCATION & DARK STORE (POD) ENDPOINTS
   ==================================================================== */

// Resolve serviceability by coordinates
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
  const { pincode } = req.params;
  try {
    const result = resolveLocationByPincode(pincode);
    res.json({
      status: "success",
      data: result
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      error: { code: "INVALID_PINCODE", message: err.message }
    });
  }
});

// Autocomplete address search
app.get('/api/v1/location/search', (req, res) => {
  const query = req.query.q || "";
  if (!query) {
    return res.status(400).json({
      status: "error",
      error: { code: "EMPTY_QUERY", message: "Query parameter 'q' is required" }
    });
  }
  const results = searchAddresses(query);
  res.json({
    status: "success",
    count: results.length,
    data: results
  });
});

// List fulfillment pods
app.get('/api/v1/pods', (req, res) => {
  const city = req.query.city || null;
  const pods = getPods(city);
  res.json({
    status: "success",
    count: pods.length,
    data: pods
  });
});

/* ====================================================================
   PRODUCT & SEARCH ENDPOINTS
   ==================================================================== */

// Full-text product search with filters, sorting, and pagination
app.get('/api/v1/products/search', (req, res) => {
  const {
    q,
    query,
    podId,
    pincode,
    latitude,
    longitude,
    address,
    category,
    subCategory,
    brand,
    minPrice,
    maxPrice,
    inStockOnly,
    sortBy,
    page,
    limit
  } = req.query;

  const searchQuery = q || query || "";
  let effectivePodId = podId || null;
  let locationContext = null;

  if (!effectivePodId) {
    if (latitude && longitude) {
      const loc = resolveLocationByCoordinates(parseFloat(latitude), parseFloat(longitude));
      if (loc.serviceable && loc.primaryPod) {
        effectivePodId = loc.primaryPod.podId;
        locationContext = {
          serviceable: true,
          podId: loc.primaryPod.podId,
          storeName: loc.primaryPod.storeName,
          sla: loc.primaryPod.sla?.display || "10 mins",
          distanceKm: loc.primaryPod.distanceKm
        };
      } else {
        locationContext = { serviceable: false, reason: loc.message || "Location not serviceable" };
      }
    } else if (pincode) {
      const loc = resolveLocationByPincode(pincode);
      if (loc.serviceable && loc.primaryPod) {
        effectivePodId = loc.primaryPod.podId;
        locationContext = {
          serviceable: true,
          podId: loc.primaryPod.podId,
          storeName: loc.primaryPod.storeName,
          sla: loc.primaryPod.sla?.display || "10 mins",
          pincode
        };
      } else {
        locationContext = { serviceable: false, reason: loc.message || `Pincode ${pincode} not serviceable`, pincode };
      }
    } else if (address) {
      const addrs = searchAddresses(address);
      if (addrs.length > 0) {
        const loc = resolveLocationByCoordinates(addrs[0].latitude, addrs[0].longitude);
        if (loc.serviceable && loc.primaryPod) {
          effectivePodId = loc.primaryPod.podId;
          locationContext = {
            serviceable: true,
            podId: loc.primaryPod.podId,
            storeName: loc.primaryPod.storeName,
            sla: loc.primaryPod.sla?.display || "10 mins",
            distanceKm: loc.primaryPod.distanceKm,
            matchedAddress: addrs[0].formattedAddress
          };
        }
      }
    }
  }

  if (locationContext && !locationContext.serviceable) {
    return res.json({
      status: "success",
      data: {
        query: searchQuery || null,
        podId: null,
        locationContext,
        pagination: { page: 1, limit: limit || 10, totalItems: 0, totalPages: 0 },
        results: [],
        message: locationContext.reason || "Location not serviceable"
      }
    });
  }

  const results = catalogService.searchProducts({
    query: searchQuery,
    podId: effectivePodId,
    category,
    subCategory,
    brand,
    minPrice: minPrice ? parseFloat(minPrice) : null,
    maxPrice: maxPrice ? parseFloat(maxPrice) : null,
    inStockOnly: inStockOnly === 'true' || inStockOnly === '1',
    sortBy: sortBy || "relevance",
    page: page || 1,
    limit: limit || 10
  });

  if (locationContext) {
    results.locationContext = locationContext;
  }

  res.json({
    status: "success",
    data: results
  });
});

// Search Autocomplete / Suggestions
app.get('/api/v1/products/autocomplete', (req, res) => {
  const query = req.query.q || req.query.query || "";
  if (!query) {
    return res.json({ status: "success", count: 0, data: [] });
  }

  const suggestions = catalogService.getAutocomplete(query, parseInt(req.query.limit, 10) || 5);
  res.json({
    status: "success",
    count: suggestions.length,
    data: suggestions
  });
});

// Product Details
app.get('/api/v1/products/:id', (req, res) => {
  const { id } = req.params;
  const podId = req.query.podId || null;

  const product = catalogService.getProductDetail(id, podId);
  if (!product) {
    return res.status(404).json({
      status: "error",
      error: { code: "PRODUCT_NOT_FOUND", message: `No product found matching id/sku '${id}'` }
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

// List All L1 Categories
app.get('/api/v1/categories', (req, res) => {
  const categories = catalogService.getCategories();
  res.json({
    status: "success",
    count: categories.length,
    data: categories
  });
});

// Get Category Details with Subcategories
app.get('/api/v1/categories/:id', (req, res) => {
  const category = catalogService.getCategoryDetail(req.params.id);
  if (!category) {
    return res.status(404).json({
      status: "error",
      error: { code: "CATEGORY_NOT_FOUND", message: `Category '${req.params.id}' does not exist` }
    });
  }
  res.json({
    status: "success",
    data: category
  });
});

// Get Products under a Category
app.get('/api/v1/categories/:id/products', (req, res) => {
  const categoryId = req.params.id;
  const subCategory = req.query.subCategory || null;
  const podId = req.query.podId || null;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  const results = catalogService.getProductsByCategory(categoryId, subCategory, podId, page, limit);
  res.json({
    status: "success",
    data: results
  });
});

/* ====================================================================
   OPENAPI / ENDPOINT DOCUMENTATION
   ==================================================================== */

app.get('/api/docs', (req, res) => {
  res.json({
    title: "Unofficial Swiggy Instamart API Specification",
    version: "1.0.0",
    baseUrl: `http://127.0.0.1:${PORT}`,
    endpoints: [
      { method: "GET", path: "/api/health", description: "Service health and uptime" },
      { method: "POST", path: "/api/v1/session/init", description: "Initialize session, cookies, and tokens" },
      { method: "GET", path: "/api/v1/location/coordinates?lat=...&lng=...", description: "Resolve delivery pod by GPS coords" },
      { method: "GET", path: "/api/v1/location/pincode/:pincode", description: "Validate serviceability by 6-digit Indian PIN" },
      { method: "GET", path: "/api/v1/location/search?q=...", description: "Address lookup and autocomplete" },
      { method: "GET", path: "/api/v1/pods?city=...", description: "Discover Instamart fulfillment pods" },
      { method: "GET", path: "/api/v1/products/search?q=...", description: "Full-text product search with filters" },
      { method: "GET", path: "/api/v1/products/autocomplete?q=...", description: "Live search autocomplete and brand suggestions" },
      { method: "GET", path: "/api/v1/products/:id", description: "Get product details by SKU or Item ID" },
      { method: "GET", path: "/api/v1/categories", description: "Browse top-level category taxonomy" },
      { method: "GET", path: "/api/v1/categories/:id", description: "View category with subcategories & layout IDs" },
      { method: "GET", path: "/api/v1/categories/:id/products", description: "List products under category" }
    ]
  });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Instamart API] Server listening at http://127.0.0.1:${PORT}`);
});
