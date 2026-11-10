/**
 * Test Suite for Unofficial BigBasket API
 */

const BASE_URL = 'http://127.0.0.1:7001';

async function runTests() {
  console.log('=== STARTING BIGBASKET API TEST SUITE ===\n');
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      process.stdout.write(`TEST: ${name} ... `);
      await fn();
      console.log('✅ PASSED');
      passed++;
    } catch (err) {
      console.log(`❌ FAILED: ${err.message}`);
      failed++;
    }
  }

  // 1. Health check
  await test('GET /api/health returns healthy status', async () => {
    const res = await fetch(`${BASE_URL}/api/health`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.status !== 'healthy' || !data.features.search) {
      throw new Error(`Unexpected body: ${JSON.stringify(data)}`);
    }
  });

  // 2. Session Initialization
  let testSessionId = null;
  await test('POST /api/v1/session/init creates session with cookies & bbMid', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/session/init`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pincode: '560102' })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.data.sessionId || !data.data.bbMid || !data.data.cookies._bb_nhid) {
      throw new Error('Missing session attributes');
    }
    testSessionId = data.data.sessionId;
  });

  // 3. Session Retrieval
  await test('GET /api/v1/session/:id returns existing session', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/session/${testSessionId}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data.data.sessionId !== testSessionId) {
      throw new Error('Session ID mismatch');
    }
  });

  // 4. Location by Coordinates
  await test('GET /api/v1/location/coordinates resolves Bangalore HSR hub', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/location/coordinates?lat=12.9121&lng=77.6446`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json.data.serviceable || json.data.primaryHub.city !== 'Bengaluru') {
      throw new Error(`Unexpected location result: ${JSON.stringify(json)}`);
    }
  });

  // 5. Location by Pincode
  await test('GET /api/v1/location/pincode/560102 resolves serviceable hub', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/location/pincode/560102`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json.data.serviceable || json.data.primaryHub.hubId !== '7427') {
      throw new Error(`Unexpected pincode result: ${JSON.stringify(json)}`);
    }
  });

  // 6. Address Search
  await test('GET /api/v1/location/search?q=HSR finds HSR Layout', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/location/search?q=HSR`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.count < 1 || !json.data[0].mainText.includes('HSR')) {
      throw new Error('Address search failed to find HSR');
    }
  });

  // 7. Places Autocomplete Alias
  await test('GET /places/v1/places/autocomplete returns predictions', async () => {
    const res = await fetch(`${BASE_URL}/places/v1/places/autocomplete?inputText=Koramangala`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.status !== 'OK' || !json.predictions.length) {
      throw new Error('Places autocomplete failed');
    }
  });

  // 8. Dark Store Hubs Discovery
  await test('GET /api/v1/hubs returns fulfillment hubs', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/hubs`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.count < 5) throw new Error(`Too few hubs returned: ${json.count}`);
  });

  // 9. Product Search
  await test('GET /api/v1/products/search?q=milk finds milk items', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/products/search?q=milk`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json.data.results.length || !json.data.results.some(p => p.name.toLowerCase().includes('milk'))) {
      throw new Error('Search did not return milk items');
    }
  });

  // 10. Search Autocomplete
  await test('GET /api/products/autocomplete?q=fresho returns suggestions', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/products/autocomplete?q=fresho`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.count < 1) throw new Error('No autocomplete suggestions found');
  });

  // 11. Native term-completion alias
  await test('GET /listing-svc/v1/product/term-completion returns terms', async () => {
    const res = await fetch(`${BASE_URL}/listing-svc/v1/product/term-completion?term=onion`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json.terms || !json.terms.length) throw new Error('Term completion returned empty');
  });

  // 12. Product Details
  await test('GET /api/v1/products/10000148 returns Fresho Onion', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/products/10000148`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.data.productId !== '10000148' || !json.data.name.includes('Onion')) {
      throw new Error('Product detail mismatch');
    }
  });

  // 13. Categories List
  await test('GET /api/v1/categories returns taxonomy tree', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/categories`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.count < 5) throw new Error('Expected at least 5 top-level categories');
  });

  // 14. Native category-tree alias
  await test('GET /ui-svc/v1/category-tree returns categories', async () => {
    const res = await fetch(`${BASE_URL}/ui-svc/v1/category-tree`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!Array.isArray(json) || !json.length) throw new Error('Category tree empty');
  });

  // 15. Products by Category
  await test('GET /api/v1/categories/dairy-bakery/products returns dairy items', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/categories/dairy-bakery/products`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json.data.results.length) throw new Error('No products in dairy-bakery');
  });

  // 16. In-Memory Micro-Cache Verification
  await test('In-Memory micro-cache returns X-Cache: HIT on second request', async () => {
    const url = `${BASE_URL}/api/v1/products/search?q=tea`;
    const res1 = await fetch(url);
    const h1 = res1.headers.get('x-cache');
    const res2 = await fetch(url);
    const h2 = res2.headers.get('x-cache');
    if (h2 !== 'HIT') {
      throw new Error(`Expected X-Cache: HIT, got ${h2} (first was ${h1})`);
    }
  });

  console.log(`\n========================================`);
  console.log(`RESULTS: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) process.exit(1);
}

runTests().catch(err => {
  console.error("Test runner fatal error:", err);
  process.exit(1);
});
