/**
 * PyPrice Unified Multi-Platform Gateway SDK
 * Programmatic client for querying Zepto, Swiggy Instamart, and Blinkit APIs.
 */

import { ZeptoAPIClient } from './zepto/src/sdk.js';
import { InstamartAPIClient } from './instamart/src/sdk.js';
import { BlinkitAPIClient } from './blinkit/src/sdk.js';

export class PyPriceClient {
  constructor({
    zeptoBaseUrl = 'http://127.0.0.1:4000',
    instamartBaseUrl = 'http://127.0.0.1:5000',
    blinkitBaseUrl = 'http://127.0.0.1:6001'
  } = {}) {
    this.zepto = new ZeptoAPIClient(zeptoBaseUrl);
    this.instamart = new InstamartAPIClient(instamartBaseUrl);
    this.blinkit = new BlinkitAPIClient(blinkitBaseUrl);
  }

  /**
   * Search and compare products across Zepto, Instamart, and Blinkit
   */
  async compareProducts(query, { pincode = null } = {}) {
    const results = {
      query,
      timestamp: new Date().toISOString(),
      zepto: null,
      instamart: null,
      blinkit: null,
      comparison: []
    };

    const [zeptoRes, instamartRes, blinkitRes] = await Promise.allSettled([
      this.zepto.searchProducts({ query, limit: 10 }),
      this.instamart.searchProducts({ query, limit: 10 }),
      this.blinkit.searchProducts({ query, limit: 10 })
    ]);

    if (zeptoRes.status === 'fulfilled') {
      results.zepto = zeptoRes.value.results || [];
    }
    if (instamartRes.status === 'fulfilled') {
      results.instamart = instamartRes.value.results || [];
    }
    if (blinkitRes.status === 'fulfilled') {
      results.blinkit = blinkitRes.value.results || [];
    }

    return results;
  }
}

export { ZeptoAPIClient, InstamartAPIClient, BlinkitAPIClient };
