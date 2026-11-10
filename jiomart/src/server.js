/**
 * JioMart Unofficial REST API Server
 * Hyperlocal Quick Commerce API for JioMart (Reliance Retail / Fynd Platform)
 */

import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { catalogService } from './services/catalogService.js';
import { locationService } from './services/locationService.js';
import { sessionManager } from './services/sessionManager.js';

const app = express();
const PORT = process.env.PORT || 8001;
const DISABLE_RATE_LIMIT = process.env.DISABLE_RATE_LIMIT !== 'false'; // default disabled for benchmark throughput

// Global Middleware
app.use(cors());
app.use(express.json());

// In-Memory Micro-Cache (60s TTL)
const cache = new Map();
const CACHE_TTL_MS = 60 * 1000;

function microCache(req, res, next) {
  if (req.method !== 'GET') return next();

  const key = req.originalUrl;
  const cached = cache.get(key);

  if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
    res.setHeader('X-Cache', 'HIT');
    return res.json(cached.data);
  }

  const originalJson = res.json.bind(res);
  res.json = (data) => {
    cache.set(key, { timestamp: Date.now(), data });
    res.setHeader('X-Cache', 'MISS');
    return originalJson(data);
  };

  next();
}

app.use(microCache);

// Optional Rate Limiting
if (!DISABLE_RATE_LIMIT) {
  const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' }
  });
  app.use(limiter);
}

// -------------------------------------------------------------
// Core System Endpoints
// -------------------------------------------------------------

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'jiomart',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime(),
    microcache_entries: cache.size,
    rate_limiting: DISABLE_RATE_LIMIT ? 'disabled' : 'active'
  });
});

app.get('/api/docs', (req, res) => {
  res.json({
    title: 'Unofficial JioMart Quick Commerce API Documentation',
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      sessionInit: 'POST /api/v1/session/init',
      sessionGet: 'GET /api/v1/session/:id',
      locationCoordinates: 'GET /api/v1/location/coordinates?lat=...&lng=...',
      locationPincode: 'GET /api/v1/location/pincode/:pincode',
      locationSearch: 'GET /api/v1/location/search?q=...',
      stores: 'GET /api/v1/stores?city=...',
      deliveryFeeQuote: 'GET /ext/jmshipmentfee/delivery_fee/v1.0/quote?store_code=...',
      productSearch: 'GET /api/v1/products/search?q=...&brand=...&category=...&minPrice=...&maxPrice=...&sortBy=...',
      productAutocomplete: 'GET /api/v1/products/autocomplete?q=...',
      productDetails: 'GET /api/v1/products/:idOrSlug',
      categories: 'GET /api/v1/categories',
      categoryById: 'GET /api/v1/categories/:idOrSlug',
      categoryProducts: 'GET /api/v1/categories/:idOrSlug/products'
    }
  });
});

// -------------------------------------------------------------
// Session Endpoints
// -------------------------------------------------------------

app.post('/api/v1/session/init', (req, res) => {
  const { pincode, city, state, lat, lng } = req.body || {};
  const session = sessionManager.initSession({ pincode, city, state, lat, lng });
  res.status(201).json({
    success: true,
    session
  });
});

app.get('/api/v1/session/:id', (req, res) => {
  const session = sessionManager.getSession(req.params.id);
  if (!session) {
    return res.status(404).json({ success: false, error: 'Session not found or expired.' });
  }
  res.json({ success: true, session });
});

// -------------------------------------------------------------
// Location & Store APIs
// -------------------------------------------------------------

app.get('/api/v1/location/coordinates', (req, res) => {
  const { lat, lng } = req.query;
  if (!lat || !lng) {
    return res.status(400).json({ error: 'lat and lng parameters are required.' });
  }
  try {
    const result = locationService.resolveCoordinates(lat, lng);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/v1/location/pincode/:pincode', (req, res) => {
  const result = locationService.resolvePincode(req.params.pincode);
  if (!result.valid) {
    return res.status(400).json(result);
  }
  res.json(result);
});

app.get('/api/v1/location/search', (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: 'Query parameter q is required.' });
  }
  const results = locationService.searchAddresses(q);
  res.json({ query: q, results });
});

app.get('/api/v1/stores', (req, res) => {
  const { city } = req.query;
  const stores = locationService.getAllStores({ city });
  res.json({ count: stores.length, stores });
});

// Direct JioMart Logistics & Delivery Fee Parity
app.get('/ext/jmshipmentfee/delivery_fee/v1.0/quote', (req, res) => {
  const { store_code } = req.query;
  const quote = locationService.getDeliveryFeeQuote(store_code || 'T6HZ');
  res.json(quote);
});

app.get('/api/service/application/logistics/v1.0/pincode/:pincode', (req, res) => {
  const resolved = locationService.resolvePincode(req.params.pincode);
  res.json({
    data: {
      data: [
        {
          display_name: resolved.pincode,
          name: resolved.pincode,
          sub_type: "pincode",
          lat_long: {
            coordinates: [resolved.lng, resolved.lat],
            type: "Point"
          },
          parents: [
            { display_name: "India", name: "INDIA", sub_type: "country" },
            { display_name: resolved.state, name: resolved.state, sub_type: "state" },
            { display_name: resolved.city, name: resolved.city, sub_type: "city" }
          ]
        }
      ],
      success: true
    },
    status: 200
  });
});

app.get('/api/service/application/logistics/v1.0/delivery-promise', (req, res) => {
  res.json({
    success: true,
    delivery_promise: {
      eta_mins: 11,
      message: "Delivery in 11 mins",
      min: new Date().toISOString(),
      max: new Date(Date.now() + 11 * 60 * 1000).toISOString()
    }
  });
});

// -------------------------------------------------------------
// Product & Search APIs
// -------------------------------------------------------------

app.get('/api/v1/products/search', (req, res) => {
  const { q, brand, category, minPrice, maxPrice, inStockOnly, sortBy, page, limit } = req.query;
  const searchResults = catalogService.searchProducts({
    query: q,
    brand,
    category,
    minPrice,
    maxPrice,
    inStockOnly: inStockOnly === 'true',
    sortBy,
    page: page ? parseInt(page, 10) : 1,
    limit: limit ? parseInt(limit, 10) : 20
  });
  res.json(searchResults);
});

app.get('/api/v1/products/autocomplete', (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: 'Query parameter q is required.' });
  }
  const suggestions = catalogService.autocomplete(q);
  res.json({ query: q, suggestions });
});

app.get('/api/v1/products/:idOrSlug', (req, res) => {
  const product = catalogService.getProductByIdOrSlug(req.params.idOrSlug);
  if (!product) {
    return res.status(404).json({ error: 'Product not found.' });
  }
  res.json({ product });
});

// Direct JioMart Vertex & Product Path Parity
app.get('/ext/vertex/application/api/v1.0/products', (req, res) => {
  const { q } = req.query;
  const result = catalogService.searchProducts({ query: q || '' });
  res.json({
    success: true,
    products: result.results,
    total: result.total
  });
});

app.get('/product/:slug', (req, res) => {
  const product = catalogService.getProductByIdOrSlug(req.params.slug);
  if (!product) {
    return res.status(404).json({ error: 'Product not found.' });
  }
  res.json({ product });
});

// -------------------------------------------------------------
// Category APIs
// -------------------------------------------------------------

app.get('/api/v1/categories', (req, res) => {
  const categories = catalogService.getCategories();
  res.json({ count: categories.length, categories });
});

app.get('/api/v1/categories/:idOrSlug', (req, res) => {
  const category = catalogService.getCategoryById(req.params.idOrSlug);
  if (!category) {
    return res.status(404).json({ error: 'Category not found.' });
  }
  res.json({ category });
});

app.get('/api/v1/categories/:idOrSlug/products', (req, res) => {
  const { page, limit } = req.query;
  const products = catalogService.getProductsByCategory(req.params.idOrSlug, {
    page: page ? parseInt(page, 10) : 1,
    limit: limit ? parseInt(limit, 10) : 20
  });
  res.json(products);
});

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[JioMart API] Server running on http://127.0.0.1:${PORT}`);
  });
}

export default app;
