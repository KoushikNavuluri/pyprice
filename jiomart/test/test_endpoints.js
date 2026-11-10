/**
 * Automated Endpoint Test Suite for JioMart API
 */

process.env.NODE_ENV = 'test';

import http from 'http';
import app from '../src/server.js';
import { JioMartClient } from '../src/sdk.js';

let server;
let client;
const TEST_PORT = 8091;

async function startServer() {
  return new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(TEST_PORT, () => {
      client = new JioMartClient(`http://127.0.0.1:${TEST_PORT}`);
      resolve();
    });
  });
}

async function stopServer() {
  return new Promise((resolve) => {
    server.close(resolve);
  });
}

async function runTests() {
  console.log('==================================================');
  console.log('🧪 JIOMART API INTEGRATION TEST SUITE');
  console.log(`Target: http://127.0.0.1:${TEST_PORT}`);
  console.log('==================================================\n');

  await startServer();
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     Error: ${err.message}`);
      failed++;
    }
  }

  try {
    // 1. Health
    await test('GET /api/health returns 200 and healthy status', async () => {
      const res = await client.checkHealth();
      if (res.status !== 'healthy' || res.platform !== 'jiomart') {
        throw new Error(`Unexpected health payload: ${JSON.stringify(res)}`);
      }
    });

    // 2. Docs
    await test('GET /api/docs returns API endpoint index', async () => {
      const res = await client.getDocumentation();
      if (!res.endpoints || !res.endpoints.productSearch) {
        throw new Error('API docs missing endpoint references');
      }
    });

    // 3. Session Init
    let sessionId;
    await test('POST /api/v1/session/init initializes session with cookies', async () => {
      const res = await client.initSession({ pincode: '400001', city: 'MUMBAI' });
      if (!res.success || !res.session.sessionId || !res.session.cookies.app_location_details) {
        throw new Error('Failed to bootstrap session');
      }
      sessionId = res.session.sessionId;
    });

    // 4. Session Get
    await test('GET /api/v1/session/:id retrieves initialized session', async () => {
      const res = await client.getSession(sessionId);
      if (!res.success || res.session.location.pincode !== '400001') {
        throw new Error('Failed to retrieve active session');
      }
    });

    // 5. Coordinates
    await test('GET /api/v1/location/coordinates resolves nearest store', async () => {
      const res = await client.resolveCoordinates(18.9316, 72.8325);
      if (!res.serviceable || !res.nearestStore || res.nearestStore.code !== 'T6HZ') {
        throw new Error(`Unexpected coordinates resolution: ${JSON.stringify(res)}`);
      }
    });

    // 6. Pincode Valid
    await test('GET /api/v1/location/pincode/400001 validates Mumbai PIN', async () => {
      const res = await client.resolvePincode('400001');
      if (!res.valid || res.city !== 'MUMBAI') {
        throw new Error(`Failed to resolve 400001: ${JSON.stringify(res)}`);
      }
    });

    // 7. Pincode Invalid
    await test('GET /api/v1/location/pincode/123 rejects invalid PIN', async () => {
      try {
        await client.resolvePincode('123');
        throw new Error('Should have thrown 400');
      } catch (err) {
        if (!err.message.includes('400') && !err.message.includes('Invalid PIN code')) {
          throw err;
        }
      }
    });

    // 8. Location Autocomplete
    await test('GET /api/v1/location/search?q=HSR returns landmarks', async () => {
      const res = await client.searchLocation('HSR');
      if (!res.results || res.results.length === 0 || !res.results[0].description.includes('HSR')) {
        throw new Error(`Address search failed: ${JSON.stringify(res)}`);
      }
    });

    // 9. Stores
    await test('GET /api/v1/stores returns fulfillment centers', async () => {
      const res = await client.getStores();
      if (!res.stores || res.stores.length === 0) {
        throw new Error('No stores returned');
      }
    });

    // 10. Delivery Fee Quote
    await test('GET /ext/jmshipmentfee/delivery_fee/v1.0/quote returns fee schedule', async () => {
      const res = await client.getDeliveryFeeQuote('T6HZ');
      if (!res.result || !res.result.delivery_fee_list || res.result.delivery_fee_list.length === 0) {
        throw new Error(`Delivery fee quote failed: ${JSON.stringify(res)}`);
      }
    });

    // 11. Product Search
    await test('GET /api/v1/products/search?q=milk returns products', async () => {
      const res = await client.searchProducts({ query: 'milk' });
      if (res.total === 0 || !res.results.some(p => p.name.toLowerCase().includes('milk'))) {
        throw new Error(`Product search failed: ${JSON.stringify(res)}`);
      }
    });

    // 12. Product Search with Sorting
    await test('GET /api/v1/products/search?q=milk&sortBy=price_asc sorts correctly', async () => {
      const res = await client.searchProducts({ query: 'milk', sortBy: 'price_asc' });
      if (res.results.length >= 2) {
        const p1 = res.results[0].price.effective.min;
        const p2 = res.results[1].price.effective.min;
        if (p1 > p2) throw new Error(`Sorting price_asc failed: ${p1} > ${p2}`);
      }
    });

    // 13. Autocomplete
    await test('GET /api/v1/products/autocomplete?q=amul returns suggestions', async () => {
      const res = await client.autocomplete('amul');
      if (!res.suggestions || res.suggestions.length === 0) {
        throw new Error(`Autocomplete failed: ${JSON.stringify(res)}`);
      }
    });

    // 14. Product Details by UID
    await test('GET /api/v1/products/7529366 returns Amul Taaza Milk specifications', async () => {
      const res = await client.getProduct(7529366);
      if (!res.product || res.product.uid !== 7529366 || !res.product.attributes.manufacturer_name) {
        throw new Error(`Product lookup by UID failed: ${JSON.stringify(res)}`);
      }
    });

    // 15. Product Details by Slug
    await test('GET /api/v1/products/:slug returns product by slug', async () => {
      const res = await client.getProduct('amul-taaza-toned-milky-milk-500-ml-mffn43-7529366');
      if (!res.product || res.product.slug !== 'amul-taaza-toned-milky-milk-500-ml-mffn43-7529366') {
        throw new Error(`Product lookup by slug failed: ${JSON.stringify(res)}`);
      }
    });

    // 16. Categories List
    await test('GET /api/v1/categories returns taxonomy trees', async () => {
      const res = await client.getCategories();
      if (!res.categories || res.categories.length === 0) {
        throw new Error('Categories list empty');
      }
    });

    // 17. Category by ID
    await test('GET /api/v1/categories/10416 returns Dairy & Bakery', async () => {
      const res = await client.getCategory('10416');
      if (!res.category || res.category.value !== 'dairy-bakery') {
        throw new Error(`Category lookup failed: ${JSON.stringify(res)}`);
      }
    });

    // 18. Category Products
    await test('GET /api/v1/categories/dairy-bakery/products returns products', async () => {
      const res = await client.getCategoryProducts('dairy-bakery');
      if (res.total === 0 || !res.results || res.results.length === 0) {
        throw new Error(`Category products failed: ${JSON.stringify(res)}`);
      }
    });

  } finally {
    await stopServer();
  }

  console.log('\n==================================================');
  console.log(`Test Execution Finished: ${passed} passed, ${failed} failed`);
  console.log('==================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
