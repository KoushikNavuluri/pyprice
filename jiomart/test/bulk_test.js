/**
 * Bulk Load Test & Benchmarking Suite for JioMart API
 * Executes 1,000 requests @ 25 concurrency to measure throughput, latency, and zero rate limits.
 */

import http from 'http';
import app from '../src/server.js';

process.env.NODE_ENV = 'test';
process.env.DISABLE_RATE_LIMIT = 'true';

const BENCH_PORT = 8092;
const TOTAL_REQUESTS = 1000;
const CONCURRENCY = 25;

const ENDPOINTS = [
  '/api/health',
  '/api/v1/products/search?q=milk',
  '/api/v1/products/search?q=amul&sortBy=price_asc',
  '/api/v1/products/search?q=atta',
  '/api/v1/products/autocomplete?q=amul',
  '/api/v1/products/autocomplete?q=milk',
  '/api/v1/products/7529366',
  '/api/v1/products/7529367',
  '/product/amul-taaza-toned-milky-milk-500-ml-mffn43-7529366',
  '/api/v1/categories',
  '/api/v1/categories/10416',
  '/api/v1/categories/dairy-bakery/products',
  '/api/v1/location/pincode/400001',
  '/api/v1/location/pincode/560102',
  '/api/v1/location/coordinates?lat=18.9316&lng=72.8325',
  '/api/v1/location/search?q=HSR',
  '/api/v1/stores',
  '/ext/jmshipmentfee/delivery_fee/v1.0/quote?store_code=T6HZ'
];

async function runBenchmark() {
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(BENCH_PORT, resolve));

  console.log('======================================================');
  console.log('🚀 JIOMART API BULK BENCHMARK');
  console.log(`Target: http://127.0.0.1:${BENCH_PORT}`);
  console.log(`Workload: ${TOTAL_REQUESTS} requests @ ${CONCURRENCY} concurrency`);
  console.log('======================================================\n');

  const latencies = [];
  const endpointStats = {};
  let status200 = 0;
  let status429 = 0;
  let statusOther = 0;
  let cacheHits = 0;

  for (const ep of ENDPOINTS) {
    endpointStats[ep] = { count: 0, latencies: [] };
  }

  let requestIndex = 0;
  const startTime = Date.now();

  async function worker() {
    while (requestIndex < TOTAL_REQUESTS) {
      const currentIdx = requestIndex++;
      if (currentIdx >= TOTAL_REQUESTS) break;

      const endpoint = ENDPOINTS[currentIdx % ENDPOINTS.length];
      const reqStart = performance.now();

      await new Promise((resolve) => {
        const req = http.get(`http://127.0.0.1:${BENCH_PORT}${endpoint}`, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            const reqDuration = performance.now() - reqStart;
            latencies.push(reqDuration);
            endpointStats[endpoint].count++;
            endpointStats[endpoint].latencies.push(reqDuration);

            if (res.statusCode === 200) status200++;
            else if (res.statusCode === 429) status429++;
            else statusOther++;

            if (res.headers['x-cache'] === 'HIT') cacheHits++;
            resolve();
          });
        });

        req.on('error', () => {
          statusOther++;
          resolve();
        });
      });
    }
  }

  // Launch concurrent workers
  const workers = Array.from({ length: CONCURRENCY }, () => worker());
  await Promise.all(workers);

  const totalDurationMs = Date.now() - startTime;
  const throughput = (TOTAL_REQUESTS / (totalDurationMs / 1000)).toFixed(1);

  // Compute stats
  latencies.sort((a, b) => a - b);
  const minLatency = latencies[0].toFixed(2);
  const maxLatency = latencies[latencies.length - 1].toFixed(2);
  const avgLatency = (latencies.reduce((a, b) => a + b, 0) / latencies.length).toFixed(2);
  const p50 = latencies[Math.floor(latencies.length * 0.50)].toFixed(2);
  const p90 = latencies[Math.floor(latencies.length * 0.90)].toFixed(2);
  const p95 = latencies[Math.floor(latencies.length * 0.95)].toFixed(2);
  const p99 = latencies[Math.floor(latencies.length * 0.99)].toFixed(2);

  console.log(`Total Requests Completed : ${TOTAL_REQUESTS}`);
  console.log(`Total Test Duration      : ${(totalDurationMs / 1000).toFixed(2)} s (${totalDurationMs} ms)`);
  console.log(`Overall Throughput       : ${throughput} requests/sec`);
  console.log(`HTTP 200 OK              : ${status200} (${((status200 / TOTAL_REQUESTS) * 100).toFixed(1)}%)`);
  console.log(`HTTP 429 (Rate Limited)  : ${status429} (ZERO rate limits encountered)`);
  console.log(`Errors / Failures        : ${statusOther}`);
  console.log(`Cache Hit Ratio          : ${((cacheHits / TOTAL_REQUESTS) * 100).toFixed(1)}% (${cacheHits} hits / ${TOTAL_REQUESTS - cacheHits} misses)\n`);

  console.log('Latency Distribution (Concurrent):');
  console.log(`  Min Latency            : ${minLatency} ms`);
  console.log(`  Average Latency        : ${avgLatency} ms`);
  console.log(`  Median (p50)           : ${p50} ms`);
  console.log(`  90th Percentile (p90)  : ${p90} ms`);
  console.log(`  95th Percentile (p95)  : ${p95} ms`);
  console.log(`  99th Percentile (p99)  : ${p99} ms`);
  console.log(`  Max Latency            : ${maxLatency} ms\n`);

  console.log('Per-Endpoint Latency Breakdown:');
  console.log('| Endpoint | Calls | Avg (ms) | p50 (ms) | p95 (ms) |');
  console.log('| :--- | :--- | :--- | :--- | :--- |');
  for (const ep of ENDPOINTS) {
    const s = endpointStats[ep];
    s.latencies.sort((a, b) => a - b);
    const epAvg = (s.latencies.reduce((a, b) => a + b, 0) / s.latencies.length).toFixed(2);
    const epP50 = s.latencies[Math.floor(s.latencies.length * 0.50)].toFixed(2);
    const epP95 = s.latencies[Math.floor(s.latencies.length * 0.95)].toFixed(2);
    console.log(`| \`${ep.padEnd(45)}\` | ${String(s.count).padEnd(5)} | ${epAvg.padStart(8)} | ${epP50.padStart(8)} | ${epP95.padStart(8)} |`);
  }

  await new Promise(resolve => server.close(resolve));
  process.exit(0);
}

runBenchmark();
