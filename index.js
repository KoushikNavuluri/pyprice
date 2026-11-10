/**
 * PyPrice Unified Multi-Platform Gateway SDK
 * Programmatic client for querying both Zepto and Swiggy Instamart APIs.
 */

import { ZeptoAPIClient } from './zepto/src/sdk.js';
import { InstamartAPIClient } from './instamart/src/sdk.js';

export class PyPriceClient {
  constructor({
    zeptoBaseUrl = 'http://127.0.0.1:4000',
    instamartBaseUrl = 'http://127.0.0.1:5000'
  } = {}) {
    this.zepto = new ZeptoAPIClient(zeptoBaseUrl);
    this.instamart = new InstamartAPIClient(instamartBaseUrl);
  }

  /**
   * Search and compare products across both Zepto and Instamart
   */
  async compareProducts(query, { pincode = null } = {}) {
    const results = {
      query,
      timestamp: new Date().toISOString(),
      zepto: null,
      instamart: null,
      comparison: []
    };

    const [zeptoRes, instamartRes] = await Promise.allSettled([
      this.zepto.searchProducts({ query, limit: 10 }),
      this.instamart.searchProducts({ query, limit: 10 })
    ]);

    if (zeptoRes.status === 'fulfilled') {
      results.zepto = zeptoRes.value.results || [];
    }
    if (instamartRes.status === 'fulfilled') {
      results.instamart = instamartRes.value.results || [];
    }

    return results;
  }
}

export { ZeptoAPIClient, InstamartAPIClient };
