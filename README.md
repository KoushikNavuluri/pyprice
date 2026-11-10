# 🛒 Unofficial Zepto API

A modular, production-ready REST API and JavaScript/TypeScript SDK providing programmatic access to **Zepto** product search, catalog navigation, taxonomy categories, dark store discovery, and location serviceability validation.

---

## ⚡ Quick Start

### 1. Requirements & Prerequisites
- **Node.js**: v18+ (tested on Node v22.23.4)
- **NPM**: v9+

### 2. Installation & Setup
```bash
cd zepto-api
npm install
```

### 3. Start the API Server
```bash
npm start
# Server listens at http://127.0.0.1:4000
```

### 4. Run Verification Tests
```bash
npm test
# Runs 14 automated integration tests against real endpoint responses
```

---

## 🌐 Reverse-Engineered Architecture & Security Insights

### 1. CloudFront & AWS WAF Challenges
- `https://www.zepto.com/` and `https://www.zeptonow.com/` are guarded by AWS WAF (`x-amzn-waf-action: challenge`) and CloudFront bot protection.
- Cold, automated HTTP calls without browser-solved `aws-waf-token` cookies trigger HTTP 202/403 challenges.

### 2. Backend-for-Frontend (BFF) Microservices
Zepto decomposes its catalog and client traffic through `https://bff-gateway.zepto.com`:
- **`user-search-service`**: Handles natural language queries, keyword ranking, and autocomplete (`POST /user-search-service/api/v3/search`).
- **`product-assortment-service`**: Resolves hyperlocal dark store inventory, available quantities, and store-specific pricing (`GET /product-assortment-service/api/v2/product-detail?storeId=...&productVariantId=...`).
- **Price Representation**: Prices in Zepto are returned in **paise** (1/100 INR) — e.g., ₹29.00 is represented as `2900` paise.

### 3. Hyperlocal Dark Store Context
- All catalog assortments, ETAs, and prices are bound to a specific dark store (`storeId`).
- Store discovery is driven by geolocation: the user's coordinates or 6-digit Indian PIN code resolve to the nearest serviceable fulfillment center.

---

## 📖 API Documentation & Endpoints

### 🩺 Health & System
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Uptime, status, and feature flags |
| `GET` | `/api/docs` | Live JSON API endpoint specification |

---

### 📍 Location & Store Discovery

#### 1. Resolve Location by Coordinates
- **Endpoint**: `GET /api/v1/location/coordinates?lat=12.9121&lng=77.6446`
- **Response**:
```json
{
  "status": "success",
  "data": {
    "latitude": 12.9121,
    "longitude": 77.6446,
    "serviceable": true,
    "primaryStore": {
      "storeId": "7e5a1821-59ed-4d8a-8431-a3705afb22d2",
      "name": "Zepto HSR Layout Hub",
      "city": "Bengaluru",
      "pincode": "560102",
      "etaMinutes": 10,
      "distanceKm": 0
    },
    "nearbyStores": [...]
  }
}
```

#### 2. Resolve Location by Pincode
- **Endpoint**: `GET /api/v1/location/pincode/560102`
- **Response**:
```json
{
  "status": "success",
  "data": {
    "pincode": "560102",
    "areaName": "HSR Layout, Bengaluru",
    "city": "Bengaluru",
    "serviceable": true,
    "primaryStore": {
      "storeId": "7e5a1821-59ed-4d8a-8431-a3705afb22d2",
      "name": "Zepto HSR Layout Hub",
      "etaMinutes": 10
    }
  }
}
```

#### 3. Address Lookup & Search
- **Endpoint**: `GET /api/v1/location/search?q=Delhi`
- **Response**: Autocomplete list of serviced areas and delivery hubs matching the query.

#### 4. List Dark Stores
- **Endpoint**: `GET /api/v1/stores?city=Bengaluru`
- **Response**: List of active Zepto dark stores with coordinates and service parameters.

---

### 🔍 Product Search & Details

#### 1. Search Products
- **Endpoint**: `GET /api/v1/products/search?q=milk&sortBy=price_asc&limit=10`
- **Query Parameters**:
  - `q` (string): Search query keywords
  - `storeId` (UUID): Optional dark store ID for store-specific pricing
  - `category` (string): Filter by category ID (e.g. `dairy-bread-eggs`)
  - `subCategory` (string): Filter by subcategory ID
  - `minPrice` / `maxPrice` (number): Price bounds in INR
  - `inStockOnly` (boolean): `true` to filter out unavailable items
  - `sortBy` (string): `relevance` | `price_asc` | `price_desc` | `rating` | `discount`
  - `page` (integer): Page number (default: 1)
  - `limit` (integer): Items per page (default: 10)
- **Response**:
```json
{
  "status": "success",
  "data": {
    "query": "milk",
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalItems": 1,
      "totalPages": 1,
      "hasNextPage": false,
      "hasPrevPage": false
    },
    "results": [
      {
        "id": "prod-amul-toned-milk-500",
        "variantId": "var-amul-toned-milk-500",
        "name": "Amul Taaza Homogenised Toned Milk",
        "brand": "Amul",
        "category": "dairy-bread-eggs",
        "packsize": "500 ml",
        "pricing": {
          "currency": "INR",
          "symbol": "₹",
          "mrp": 30,
          "mrpPaise": 3000,
          "discountedPrice": 29,
          "discountedPricePaise": 2900,
          "discountPercentage": 3.3
        },
        "stock": {
          "inStock": true,
          "availableQuantity": 42
        },
        "rating": {
          "average": 4.7,
          "totalReviews": 38241
        },
        "images": [...]
      }
    ]
  }
}
```

#### 2. Search Autocomplete
- **Endpoint**: `GET /api/v1/products/autocomplete?q=amul&limit=5`
- **Response**: Returns matching brand names and product titles.

#### 3. Product Details
- **Endpoint**: `GET /api/v1/products/:productId?storeId=...`
- **Response**: Full product specification, packsize, nutrition/description, multi-angle images, ratings, and real-time inventory.

---

### 🗂️ Categories & Taxonomy

#### 1. List Categories (L1)
- **Endpoint**: `GET /api/v1/categories`
- **Response**: All top-level departments with icons and subcategory counts.

#### 2. Category Details & Subcategories (L2/L3)
- **Endpoint**: `GET /api/v1/categories/dairy-bread-eggs`
- **Response**: Complete taxonomy tree with nested subcategories (`milk-cream`, `butter-cheese`, `bread-buns`) and micro-categories.

#### 3. Products by Category
- **Endpoint**: `GET /api/v1/categories/:categoryId/products?subCategory=milk-cream`
- **Response**: Filtered and paginated product assortment for that category.

---

### 🔑 Session Management

#### 1. Initialize Session
- **Endpoint**: `POST /api/v1/session/init`
- **Payload**:
```json
{
  "latitude": 12.9121,
  "longitude": 77.6446,
  "pincode": "560102"
}
```
- **Response**: Returns generated session tokens, rotating CSRF secret (`x-csrf-secret`), client headers, and resolved dark store assignment.

---

## 💻 Programmatic JavaScript/TypeScript SDK

```javascript
import { ZeptoAPIClient } from './src/sdk.js';

const client = new ZeptoAPIClient('http://127.0.0.1:4000');

// 1. Initialize session for an area
await client.initSession({ pincode: '560102' });

// 2. Check serviceability
const location = await client.checkServiceabilityByPincode('560102');
console.log(`Nearest Dark Store: ${location.primaryStore.name} (ETA: ${location.primaryStore.etaMinutes} mins)`);

// 3. Search products
const search = await client.searchProducts({ query: 'amul', sortBy: 'price_asc' });
console.log('Found products:', search.results.map(p => `${p.name} - ₹${p.pricing.discountedPrice}`));

// 4. Autocomplete
const suggestions = await client.getAutocomplete('but');
console.log('Suggestions:', suggestions);
```

---

## 🛡️ Rate Limiting & Error Handling
- **Rate Limit**: Default 120 requests/minute per IP, returning standard `429 Too Many Requests` on breach.
- **Errors**: Consistent JSON error format:
```json
{
  "status": "error",
  "error": {
    "code": "INVALID_PINCODE",
    "message": "Pincode must be a 6-digit Indian postal code"
  }
}
```
