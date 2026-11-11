/**
 * Programmatic JavaScript/TypeScript SDK for Unofficial Swiggy Instamart API
 */

export class InstamartAPIClient {
  constructor(baseUrl = 'http://127.0.0.1:5000') {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.session = null;
  }

  async _request(path, options = {}) {
    const url = `${this.baseUrl}${path}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.session?.headers || {}),
      ...(options.headers || {})
    };

    const res = await fetch(url, {
      ...options,
      headers
    });

    const json = await res.json();
    if (!res.ok) {
      const err = new Error(json.error?.message || `HTTP ${res.status}`);
      err.code = json.error?.code || 'API_ERROR';
      err.status = res.status;
      throw err;
    }
    return json;
  }

  // 1. Session Management
  async initSession({ latitude, longitude, pincode, podId } = {}) {
    const res = await this._request('/api/v1/session/init', {
      method: 'POST',
      body: JSON.stringify({ latitude, longitude, pincode, podId })
    });
    this.session = res.data;
    return this.session;
  }

  // 2. Location & Pod Discovery
  async checkServiceabilityByCoords(lat, lng) {
    const res = await this._request(`/api/v1/location/coordinates?lat=${lat}&lng=${lng}`);
    return res.data;
  }

  async checkServiceabilityByPincode(pincode) {
    const res = await this._request(`/api/v1/location/pincode/${pincode}`);
    return res.data;
  }

  async searchAddress(query) {
    const res = await this._request(`/api/v1/location/search?q=${encodeURIComponent(query)}`);
    return res.data;
  }

  async getPods(city = null) {
    const url = city ? `/api/v1/pods?city=${encodeURIComponent(city)}` : '/api/v1/pods';
    const res = await this._request(url);
    return res.data;
  }

  async setLocation({ address = null, pincode = null, latitude = null, longitude = null } = {}) {
    let locResult = null;
    if (latitude && longitude) {
      locResult = await this.checkServiceabilityByCoords(latitude, longitude);
    } else if (pincode) {
      locResult = await this.checkServiceabilityByPincode(pincode);
    } else if (address) {
      const addrs = await this.searchAddress(address);
      if (addrs && addrs.length > 0) {
        locResult = await this.checkServiceabilityByCoords(addrs[0].latitude, addrs[0].longitude);
      }
    }
    if (locResult?.serviceable && locResult?.primaryPod) {
      this.podId = locResult.primaryPod.podId;
      return { serviceable: true, pod: locResult.primaryPod };
    }
    return { serviceable: false, reason: locResult?.message || 'Location not serviceable' };
  }

  // 3. Product Search & Autocomplete
  async searchProducts({
    query = "",
    podId = null,
    pincode = null,
    latitude = null,
    longitude = null,
    address = null,
    category = null,
    subCategory = null,
    brand = null,
    minPrice = null,
    maxPrice = null,
    inStockOnly = false,
    sortBy = "relevance",
    page = 1,
    limit = 10
  } = {}) {
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    const effectivePod = podId || this.podId;
    if (effectivePod) params.append('podId', effectivePod);
    if (pincode) params.append('pincode', pincode);
    if (latitude) params.append('latitude', latitude);
    if (longitude) params.append('longitude', longitude);
    if (address) params.append('address', address);
    if (category) params.append('category', category);
    if (subCategory) params.append('subCategory', subCategory);
    if (brand) params.append('brand', brand);
    if (minPrice !== null) params.append('minPrice', minPrice);
    if (maxPrice !== null) params.append('maxPrice', maxPrice);
    if (inStockOnly) params.append('inStockOnly', 'true');
    if (sortBy) params.append('sortBy', sortBy);
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);

    const res = await this._request(`/api/v1/products/search?${params.toString()}`);
    return res.data;
  }

  async getAutocomplete(query, limit = 5) {
    const res = await this._request(`/api/v1/products/autocomplete?q=${encodeURIComponent(query)}&limit=${limit}`);
    return res.data;
  }

  async getProduct(itemIdOrSku, podId = null) {
    const url = podId ? `/api/v1/products/${itemIdOrSku}?podId=${podId}` : `/api/v1/products/${itemIdOrSku}`;
    const res = await this._request(url);
    return res.data;
  }

  // 4. Categories
  async getCategories() {
    const res = await this._request('/api/v1/categories');
    return res.data;
  }

  async getCategory(categoryId) {
    const res = await this._request(`/api/v1/categories/${categoryId}`);
    return res.data;
  }

  async getProductsByCategory(categoryId, { subCategory = null, podId = null, page = 1, limit = 10 } = {}) {
    const params = new URLSearchParams();
    if (subCategory) params.append('subCategory', subCategory);
    if (podId) params.append('podId', podId);
    if (page) params.append('page', page);
    if (limit) params.append('limit', limit);

    const res = await this._request(`/api/v1/categories/${categoryId}/products?${params.toString()}`);
    return res.data;
  }
}
