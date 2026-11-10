/**
 * PyPrice Unified Multi-Platform Gateway SDK
 * Programmatic client for querying Zepto, Swiggy Instamart, Blinkit, BigBasket (bbnow), and JioMart APIs.
 */

import { ZeptoAPIClient } from './zepto/src/sdk.js';
import { InstamartAPIClient } from './instamart/src/sdk.js';
import { BlinkitAPIClient } from './blinkit/src/sdk.js';
import { BigBasketAPIClient, BigBasketClient } from './bigbasket/src/sdk.js';
import { JioMartAPIClient, JioMartClient } from './jiomart/src/sdk.js';

export class PyPriceClient {
  constructor({
    zeptoBaseUrl = 'http://127.0.0.1:4000',
    instamartBaseUrl = 'http://127.0.0.1:5000',
    blinkitBaseUrl = 'http://127.0.0.1:6001',
    bigbasketBaseUrl = 'http://127.0.0.1:7001',
    jiomartBaseUrl = 'http://127.0.0.1:8001'
  } = {}) {
    this.zepto = new ZeptoAPIClient(zeptoBaseUrl);
    this.instamart = new InstamartAPIClient(instamartBaseUrl);
    this.blinkit = new BlinkitAPIClient(blinkitBaseUrl);
    this.bigbasket = new BigBasketAPIClient(bigbasketBaseUrl);
    this.jiomart = new JioMartAPIClient(jiomartBaseUrl);
  }

  /**
   * Search and compare products across Zepto, Instamart, Blinkit, BigBasket, and JioMart
   */
  async compareProducts(query, { pincode = null } = {}) {
    const results = {
      query,
      timestamp: new Date().toISOString(),
      zepto: null,
      instamart: null,
      blinkit: null,
      bigbasket: null,
      jiomart: null,
      comparison: []
    };

    const [zeptoRes, instamartRes, blinkitRes, bigbasketRes, jiomartRes] = await Promise.allSettled([
      this.zepto.searchProducts({ query, limit: 10 }),
      this.instamart.searchProducts({ query, limit: 10 }),
      this.blinkit.searchProducts({ query, limit: 10 }),
      this.bigbasket.searchProducts({ query, limit: 10 }),
      this.jiomart.searchProducts({ query, limit: 10 })
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
    if (bigbasketRes.status === 'fulfilled') {
      results.bigbasket = bigbasketRes.value.results || [];
    }
    if (jiomartRes.status === 'fulfilled') {
      results.jiomart = jiomartRes.value.results || [];
    }

    return results;
  }
}

export {
  ZeptoAPIClient,
  InstamartAPIClient,
  BlinkitAPIClient,
  BigBasketAPIClient,
  BigBasketClient,
  JioMartAPIClient,
  JioMartClient
};
