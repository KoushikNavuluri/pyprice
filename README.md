# ⚡ PyPrice: Unified Quick-Commerce API Suite (Zepto + Swiggy Instamart + Blinkit)

**PyPrice** is a production-ready, ultra-fast reverse-engineered API suite and SDK providing programmatic access to India's top three quick-commerce platforms: **Zepto**, **Swiggy Instamart**, and **Blinkit** (formerly Grofers).

---

## 🚀 Key Highlights & Benchmarked Performance

| Platform | Port | Throughput | Median Latency (p50) | Rate Limiting | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Zepto API** | `4000` | **1,241.4 req/s** | 18.11 ms (1.7 ms cached) | **0% (Disabled)** | `ACTIVE` |
| **Swiggy Instamart API** | `5000` | **1,270.0 req/s** | 17.28 ms (2.4 ms cached) | **0% (Disabled)** | `ACTIVE` |
| **Blinkit API** | `6001` | **1,181.2 req/s** | 17.52 ms (1.1 ms cached) | **0% (Disabled)** | `ACTIVE` |

- **Zero Rate Limiting**: All servers feature zero-penalty rate limiting (`DISABLE_RATE_LIMIT=true`) for high-concurrency scrapers, trading agents, and price aggregators.
- **Micro-Caching**: In-memory 60-second micro-cache serving repeated calls in sub-2ms time.
- **Dynamic Session Generation**: Automatic cryptographic generation of UUIDs, anonymous tokens, device IDs, and location cookies (`deviceId`, `sid`, `tid`, `auth_key`, `gr_1_lat`/`gr_1_lng`).
- **Hyperlocal Geo-Resolution**: Dark store / merchant pod resolution and serviceability validation for GPS coordinates and 6-digit Indian PIN codes across Delhi NCR, Bengaluru, Mumbai, and Gurgaon.

---

## 📁 Repository Structure

```
pyprice/
├── index.js                     # Unified Multi-Platform SDK (PyPriceClient)
├── package.json                 # Project scripts & dependencies
├── zepto/                       # Unofficial Zepto API Subsystem (Port 4000)
│   ├── src/
│   │   ├── server.js            # Express REST server
│   │   ├── sdk.js               # Zepto programmatic client
│   │   └── services/            # Catalog, Location, and Session services
│   ├── data/                    # Dark stores, products, and categories
│   └── test/                    # Integration & 1000-req benchmark suites
├── instamart/                   # Unofficial Swiggy Instamart API Subsystem (Port 5000)
│   ├── README.md                # Instamart architecture & endpoints
│   ├── src/
│   │   ├── server.js            # Express REST server
│   │   ├── sdk.js               # Instamart programmatic client
│   │   └── services/            # Catalog, Pods, and Session services
│   ├── data/                    # Pods, products, and categories
│   └── test/                    # Integration & 1000-req benchmark suites
└── blinkit/                     # Unofficial Blinkit API Subsystem (Port 6001)
    ├── README.md                # Blinkit architecture & reverse-engineered endpoints
    ├── package.json             # Blinkit module config
    ├── src/
    │   ├── server.js            # Express REST server
    │   ├── sdk.js               # Blinkit programmatic client
    │   └── services/            # Catalog, Dark Store, and Session services
    ├── data/                    # Dark stores, products, and categories
    └── test/                    # Integration & 1000-req benchmark suites
```

---

## ⚡ Quick Start

### 1. Installation
```bash
git clone https://github.com/KoushikNavuluri/pyprice.git
cd pyprice
npm install
```

### 2. Start Servers
```bash
# Start Zepto API (Port 4000)
npm run start:zepto

# Start Swiggy Instamart API (Port 5000)
npm run start:instamart

# Start Blinkit API (Port 6001)
npm run start:blinkit
```

### 3. Run Automated Tests
```bash
# Test all three platforms
npm test

# Run high-concurrency (1,000 requests) throughput benchmarks
npm run bench:zepto
npm run bench:instamart
npm run bench:blinkit
```

---

## 📖 Endpoints Comparison Matrix

| Functionality | Zepto (`:4000`) | Swiggy Instamart (`:5000`) | Blinkit (`:6001`) |
| :--- | :--- | :--- | :--- |
| **Health Check** | `GET /api/health` | `GET /api/health` | `GET /api/health` |
| **Session Initialization** | `POST /api/v1/session/init` | `POST /api/v1/session/init` | `POST /api/v1/session/init` |
| **Coords Serviceability** | `GET /api/v1/location/coordinates?lat=...&lng=...` | `GET /api/v1/location/coordinates?lat=...&lng=...` | `GET /api/v1/location/coordinates?lat=...&lng=...` |
| **PIN Code Validation** | `GET /api/v1/location/pincode/:pincode` | `GET /api/v1/location/pincode/:pincode` | `GET /api/v1/location/pincode/:pincode` |
| **Dark Store Discovery** | `GET /api/v1/stores?city=...` | `GET /api/v1/pods?city=...` | `GET /api/v1/stores?city=...` |
| **Product Search** | `GET /api/v1/products/search?q=...` | `GET /api/v1/products/search?q=...` | `GET /api/v1/products/search?q=...` |
| **Search Autocomplete** | `GET /api/v1/products/autocomplete?q=...` | `GET /api/v1/products/autocomplete?q=...` | `GET /api/v1/products/autocomplete?q=...` |
| **Product Details** | `GET /api/v1/products/:id` | `GET /api/v1/products/:id` | `GET /api/v1/products/:id` |
| **SDUI Product Layout** | — | — | `GET /v1/layout/product/:id` |
| **Categories Tree** | `GET /api/v1/categories` | `GET /api/v1/categories` | `GET /api/v1/categories` |
| **Category Products** | `GET /api/v1/categories/:id/products` | `GET /api/v1/categories/:id/products` | `GET /api/v1/categories/:id/products` |

---

## 💻 Unified SDK Usage Example

```javascript
import { PyPriceClient } from 'pyprice';

const client = new PyPriceClient({
  zeptoBaseUrl: 'http://127.0.0.1:4000',
  instamartBaseUrl: 'http://127.0.0.1:5000',
  blinkitBaseUrl: 'http://127.0.0.1:6001'
});

// Compare prices across all three platforms simultaneously
const comparison = await client.compareProducts('milk');
console.log('Zepto results:', comparison.zepto.length);
console.log('Instamart results:', comparison.instamart.length);
console.log('Blinkit results:', comparison.blinkit.length);
```

---

## 🛡️ License & Ethics
This project is built for reverse engineering, research, and non-commercial interoperability. All product trademarks, logos, and brand names belong to their respective owners.
