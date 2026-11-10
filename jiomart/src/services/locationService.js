/**
 * JioMart Location & Hyperlocal Logistics Service
 * Pincode validation, geo-fenced dark store pod resolution, delivery promise, and fee calculation.
 */

import { JIOMART_STORES } from '../../data/stores.js';

// Haversine distance helper (in kilometers)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const PINCODE_CITY_MAP = {
  '400001': { city: 'MUMBAI', state: 'MAHARASHTRA', lat: 18.9316, lng: 72.8325, storeCode: 'T6HZ' },
  '400007': { city: 'MUMBAI', state: 'MAHARASHTRA', lat: 18.9567, lng: 72.8149, storeCode: 'TXXH' },
  '400025': { city: 'MUMBAI', state: 'MAHARASHTRA', lat: 19.0128, lng: 72.8280, storeCode: '8636' },
  '560102': { city: 'BENGALURU', state: 'KARNATAKA', lat: 12.9121, lng: 77.6446, storeCode: 'BLR-T49A' },
  '560034': { city: 'BENGALURU', state: 'KARNATAKA', lat: 12.9352, lng: 77.6245, storeCode: 'BLR-T49A' },
  '110001': { city: 'DELHI', state: 'DELHI', lat: 28.6304, lng: 77.2177, storeCode: 'DEL-T11A' },
  '122002': { city: 'GURUGRAM', state: 'HARYANA', lat: 28.4906, lng: 77.0903, storeCode: 'GGN-T22B' },
  '700016': { city: 'KOLKATA', state: 'WEST BENGAL', lat: 22.5512, lng: 88.3533, storeCode: 'T6HZ' }
};

export class JioMartLocationService {
  /**
   * Resolves nearest store and serviceability for latitude & longitude
   */
  resolveCoordinates(lat, lng) {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || isNaN(longitude)) {
      throw new Error('Valid latitude and longitude are required');
    }

    let nearestStore = null;
    let minDistance = Infinity;

    for (const store of JIOMART_STORES) {
      const dist = calculateDistance(latitude, longitude, store.address.latitude, store.address.longitude);
      if (dist < minDistance) {
        minDistance = dist;
        nearestStore = store;
      }
    }

    const isServiceable = minDistance <= 25.0; // Quick commerce delivery radius

    return {
      coordinates: { latitude, longitude },
      serviceable: isServiceable,
      distanceKm: parseFloat(minDistance.toFixed(2)),
      nearestStore: nearestStore ? {
        uid: nearestStore.uid,
        code: nearestStore.code,
        display_name: nearestStore.display_name,
        department_name: nearestStore.department_name,
        city: nearestStore.address.city,
        state: nearestStore.address.state,
        pincode: nearestStore.address.pincode,
        delivery_promise: nearestStore.delivery_promise
      } : null
    };
  }

  /**
   * Validates and resolves 6-digit Indian PIN code
   */
  resolvePincode(pincode) {
    const cleanPin = String(pincode).trim();
    if (!/^\d{6}$/.test(cleanPin)) {
      return {
        valid: false,
        error: "Invalid PIN code format. Must be a 6-digit Indian PIN code."
      };
    }

    const mapped = PINCODE_CITY_MAP[cleanPin];
    if (mapped) {
      const store = JIOMART_STORES.find(s => s.code === mapped.storeCode) || JIOMART_STORES[0];
      return {
        valid: true,
        pincode: cleanPin,
        city: mapped.city,
        state: mapped.state,
        lat: mapped.lat,
        lng: mapped.lng,
        serviceable: true,
        store: {
          uid: store.uid,
          code: store.code,
          display_name: store.display_name,
          delivery_promise: store.delivery_promise
        }
      };
    }

    // Default valid Indian pincode fallback
    return {
      valid: true,
      pincode: cleanPin,
      city: 'MUMBAI',
      state: 'MAHARASHTRA',
      lat: 18.9316,
      lng: 72.8325,
      serviceable: true,
      store: {
        uid: JIOMART_STORES[0].uid,
        code: JIOMART_STORES[0].code,
        display_name: JIOMART_STORES[0].display_name,
        delivery_promise: JIOMART_STORES[0].delivery_promise
      }
    };
  }

  /**
   * Searches address landmarks and returns autocomplete recommendations
   */
  searchAddresses(query) {
    if (!query || query.trim().length === 0) return [];
    const q = query.toLowerCase().trim();

    const candidates = [
      { area: "HSR Layout", city: "Bengaluru", state: "Karnataka", pincode: "560102", lat: 12.9121, lng: 77.6446 },
      { area: "HSR Layout Sector 2", city: "Bengaluru", state: "Karnataka", pincode: "560102", lat: 12.9150, lng: 77.6480 },
      { area: "HSR Layout Police Station, 27th Main", city: "Bengaluru", state: "Karnataka", pincode: "560102", lat: 12.9110, lng: 77.6420 },
      { area: "Koramangala 4th Block", city: "Bengaluru", state: "Karnataka", pincode: "560034", lat: 12.9352, lng: 77.6245 },
      { area: "Indiranagar 100 Feet Road", city: "Bengaluru", state: "Karnataka", pincode: "560038", lat: 12.9719, lng: 77.6412 },
      { area: "Fort, Colaba", city: "Mumbai", state: "Maharashtra", pincode: "400001", lat: 18.9316, lng: 72.8325 },
      { area: "Bandra West, Hill Road", city: "Mumbai", state: "Maharashtra", pincode: "400050", lat: 19.0596, lng: 72.8295 },
      { area: "Connaught Place, Inner Circle", city: "Delhi", state: "Delhi", pincode: "110001", lat: 28.6304, lng: 77.2177 },
      { area: "DLF Cyber City, Phase 2", city: "Gurugram", state: "Haryana", pincode: "122002", lat: 28.4906, lng: 77.0903 }
    ];

    return candidates.filter(c =>
      c.area.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q) ||
      c.pincode.includes(q)
    ).map(c => ({
      description: `${c.area}, ${c.city}, ${c.state}, India`,
      area: c.area,
      city: c.city,
      state: c.state,
      pincode: c.pincode,
      lat: c.lat,
      lng: c.lng
    }));
  }

  /**
   * Returns fulfillment delivery fee schedule and thresholds
   */
  getDeliveryFeeQuote(storeCode = 'T6HZ') {
    return {
      response_time: new Date().toISOString().replace('T', ' ').slice(0, 19),
      result: {
        delivery_fee_list: [
          {
            config_name: "JIOMARTLITE",
            free_shipping_threshold: 399,
            shipping_fee: 30
          },
          {
            config_name: "SMART_BAZAAR_BASKET",
            free_shipping_threshold: 199,
            shipping_fee: 30,
            store_cohort: {
              cohort_id: "Default",
              cohort_matched: false,
              resolution: "store_cohort",
              resolution_tier: 3,
              store_code: storeCode
            }
          },
          {
            config_name: "JIOMART_BASKET",
            free_shipping_threshold: 1,
            shipping_fee: 0
          },
          {
            config_name: "WHATSAPP",
            free_shipping_threshold: 1,
            shipping_fee: 0
          }
        ]
      }
    };
  }

  getAllStores({ city = null } = {}) {
    if (city) {
      return JIOMART_STORES.filter(s => s.address.city.toLowerCase() === city.toLowerCase());
    }
    return JIOMART_STORES;
  }
}

export const locationService = new JioMartLocationService();
