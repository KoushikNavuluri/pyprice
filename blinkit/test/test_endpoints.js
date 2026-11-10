/**
 * Test Suite for Unofficial Blinkit API
 */

const BASE_URL = 'http://127.0.0.1:6001';

async function runTests() {
  console.log('=== STARTING BLINKIT API TEST SUITE ===\n');
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
  await test('POST /api/v1/session/init creates session with auth_key & deviceId', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/session/init`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pincode: '560102' })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.data.sessionId || !data.data.deviceId || !data.data.authKey) {
      throw new Error('Missing session attributes');
    }
    testSessionId = data.data.sessionId;
  });

  // 3. Location by Coordinates
  await test('GET /api/v1/location/coordinates resolves Bangalore HSR store', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/location/coordinates?lat=12.9121&lng=77.6446`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json.data.serviceable || json.data.primaryStore.city !== 'Bengaluru') {
      throw new Error(`Unexpected location result: ${JSON.stringify(json)}`);
    }
  });

  // 4. Location by Pincode
  await test('GET /api/v1/location/pincode/560102 resolves HSR Store 14829', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/location/pincode/560102`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json.data.serviceable || json.data.primaryStore.storeId !== '14829') {
      throw new Error('Pincode 560102 failed serviceability resolution');
    }
  });

  // 5. Location Search / Address Autocomplete
  await test('GET /api/v1/location/search?q=Delhi matches Delhi dark store', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/location/search?q=Delhi`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.count < 1 || !json.data[0].city.includes('Delhi')) {
      throw new Error('Address autocomplete failed');
    }
  });

  // 6. List Dark Stores
  await test('GET /api/v1/stores returns list of dark stores', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/stores?city=Bengaluru`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.count < 1) throw new Error('No dark stores returned for Bengaluru');
  });

  // 7. Product Search
  await test('GET /api/v1/products/search?q=milk finds Amul milk', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/products/search?q=milk`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.data.pagination.totalItems < 1 || !json.data.results.some(r => r.name.toLowerCase().includes('milk'))) {
      throw new Error('Search did not match milk products');
    }
  });

  // 8. Product Search with Sorting
  await test('GET /api/v1/products/search with sorting by price_asc', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/products/search?sortBy=price_asc&limit=5`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const prices = json.data.results.map(r => r.pricing.price);
    for (let i = 0; i < prices.length - 1; i++) {
      if (prices[i] > prices[i + 1]) throw new Error('Results not sorted in ascending order');
    }
  });

  // 9. Search Autocomplete
  await test('GET /api/v1/products/autocomplete?q=amul returns suggestions', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/products/autocomplete?q=amul`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.count < 1 || !json.data.some(s => s.brand === 'Amul')) {
      throw new Error('Autocomplete failed for Amul');
    }
  });

  // 10. Product Details
  await test('GET /api/v1/products/:id retrieves Amul Taaza Milk', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/products/37397`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.data.name !== 'Amul Taaza Toned Milk' || json.data.pricing.price !== 29) {
      throw new Error(`Unexpected product detail: ${JSON.stringify(json)}`);
    }
  });

  // 11. Native Blinkit SDUI Layout Alias
  await test('GET /v1/layout/product/37397 returns SDUI snippet hierarchy', async () => {
    const res = await fetch(`${BASE_URL}/v1/layout/product/37397`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json.response || !json.response.snippets || json.response.snippets.length === 0) {
      throw new Error('SDUI snippet response format mismatch');
    }
  });

  // 12. Categories List
  await test('GET /api/v1/categories returns taxonomy list', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/categories`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.count < 5 || !json.data.some(c => c.id === 'dairy-breakfast')) {
      throw new Error('Category discovery failed');
    }
  });

  // 13. Category Details & Subcategories
  await test('GET /api/v1/categories/:id returns subcategories', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/categories/dairy-breakfast`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json.data.subcategories || json.data.subcategories.length < 3) {
      throw new Error('Subcategories missing in category details');
    }
  });

  // 14. Error handling
  await test('GET /api/v1/location/pincode/123 returns 400 Bad Request', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/location/pincode/123`);
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
  });

  console.log(`\n=== TEST RESULTS: ${passed} PASSED, ${failed} FAILED ===`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
