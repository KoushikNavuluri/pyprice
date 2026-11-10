/**
 * Test Suite for Unofficial Zepto API
 * Verifies all implemented endpoints with live HTTP requests, validating schemas and responses.
 */

const BASE_URL = 'http://127.0.0.1:4000';

async function runTests() {
  console.log('=== STARTING ZEPTO API COMPREHENSIVE ENDPOINT TESTS ===\n');
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
  await test('POST /api/v1/session/init creates valid session with CSRF & headers', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/session/init`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pincode: '560102' })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!data.data.sessionId || !data.data.csrfSecret || !data.data.headers.userSessionId) {
      throw new Error('Missing session attributes');
    }
    testSessionId = data.data.sessionId;
  });

  // 3. Location by Coordinates
  await test('GET /api/v1/location/coordinates resolves serviceable store', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/location/coordinates?lat=12.9121&lng=77.6446`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json.data.serviceable || json.data.primaryStore.city !== 'Bengaluru') {
      throw new Error(`Unexpected location result: ${JSON.stringify(json)}`);
    }
  });

  // 4. Location by Pincode
  await test('GET /api/v1/location/pincode/560102 resolves HSR Layout dark store', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/location/pincode/560102`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json.data.serviceable || !json.data.primaryStore.storeId) {
      throw new Error('Pincode 560102 failed serviceability resolution');
    }
  });

  // 5. Location Search / Address Autocomplete
  await test('GET /api/v1/location/search?q=Delhi matches Delhi hubs', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/location/search?q=Delhi`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.count < 1 || !json.data[0].city.includes('Delhi')) {
      throw new Error('Address autocomplete failed');
    }
  });

  // 6. List Dark Stores
  await test('GET /api/v1/stores returns list of fulfillment centers', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/stores?city=Bengaluru`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.count < 1) throw new Error('No stores returned for Bengaluru');
  });

  // 7. Product Search (keyword + pagination)
  await test('GET /api/v1/products/search?q=milk finds dairy products', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/products/search?q=milk`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.data.pagination.totalItems < 1 || !json.data.results[0].name.toLowerCase().includes('milk')) {
      throw new Error('Search did not match milk products');
    }
  });

  // 8. Product Search with Sorting and Filtering
  await test('GET /api/v1/products/search with sorting by price_asc', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/products/search?sortBy=price_asc&limit=5`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    const prices = json.data.results.map(r => r.pricing.discountedPrice);
    for (let i = 0; i < prices.length - 1; i++) {
      if (prices[i] > prices[i + 1]) throw new Error('Results not sorted in ascending order');
    }
  });

  // 9. Search Autocomplete
  await test('GET /api/v1/products/autocomplete?q=amul returns product & brand suggestions', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/products/autocomplete?q=amul`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.count < 1 || !json.data.some(s => s.brand === 'Amul')) {
      throw new Error('Autocomplete failed for Amul');
    }
  });

  // 10. Product Details
  await test('GET /api/v1/products/:id retrieves accurate product details & MRP', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/products/prod-amul-butter-100`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.data.name !== 'Amul Salted Butter' || json.data.pricing.mrp !== 60.00) {
      throw new Error(`Unexpected product detail: ${JSON.stringify(json)}`);
    }
  });

  // 11. Categories List
  await test('GET /api/v1/categories returns full taxonomy list', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/categories`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.count < 5 || !json.data.some(c => c.id === 'fruits-vegetables')) {
      throw new Error('Category discovery failed');
    }
  });

  // 12. Category Details & Subcategories
  await test('GET /api/v1/categories/:id returns subcategories and microcategories', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/categories/dairy-bread-eggs`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (!json.data.subcategories || json.data.subcategories.length < 3) {
      throw new Error('Subcategories missing in category details');
    }
  });

  // 13. Products by Category
  await test('GET /api/v1/categories/:id/products returns products in category', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/categories/dairy-bread-eggs/products`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.data.results.length < 1) throw new Error('No products found for dairy-bread-eggs');
  });

  // 14. Error handling: invalid pincode
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
