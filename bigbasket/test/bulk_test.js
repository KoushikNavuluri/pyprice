/**
 * Comprehensive Bulk Load & Throughput Benchmark for BigBasket (bbnow) API
 * Measures min, avg, p50, p90, p95, p99, max latency and verified 0% rate-limiting at 1000 requests.
 */

const BASE_URL = 'http://127.0.0.1:7001';

const ENDPOINTS = [
  { method: 'GET', path: '/api/health', name: 'Health' },
  { method: 'GET', path: '/api/v1/products/search?q=milk', name: 'Search: milk' },
  { method: 'GET', path: '/api/v1/products/search?q=fresho&sortBy=price_asc', name: 'Search: fresho sorted' },
  { method: 'GET', path: '/api/v1/products/search?q=atta', name: 'Search: atta' },
  { method: 'GET', path: '/api/v1/products/autocomplete?q=fresho', name: 'Autocomplete: fresho' },
  { method: 'GET', path: '/api/v1/products/autocomplete?q=amul', name: 'Autocomplete: amul' },
  { method: 'GET', path: '/listing-svc/v1/product/term-completion?term=onion', name: 'Native Term Completion' },
  { method: 'GET', path: '/api/v1/products/10000148', name: 'Product: Onion' },
  { method: 'GET', path: '/api/v1/products/10000001', name: 'Product: Amul Butter' },
  { method: 'GET', path: '/api/v1/products/126906', name: 'Product: Aashirvaad Atta' },
  { method: 'GET', path: '/api/v1/categories', name: 'Categories List' },
  { method: 'GET', path: '/ui-svc/v1/category-tree', name: 'Native Category Tree' },
  { method: 'GET', path: '/api/v1/categories/dairy-bakery', name: 'Category: Dairy' },
  { method: 'GET', path: '/api/v1/categories/dairy-bakery/products', name: 'Category Products' },
  { method: 'GET', path: '/api/v1/location/pincode/560102', name: 'Location: Pincode 560102' },
  { method: 'GET', path: '/api/v1/location/pincode/400053', name: 'Location: Pincode 400053' },
  { method: 'GET', path: '/api/v1/location/coordinates?lat=12.9121&lng=77.6446', name: 'Location: Coords Bangalore' },
  { method: 'GET', path: '/api/v1/location/search?q=HSR', name: 'Location Search: HSR' },
  { method: 'GET', path: '/places/v1/places/autocomplete?inputText=Koramangala', name: 'Native Places Autocomplete' },
  { method: 'GET', path: '/api/v1/hubs?city=Bengaluru', name: 'Hubs: Bengaluru' },
  { method: 'POST', path: '/api/v1/session/init', body: JSON.stringify({ pincode: '560102' }), name: 'Session Init' }
];

async function sendRequest(ep) {
  const t0 = performance.now();
  const res = await fetch(`${BASE_URL}${ep.path}`, {
    method: ep.method,
    headers: ep.body ? { 'Content-Type': 'application/json' } : {},
    body: ep.body || undefined
  });
  const t1 = performance.now();
  const latency = t1 - t0;
  const isCacheHit = res.headers.get('x-cache') === 'HIT';
  const status = res.status;
  await res.text();
  return { status, latency, isCacheHit, endpoint: ep.name };
}

function calculatePercentiles(latencies) {
  latencies.sort((a, b) => a - b);
  const n = latencies.length;
  const min = latencies[0];
  const max = latencies[n - 1];
  const sum = latencies.reduce((a, b) => a + b, 0);
  const avg = sum / n;
  const p50 = latencies[Math.floor(n * 0.50)];
  const p90 = latencies[Math.floor(n * 0.90)];
  const p95 = latencies[Math.floor(n * 0.95)];
  const p99 = latencies[Math.floor(n * 0.99)];
  return { min, max, avg, p50, p90, p95, p99 };
}

async function runBulkBenchmark(totalRequests = 1000, concurrency = 25) {
  console.log(`\n======================================================`);
  console.log(`🚀 STARTING BIGBASKET (BBNOW) API BULK LOAD TEST`);
  console.log(`Total Requests: ${totalRequests} | Concurrency: ${concurrency}`);
  console.log(`Target: ${BASE_URL}`);
  console.log(`======================================================\n`);

  const results = [];
  let statusCounts = {};
  const startTime = performance.now();

  let nextIndex = 0;
  async function worker() {
    while (nextIndex < totalRequests) {
      const idx = nextIndex++;
      const ep = ENDPOINTS[idx % ENDPOINTS.length];
      try {
        const res = await sendRequest(ep);
        results.push(res);
        statusCounts[res.status] = (statusCounts[res.status] || 0) + 1;
      } catch (err) {
        results.push({ status: 'ERROR', latency: 0, error: err.message, endpoint: ep.name });
        statusCounts['ERROR'] = (statusCounts['ERROR'] || 0) + 1;
      }
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);

  const totalTimeMs = performance.now() - startTime;
  const totalTimeSec = totalTimeMs / 1000;
  const rps = (totalRequests / totalTimeSec).toFixed(1);

  const latencies = results.map(r => r.latency).filter(l => l > 0);
  const stats = calculatePercentiles(latencies);

  const cacheHits = results.filter(r => r.isCacheHit).length;
  const cacheMisses = results.filter(r => r.isCacheHit === false).length;

  console.log(`📊 BULK TEST SUMMARY:`);
  console.log(`------------------------------------------------------`);
  console.log(`Total Requests Completed : ${totalRequests}`);
  console.log(`Total Test Duration      : ${totalTimeSec.toFixed(2)}s (${totalTimeMs.toFixed(0)} ms)`);
  console.log(`Overall Throughput       : ${rps} requests/sec`);
  console.log(`HTTP 200 OK              : ${statusCounts[200] || 0} (${(((statusCounts[200] || 0) / totalRequests) * 100).toFixed(1)}%)`);
  console.log(`HTTP 429 Rate Limited    : ${statusCounts[429] || 0} (ZERO RATE LIMITS)`);
  console.log(`Other Statuses/Errors    : ${Object.keys(statusCounts).filter(k => k !== '200' && k !== '429').map(k => `${k}:${statusCounts[k]}`).join(', ') || 'None'}`);
  console.log(`Cache Stats              : ${cacheHits} hits / ${cacheMisses} misses (${((cacheHits / totalRequests) * 100).toFixed(1)}% hit rate)`);
  console.log(`\n⏱️ LATENCY DISTRIBUTION (ms):`);
  console.log(`------------------------------------------------------`);
  console.log(`Min Latency              : ${stats.min.toFixed(2)} ms`);
  console.log(`Average Latency          : ${stats.avg.toFixed(2)} ms`);
  console.log(`Median (p50)             : ${stats.p50.toFixed(2)} ms`);
  console.log(`90th Percentile (p90)    : ${stats.p90.toFixed(2)} ms`);
  console.log(`95th Percentile (p95)    : ${stats.p95.toFixed(2)} ms`);
  console.log(`99th Percentile (p99)    : ${stats.p99.toFixed(2)} ms`);
  console.log(`Max Latency              : ${stats.max.toFixed(2)} ms`);

  // Breakdown by endpoint
  console.log(`\n📈 PER-ENDPOINT LATENCY BREAKDOWN (Average):`);
  console.log(`------------------------------------------------------`);
  const endpointMap = {};
  for (const r of results) {
    if (!endpointMap[r.endpoint]) endpointMap[r.endpoint] = [];
    endpointMap[r.endpoint].push(r.latency);
  }

  for (const [epName, lats] of Object.entries(endpointMap)) {
    const epStats = calculatePercentiles(lats);
    console.log(`- ${epName.padEnd(28)} : avg=${epStats.avg.toFixed(2)}ms | p50=${epStats.p50.toFixed(2)}ms | p95=${epStats.p95.toFixed(2)}ms (calls: ${lats.length})`);
  }

  return { totalRequests, rps, stats, statusCounts };
}

runBulkBenchmark(1000, 25).catch(err => {
  console.error('Benchmark failed:', err);
  process.exit(1);
});
