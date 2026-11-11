/**
 * PyPrice Unified Multi-Platform Gateway SDK
 * Programmatic client for querying Zepto, Swiggy Instamart, Blinkit, BigBasket (bbnow), and JioMart APIs.
 * Supports end-to-end address-to-store routing, hyperlocal inventory discovery, and cross-platform price comparison.
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
   * Resolve user address, PIN code, or GPS coordinates to local dark stores across all 5 platforms
   */
  async resolveLocation({ address = null, pincode = null, latitude = null, longitude = null } = {}) {
    const locationQuery = { address, pincode, latitude, longitude };
    const result = {
      query: locationQuery,
      timestamp: new Date().toISOString(),
      platforms: {}
    };

    const [zLoc, iLoc, bLoc, bbLoc, jLoc] = await Promise.allSettled([
      this.zepto.setLocation(locationQuery),
      this.instamart.setLocation(locationQuery),
      this.blinkit.setLocation(locationQuery),
      this.bigbasket.setLocation(locationQuery),
      this.jiomart.setLocation(locationQuery)
    ]);

    result.platforms.zepto = zLoc.status === 'fulfilled' ? zLoc.value : { serviceable: false, reason: zLoc.reason?.message };
    result.platforms.instamart = iLoc.status === 'fulfilled' ? iLoc.value : { serviceable: false, reason: iLoc.reason?.message };
    result.platforms.blinkit = bLoc.status === 'fulfilled' ? bLoc.value : { serviceable: false, reason: bLoc.reason?.message };
    result.platforms.bigbasket = bbLoc.status === 'fulfilled' ? bbLoc.value : { serviceable: false, reason: bbLoc.reason?.message };
    result.platforms.jiomart = jLoc.status === 'fulfilled' ? jLoc.value : { serviceable: false, reason: jLoc.reason?.message };

    return result;
  }

  /**
   * Normalizes raw platform products into a standard item schema
   */
  _normalizeItem(platform, item, locationContext) {
    if (!item) return null;

    if (platform === 'zepto') {
      return {
        platform: 'zepto',
        id: item.id || item.variantId,
        name: item.name,
        brand: item.brand,
        category: item.category,
        subCategory: item.subCategory,
        packsize: item.packsize || `${item.quantity || ''} ${item.unit || ''}`.trim(),
        price: {
          mrp: item.pricing?.mrp ?? item.mrp,
          storePrice: item.pricing?.discountedPrice ?? item.price,
          discountPercentage: item.pricing?.discountPercentage ?? item.discountPercentage ?? 0,
          currency: 'INR'
        },
        stock: {
          inStock: item.stock?.inStock ?? item.inStock ?? true,
          availableQuantity: item.stock?.availableQuantity ?? item.availableQuantity ?? 0
        },
        delivery: {
          storeId: locationContext?.storeId || item.storeId,
          storeName: locationContext?.storeName || 'Zepto Dark Store',
          etaMinutes: locationContext?.etaMinutes || 10
        },
        imageUrl: item.images?.[0]?.url || item.images?.[0] || null
      };
    }

    if (platform === 'instamart') {
      return {
        platform: 'instamart',
        id: item.itemId || item.skuId,
        name: item.displayName || item.name,
        brand: item.brand,
        category: item.category,
        subCategory: item.subCategory,
        packsize: item.quantityDescription || `${item.quantity || ''} ${item.unit || ''}`.trim(),
        price: {
          mrp: item.price?.mrp ?? 0,
          storePrice: item.price?.offerPrice ?? item.price?.mrp ?? 0,
          discountPercentage: item.price?.discountPercentage ?? 0,
          currency: 'INR'
        },
        stock: {
          inStock: item.inStock ?? true,
          availableQuantity: item.inStock ? 50 : 0
        },
        delivery: {
          storeId: locationContext?.podId || item.podId,
          storeName: locationContext?.storeName || 'Instamart Pod',
          etaMinutes: typeof locationContext?.sla === 'object' ? (locationContext.sla?.value || 10) : (locationContext?.sla || 10)
        },
        imageUrl: item.images?.[0]?.url || item.images?.[0] || null
      };
    }

    if (platform === 'blinkit') {
      return {
        platform: 'blinkit',
        id: item.productId || item.id,
        name: item.name,
        brand: item.brand,
        category: item.category,
        subCategory: item.subCategory,
        packsize: item.unit || item.packSize || '',
        price: {
          mrp: item.pricing?.mrp ?? item.mrp ?? 0,
          storePrice: item.pricing?.price ?? item.price ?? 0,
          discountPercentage: item.pricing?.discountPercentage ?? item.discountPercentage ?? 0,
          currency: 'INR'
        },
        stock: {
          inStock: !item.isSoldOut && (item.inventory ?? 1) > 0,
          availableQuantity: item.inventory ?? (item.isSoldOut ? 0 : 25)
        },
        delivery: {
          storeId: locationContext?.storeId || item.storeId,
          storeName: locationContext?.storeName || 'Blinkit Dark Store',
          etaMinutes: locationContext?.etaMinutes || 10
        },
        imageUrl: item.images?.[0]?.url || item.images?.[0] || null
      };
    }

    if (platform === 'bigbasket') {
      return {
        platform: 'bigbasket',
        id: item.id || item.productId,
        name: item.desc || item.name,
        brand: item.brand,
        category: item.category,
        subCategory: item.subCategory,
        packsize: item.pack_desc || item.w || '',
        price: {
          mrp: item.pricing?.mrp ?? 0,
          storePrice: item.pricing?.price ?? item.pricing?.sp ?? 0,
          discountPercentage: item.pricing?.discountPercentage ?? 0,
          currency: 'INR'
        },
        stock: {
          inStock: item.availability?.is_available ?? true,
          availableQuantity: item.availability?.stock ?? 30
        },
        delivery: {
          storeId: locationContext?.hubId || item.hubId,
          storeName: locationContext?.storeName || 'bbnow Hub',
          etaMinutes: locationContext?.etaMinutes || 10
        },
        imageUrl: item.images?.[0]?.url || item.images?.[0] || null
      };
    }

    if (platform === 'jiomart') {
      return {
        platform: 'jiomart',
        id: item.id || item.uid,
        name: item.name,
        brand: item.brand?.name || item.brand || '',
        category: item.categories?.[0]?.name || item.category || '',
        subCategory: item.categories?.[1]?.name || item.subCategory || '',
        packsize: item.attributes?.net_quantity || item.packsize || '',
        price: {
          mrp: item.price?.marked?.min ?? item.mrp ?? 0,
          storePrice: item.price?.effective?.min ?? item.price ?? 0,
          discountPercentage: item.price?.discount_percentage ?? 0,
          currency: 'INR'
        },
        stock: {
          inStock: item.availability?.in_stock ?? true,
          availableQuantity: item.availability?.in_stock ? 40 : 0
        },
        delivery: {
          storeId: locationContext?.storeId || item.storeId,
          storeName: locationContext?.storeName || 'JioMart Quick Store',
          etaMinutes: locationContext?.etaMinutes || 11
        },
        imageUrl: item.media?.[0]?.url || item.images?.[0] || null
      };
    }

    return item;
  }

  /**
   * Search and compare specific products across all 5 platforms scoped to user address/location
   */
  async searchByLocation({
    query = '',
    address = null,
    pincode = null,
    latitude = null,
    longitude = null,
    limit = 10,
    inStockOnly = false,
    sortBy = 'relevance'
  } = {}) {
    const locationQuery = { address, pincode, latitude, longitude };
    
    // Step 1: Discover local dark stores for the given location across platforms
    const locationResolution = await this.resolveLocation(locationQuery);

    const searchPayload = {
      query,
      address,
      pincode,
      latitude,
      longitude,
      limit,
      inStockOnly,
      sortBy
    };

    // Step 2: Query products from all 5 platforms simultaneously in the context of their resolved store
    const [zeptoRes, instamartRes, blinkitRes, bigbasketRes, jiomartRes] = await Promise.allSettled([
      this.zepto.searchProducts(searchPayload),
      this.instamart.searchProducts(searchPayload),
      this.blinkit.searchProducts(searchPayload),
      this.bigbasket.searchProducts(searchPayload),
      this.jiomart.searchProducts(searchPayload)
    ]);

    const results = {
      query,
      location: locationQuery,
      timestamp: new Date().toISOString(),
      stores: locationResolution.platforms,
      platforms: {
        zepto: { serviceable: locationResolution.platforms.zepto?.serviceable ?? false, items: [], total: 0 },
        instamart: { serviceable: locationResolution.platforms.instamart?.serviceable ?? false, items: [], total: 0 },
        blinkit: { serviceable: locationResolution.platforms.blinkit?.serviceable ?? false, items: [], total: 0 },
        bigbasket: { serviceable: locationResolution.platforms.bigbasket?.serviceable ?? false, items: [], total: 0 },
        jiomart: { serviceable: locationResolution.platforms.jiomart?.serviceable ?? false, items: [], total: 0 }
      },
      comparison: []
    };

    // Extract & normalize items
    if (zeptoRes.status === 'fulfilled' && zeptoRes.value) {
      const rawItems = zeptoRes.value.results || [];
      const locCtx = zeptoRes.value.locationContext || locationResolution.platforms.zepto?.store;
      results.platforms.zepto.items = rawItems.map(item => this._normalizeItem('zepto', item, locCtx));
      results.platforms.zepto.total = rawItems.length;
      if (locCtx) results.platforms.zepto.store = locCtx;
    }

    if (instamartRes.status === 'fulfilled' && instamartRes.value) {
      const rawItems = instamartRes.value.results || [];
      const locCtx = instamartRes.value.locationContext || locationResolution.platforms.instamart?.pod;
      results.platforms.instamart.items = rawItems.map(item => this._normalizeItem('instamart', item, locCtx));
      results.platforms.instamart.total = rawItems.length;
      if (locCtx) results.platforms.instamart.store = locCtx;
    }

    if (blinkitRes.status === 'fulfilled' && blinkitRes.value) {
      const rawItems = blinkitRes.value.results || [];
      const locCtx = blinkitRes.value.locationContext || locationResolution.platforms.blinkit?.store;
      results.platforms.blinkit.items = rawItems.map(item => this._normalizeItem('blinkit', item, locCtx));
      results.platforms.blinkit.total = rawItems.length;
      if (locCtx) results.platforms.blinkit.store = locCtx;
    }

    if (bigbasketRes.status === 'fulfilled' && bigbasketRes.value) {
      const rawItems = bigbasketRes.value.results || [];
      const locCtx = bigbasketRes.value.locationContext || locationResolution.platforms.bigbasket?.hub;
      results.platforms.bigbasket.items = rawItems.map(item => this._normalizeItem('bigbasket', item, locCtx));
      results.platforms.bigbasket.total = rawItems.length;
      if (locCtx) results.platforms.bigbasket.store = locCtx;
    }

    if (jiomartRes.status === 'fulfilled' && jiomartRes.value) {
      const rawItems = jiomartRes.value.results || [];
      const locCtx = jiomartRes.value.locationContext || locationResolution.platforms.jiomart?.store;
      results.platforms.jiomart.items = rawItems.map(item => this._normalizeItem('jiomart', item, locCtx));
      results.platforms.jiomart.total = rawItems.length;
      if (locCtx) results.platforms.jiomart.store = locCtx;
    }

    // Step 3: Build cross-platform comparison list
    const allNormalized = [
      ...results.platforms.zepto.items,
      ...results.platforms.instamart.items,
      ...results.platforms.blinkit.items,
      ...results.platforms.bigbasket.items,
      ...results.platforms.jiomart.items
    ];

    // Find best deal per item/query
    results.comparison = allNormalized.sort((a, b) => {
      // Prioritize in-stock items first, then lowest price
      if (a.stock.inStock !== b.stock.inStock) return b.stock.inStock ? 1 : -1;
      return a.price.storePrice - b.price.storePrice;
    });

    return results;
  }

  /**
   * Compare products across all 5 platforms with optional location support
   */
  async compareProducts(query, { address = null, pincode = null, latitude = null, longitude = null, limit = 10 } = {}) {
    return this.searchByLocation({
      query,
      address,
      pincode,
      latitude,
      longitude,
      limit
    });
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
