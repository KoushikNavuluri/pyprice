/**
 * Zepto Geocoding and Location Resolver
 * Computes haversine distance, resolves dark stores from pincodes or coordinates,
 * and handles location serviceability validation.
 */

import { KNOWN_DARK_STORES } from '../../data/dark_stores.js';

export function haversineKm(lat1, lon1, lat2, lon2) {
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

// Standard Indian Pincode centroids for major service regions
const PINCODE_MAP = {
  // Bengaluru
  "560102": { name: "HSR Layout, Bengaluru", lat: 12.9121, lng: 77.6446, city: "Bengaluru", state: "Karnataka" },
  "560038": { name: "Indiranagar, Bengaluru", lat: 12.9784, lng: 77.6408, city: "Bengaluru", state: "Karnataka" },
  "560034": { name: "Koramangala, Bengaluru", lat: 12.9352, lng: 77.6245, city: "Bengaluru", state: "Karnataka" },
  "560001": { name: "MG Road, Bengaluru", lat: 12.9756, lng: 77.6066, city: "Bengaluru", state: "Karnataka" },
  // Delhi NCR
  "110091": { name: "Mayur Vihar, Delhi", lat: 28.6083, lng: 77.3005, city: "Delhi", state: "Delhi" },
  "110032": { name: "Shahdara, Delhi", lat: 28.6738, lng: 77.2914, city: "Delhi", state: "Delhi" },
  "110001": { name: "Connaught Place, Delhi", lat: 28.6304, lng: 77.2177, city: "Delhi", state: "Delhi" },
  "201303": { name: "Noida Sector 46, Noida", lat: 28.5524, lng: 77.3592, city: "Noida", state: "Uttar Pradesh" },
  "122002": { name: "DLF Cyber City, Gurugram", lat: 28.4950, lng: 77.0895, city: "Gurugram", state: "Haryana" },
  // Mumbai
  "400076": { name: "Powai, Mumbai", lat: 19.1197, lng: 72.9051, city: "Mumbai", state: "Maharashtra" },
  "400053": { name: "Andheri West, Mumbai", lat: 19.1363, lng: 72.8277, city: "Mumbai", state: "Maharashtra" },
  "400001": { name: "Fort, Mumbai", lat: 18.9322, lng: 72.8354, city: "Mumbai", state: "Maharashtra" },
  // Chandigarh
  "160036": { name: "Sector 38, Chandigarh", lat: 30.7482, lng: 76.7588, city: "Chandigarh", state: "Chandigarh" },
  // Hyderabad
  "500032": { name: "Gachibowli, Hyderabad", lat: 17.4401, lng: 78.3489, city: "Hyderabad", state: "Telangana" }
};

/**
 * Resolve dark stores and serviceability from coordinates
 */
export function resolveLocationByCoordinates(latitude, longitude, maxDistanceKm = 8.0) {
  const storesWithDistance = KNOWN_DARK_STORES.map(store => {
    const dist = haversineKm(latitude, longitude, store.latitude, store.longitude);
    return {
      ...store,
      distanceKm: parseFloat(dist.toFixed(2))
    };
  }).sort((a, b) => a.distanceKm - b.distanceKm);

  const nearest = storesWithDistance[0];
  const isServiceable = nearest && nearest.distanceKm <= maxDistanceKm;

  return {
    latitude,
    longitude,
    serviceable: isServiceable,
    primaryStore: isServiceable ? nearest : null,
    nearbyStores: storesWithDistance.filter(s => s.distanceKm <= maxDistanceKm),
    unserviceableReason: isServiceable ? null : "Location outside dark store delivery radius (> 8 km)"
  };
}

/**
 * Resolve dark store by Indian 6-digit Pincode
 */
export function resolveLocationByPincode(pincode) {
  const cleanPin = String(pincode).trim();
  const pinData = PINCODE_MAP[cleanPin];

  if (!pinData) {
    // Check if pincode matches any dark store directly
    const directStore = KNOWN_DARK_STORES.find(s => s.pincode === cleanPin);
    if (directStore) {
      return {
        pincode: cleanPin,
        serviceable: true,
        address: `${directStore.name}, ${directStore.city}`,
        city: directStore.city,
        state: directStore.state,
        primaryStore: {
          ...directStore,
          distanceKm: 0.5
        },
        nearbyStores: [directStore]
      };
    }
    return {
      pincode: cleanPin,
      serviceable: false,
      message: `Pincode ${cleanPin} is currently unserviceable or not in active catalog.`
    };
  }

  const locationRes = resolveLocationByCoordinates(pinData.lat, pinData.lng);
  return {
    pincode: cleanPin,
    areaName: pinData.name,
    city: pinData.city,
    state: pinData.state,
    latitude: pinData.lat,
    longitude: pinData.lng,
    serviceable: locationRes.serviceable,
    primaryStore: locationRes.primaryStore,
    nearbyStores: locationRes.nearbyStores
  };
}

/**
 * Address Geocoding / Search Autocomplete
 */
export function searchAddresses(query) {
  const q = String(query).toLowerCase().trim();
  const results = [];

  for (const [pin, info] of Object.entries(PINCODE_MAP)) {
    if (
      pin.includes(q) ||
      info.name.toLowerCase().includes(q) ||
      info.city.toLowerCase().includes(q) ||
      info.state.toLowerCase().includes(q)
    ) {
      results.push({
        pincode: pin,
        formattedAddress: info.name,
        city: info.city,
        state: info.state,
        latitude: info.lat,
        longitude: info.lng
      });
    }
  }

  return results;
}
