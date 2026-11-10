/**
 * Unofficial Zepto API Client SDK (Node.js & Browser compatible)
 * Clean, promise-based client for programmatic integration into AI agents and apps.
 */

export class ZeptoAPIClient {
  constructor(baseUrl = 'http://127.0.0.1:4000') {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.session = null;
    this.storeId = null;
  }

  async _request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.session?.headers || {}),
      ...(options.headers || {})
    };

    const res = await fetch(url, { ...options, headers });
    const json = await res.json();
    if (!res.ok || json.status === 'error') {
      const err = new Error(json.error?.message || `Request failed with HTTP ${res.status}`);
      err.code = json.error?.code || 'UNKNOWN_ERROR';
      err.status = res.status;
      throw err;
    }
    return json.data !== undefined ? json.data : json;
  }

  // Session & Initialization
  async initSession({ latitude, longitude, pincode, storeId } = {}) {
    const sessionData = await this._request('/api/v1/session/init', {
      method: 'POST',
      body: JSON.stringify({ latitude, longitude, pincode, storeId })
    });
    this.session = sessionData;
    this.storeId = sessionData.location?.storeId || null;
    return sessionData;
  }

  // Location APIs
  async checkServiceabilityByCoords(lat, lng) {
    return this._request(`/api/v1/location/coordinates?lat=${lat}&lng=${lng}`);
  }

  async checkServiceabilityByPincode(pincode) {
    return this._request(`/api/v1/location/pincode/${pincode}`);
  }

  async searchAddress(query) {
    return this._request(`/api/v1/location/search?q=${encodeURIComponent(query)}`);
  }

  async getStores(city = null) {
    const endpoint = city ? `/api/v1/stores?city=${encodeURIComponent(city)}` : '/api/v1/stores';
    return this._request(endpoint);
  }

  async getStoreDetails(storeId) {
    return this._request(`/api/v1/stores/${storeId}`);
  }

  // Catalog & Search APIs
  async searchProducts({
    query = '',
    category = null,
    subCategory = null,
    minPrice = null,
    maxPrice = null,
    inStockOnly = false,
    sortBy = 'relevance',
    page = 1,
    limit = 10,
    storeId = null
  } = {}) {
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (category) params.set('category', category);
    if (subCategory) params.set('subCategory', subCategory);
    if (minPrice !== null) params.set('minPrice', minPrice);
    if (maxPrice !== null) params.set('maxPrice', maxPrice);
    if (inStockOnly) params.set('inStockOnly', 'true');
    if (sortBy) params.set('sortBy', sortBy);
    if (page) params.set('page', page);
    if (limit) params.set('limit', limit);
    
    const effectiveStore = storeId || this.storeId;
    if (effectiveStore) params.set('storeId', effectiveStore);

    return this._request(`/api/v1/products/search?${params.toString()}`);
  }

  async getAutocomplete(query, limit = 5) {
    return this._request(`/api/v1/products/autocomplete?q=${encodeURIComponent(query)}&limit=${limit}`);
  }

  async getProductDetails(productId, storeId = null) {
    const effectiveStore = storeId || this.storeId;
    const qs = effectiveStore ? `?storeId=${effectiveStore}` : '';
    return this._request(`/api/v1/products/${productId}${qs}`);
  }

  // Category APIs
  async getCategories() {
    return this._request('/api/v1/categories');
  }

  async getCategoryDetails(categoryId) {
    return this._request(`/api/v1/categories/${categoryId}`);
  }

  async getCategoryProducts(categoryId, { subCategory = null, page = 1, limit = 10, storeId = null } = {}) {
    const params = new URLSearchParams();
    if (subCategory) params.set('subCategory', subCategory);
    if (page) params.set('page', page);
    if (limit) params.set('limit', limit);
    const effectiveStore = storeId || this.storeId;
    if (effectiveStore) params.set('storeId', effectiveStore);

    return this._request(`/api/v1/categories/${categoryId}/products?${params.toString()}`);
  }
}
