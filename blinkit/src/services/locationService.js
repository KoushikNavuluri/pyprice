/**
 * Blinkit Hyperlocal Location & Dark Store Service
 * Resolves GPS coordinates, validates 6-digit Indian PIN codes, and assigns fulfillment dark store hubs.
 */

import { BLINKIT_DARK_STORES } from '../../data/dark_stores.js';

export function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function resolveLocationByCoordinates(latitude, longitude) {
  if (isNaN(latitude) || isNaN(longitude)) {
    throw new Error('Coordinates must be valid numbers');
  }

  const storeDistances = BLINKIT_DARK_STORES.map(store => {
    const dist = haversineKm(latitude, longitude, store.latitude, store.longitude);
    return {
      ...store,
      distanceKm: parseFloat(dist.toFixed(2))
    };
  }).sort((a, b) => a.distanceKm - b.distanceKm);

  const nearest = storeDistances[0];
  const maxDeliveryRadiusKm = 12.0;

  if (nearest && nearest.distanceKm <= maxDeliveryRadiusKm) {
    return {
      latitude,
      longitude,
      serviceable: true,
      primaryStore: {
        storeId: nearest.storeId,
        merchantId: nearest.merchantId,
        name: nearest.name,
        city: nearest.city,
        pincode: nearest.pincode,
        etaMinutes: nearest.etaMinutes,
        deliveryFee: nearest.deliveryFee,
        distanceKm: nearest.distanceKm
      },
      nearbyStores: storeDistances.slice(0, 3)
    };
  }

  return {
    latitude,
    longitude,
    serviceable: false,
    message: "Blinkit is currently not serviceable at these coordinates.",
    primaryStore: null,
    nearbyStores: []
  };
}

export function resolveLocationByPincode(pincode) {
  const pin = String(pincode).trim();
  if (!/^\d{6}$/.test(pin)) {
    throw new Error('Pincode must be a 6-digit Indian postal code');
  }

  const matchedStore = BLINKIT_DARK_STORES.find(store => store.pincode === pin);

  if (matchedStore) {
    return {
      pincode: pin,
      city: matchedStore.city,
      state: matchedStore.state,
      serviceable: true,
      primaryStore: {
        storeId: matchedStore.storeId,
        merchantId: matchedStore.merchantId,
        name: matchedStore.name,
        city: matchedStore.city,
        pincode: matchedStore.pincode,
        etaMinutes: matchedStore.etaMinutes,
        deliveryFee: matchedStore.deliveryFee
      }
    };
  }

  // Regional city matching for Indian metro prefixes
  const prefix = pin.substring(0, 2);
  let defaultStore = null;
  if (prefix === '56') defaultStore = BLINKIT_DARK_STORES.find(s => s.city === 'Bengaluru');
  else if (prefix === '11') defaultStore = BLINKIT_DARK_STORES.find(s => s.city === 'Delhi');
  else if (prefix === '40') defaultStore = BLINKIT_DARK_STORES.find(s => s.city === 'Mumbai');
  else if (prefix === '12') defaultStore = BLINKIT_DARK_STORES.find(s => s.city === 'Gurgaon');

  if (defaultStore) {
    return {
      pincode: pin,
      city: defaultStore.city,
      state: defaultStore.state,
      serviceable: true,
      primaryStore: {
        storeId: defaultStore.storeId,
        merchantId: defaultStore.merchantId,
        name: defaultStore.name,
        city: defaultStore.city,
        pincode: defaultStore.pincode,
        etaMinutes: defaultStore.etaMinutes,
        deliveryFee: defaultStore.deliveryFee
      }
    };
  }

  return {
    pincode: pin,
    serviceable: false,
    message: `Pincode ${pin} is outside Blinkit's operational delivery zones.`
  };
}

export function searchAddresses(query) {
  const q = String(query).toLowerCase().trim();
  const knownAreas = [
    { pincode: "560102", formattedAddress: "HSR Layout, Bengaluru, Karnataka", city: "Bengaluru", state: "Karnataka", latitude: 12.9121, longitude: 77.6446 },
    { pincode: "560034", formattedAddress: "Koramangala, Bengaluru, Karnataka", city: "Bengaluru", state: "Karnataka", latitude: 12.9352, longitude: 77.6245 },
    { pincode: "560038", formattedAddress: "Indiranagar, Bengaluru, Karnataka", city: "Bengaluru", state: "Karnataka", latitude: 12.9784, longitude: 77.6408 },
    { pincode: "110001", formattedAddress: "Connaught Place, New Delhi, Delhi", city: "Delhi", state: "Delhi", latitude: 28.6304, longitude: 77.2177 },
    { pincode: "400050", formattedAddress: "Bandra West, Mumbai, Maharashtra", city: "Mumbai", state: "Maharashtra", latitude: 19.0596, longitude: 72.8295 },
    { pincode: "122002", formattedAddress: "Sector 29, Gurgaon, Haryana", city: "Gurgaon", state: "Haryana", latitude: 28.4682, longitude: 77.0637 }
  ];

  return knownAreas.filter(a =>
    a.formattedAddress.toLowerCase().includes(q) ||
    a.city.toLowerCase().includes(q) ||
    a.pincode.includes(q)
  );
}

export function getDarkStores(city = null) {
  if (city) {
    const c = city.toLowerCase().trim();
    return BLINKIT_DARK_STORES.filter(s => s.city.toLowerCase() === c);
  }
  return BLINKIT_DARK_STORES;
}
