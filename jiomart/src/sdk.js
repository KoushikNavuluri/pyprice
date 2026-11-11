/**
 * JioMart SDK Client
 * JavaScript/Node.js client for accessing JioMart product catalog, search, and hyperlocal services.
 */

export class JioMartClient {
  constructor(baseUrl = 'http://127.0.0.1:8001') {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  async _request(path, options = {}) {
    const url = `${this.baseUrl}${path}`;
    const res = await fetch(url, {
      ...options,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });

    if (!res.ok) {
      let errorBody;
      try {
        errorBody = await res.json();
      } catch {
        errorBody = await res.text();
      }
      throw new Error(`JioMart API Error (${res.status}): ${JSON.stringify(errorBody)}`);
    }

    return res.json();
  }

  // System
  async checkHealth() {
    return this._request('/api/health');
  }

  async getDocumentation() {
    return this._request('/api/docs');
  }

  // Session
  async initSession(params = {}) {
    return this._request('/api/v1/session/init', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  }

  async getSession(sessionId) {
    return this._request(`/api/v1/session/${sessionId}`);
  }

  // Location & Stores
  async resolveCoordinates(lat, lng) {
    return this._request(`/api/v1/location/coordinates?lat=${lat}&lng=${lng}`);
  }

  async resolvePincode(pincode) {
    return this._request(`/api/v1/location/pincode/${pincode}`);
  }

  async searchLocation(query) {
    return this._request(`/api/v1/location/search?q=${encodeURIComponent(query)}`);
  }

  async getStores({ city = null } = {}) {
    const q = city ? `?city=${encodeURIComponent(city)}` : '';
    return this._request(`/api/v1/stores${q}`);
  }

  async getDeliveryFeeQuote(storeCode = 'T6HZ') {
    return this._request(`/ext/jmshipmentfee/delivery_fee/v1.0/quote?store_code=${storeCode}`);
  }

  async setLocation({ address = null, pincode = null, latitude = null, longitude = null } = {}) {
    let locResult = null;
    if (latitude && longitude) {
      locResult = await this.resolveCoordinates(latitude, longitude);
      if (locResult?.serviceable && locResult?.nearestStore) {
        this.storeId = locResult.nearestStore.code;
        return { serviceable: true, store: locResult.nearestStore };
      }
    } else if (pincode) {
      locResult = await this.resolvePincode(pincode);
      if (locResult?.valid && locResult?.serviceable && locResult?.store) {
        this.storeId = locResult.store.code;
        return { serviceable: true, store: locResult.store };
      }
    } else if (address) {
      const resp = await this.searchLocation(address);
      const addrs = Array.isArray(resp) ? resp : (resp?.results || resp?.data || []);
      if (addrs && addrs.length > 0) {
        const lat = addrs[0].lat || addrs[0].latitude;
        const lng = addrs[0].lng || addrs[0].longitude;
        locResult = await this.resolveCoordinates(lat, lng);
        if (locResult?.serviceable && locResult?.nearestStore) {
          this.storeId = locResult.nearestStore.code;
          return { serviceable: true, store: locResult.nearestStore };
        }
      }
    }
    return { serviceable: false, reason: locResult?.error || 'Location not serviceable' };
  }

  // Catalog & Search
  async searchProducts({
    query = '',
    storeId = null,
    pincode = null,
    latitude = null,
    longitude = null,
    address = null,
    brand = null,
    category = null,
    minPrice = null,
    maxPrice = null,
    inStockOnly = false,
    sortBy = 'relevance',
    page = 1,
    limit = 20
  } = {}) {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    const effectiveStore = storeId || this.storeId;
    if (effectiveStore) params.append('storeId', effectiveStore);
    if (pincode) params.append('pincode', pincode);
    if (latitude) params.append('latitude', latitude);
    if (longitude) params.append('longitude', longitude);
    if (address) params.append('address', address);
    if (brand) params.append('brand', brand);
    if (category) params.append('category', category);
    if (minPrice !== null) params.append('minPrice', minPrice);
    if (maxPrice !== null) params.append('maxPrice', maxPrice);
    if (inStockOnly) params.append('inStockOnly', 'true');
    if (sortBy) params.append('sortBy', sortBy);
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);

    return this._request(`/api/v1/products/search?${params.toString()}`);
  }

  async autocomplete(query) {
    return this._request(`/api/v1/products/autocomplete?q=${encodeURIComponent(query)}`);
  }

  async getProduct(idOrSlug) {
    return this._request(`/api/v1/products/${idOrSlug}`);
  }

  // Categories
  async getCategories() {
    return this._request('/api/v1/categories');
  }

  async getCategory(idOrSlug) {
    return this._request(`/api/v1/categories/${idOrSlug}`);
  }

  async getCategoryProducts(idOrSlug, { page = 1, limit = 20 } = {}) {
    return this._request(`/api/v1/categories/${idOrSlug}/products?page=${page}&limit=${limit}`);
  }
}

export const JioMartAPIClient = JioMartClient;
export default JioMartClient;
