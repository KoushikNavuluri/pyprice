/**
 * BigBasket Hyperlocal Location & Hub Service
 * Resolves GPS coordinates, validates Indian PIN codes, and assigns bbnow fulfillment dark store hubs.
 */

import { BIGBASKET_HUBS } from '../../data/hubs.js';

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

  const hubDistances = BIGBASKET_HUBS.map(hub => {
    const dist = haversineKm(latitude, longitude, hub.latitude, hub.longitude);
    return {
      ...hub,
      distanceKm: parseFloat(dist.toFixed(2))
    };
  }).sort((a, b) => a.distanceKm - b.distanceKm);

  const nearest = hubDistances[0];
  const maxDeliveryRadiusKm = 15.0;

  if (nearest && nearest.distanceKm <= maxDeliveryRadiusKm) {
    return {
      latitude,
      longitude,
      serviceable: true,
      serviceType: "bbnow",
      primaryHub: {
        hubId: nearest.hubId,
        nhid: nearest.nhid,
        sa_id: nearest.sa_id,
        cda_sa_info: nearest.cda_sa_info,
        name: nearest.name,
        city: nearest.city,
        cityId: nearest.cityId,
        pincode: nearest.pincode,
        etaMinutes: nearest.etaMinutes,
        deliveryFee: nearest.deliveryFee,
        distanceKm: nearest.distanceKm
      },
      nearbyHubs: hubDistances.slice(0, 3)
    };
  }

  return {
    latitude,
    longitude,
    serviceable: false,
    serviceType: "bbnow",
    message: "BigBasket bbnow is currently not serviceable at these coordinates.",
    primaryHub: null,
    nearbyHubs: []
  };
}

export function resolveLocationByPincode(pincode) {
  const pin = String(pincode).trim();
  if (!/^\d{6}$/.test(pin)) {
    throw new Error('Pincode must be a 6-digit Indian postal code');
  }

  const exactHub = BIGBASKET_HUBS.find(h => h.pincode === pin);
  if (exactHub) {
    return {
      pincode: pin,
      serviceable: true,
      serviceType: "bbnow",
      city: exactHub.city,
      primaryHub: {
        hubId: exactHub.hubId,
        nhid: exactHub.nhid,
        sa_id: exactHub.sa_id,
        cda_sa_info: exactHub.cda_sa_info,
        name: exactHub.name,
        city: exactHub.city,
        pincode: exactHub.pincode,
        etaMinutes: exactHub.etaMinutes,
        deliveryFee: exactHub.deliveryFee,
        distanceKm: 0.0
      }
    };
  }

  // Prefix matching for nearby postal circles
  const prefix = pin.substring(0, 3);
  const matched = BIGBASKET_HUBS.find(h => h.pincode.startsWith(prefix));
  if (matched) {
    return {
      pincode: pin,
      serviceable: true,
      serviceType: "bbnow",
      city: matched.city,
      primaryHub: {
        hubId: matched.hubId,
        nhid: matched.nhid,
        sa_id: matched.sa_id,
        cda_sa_info: matched.cda_sa_info,
        name: matched.name,
        city: matched.city,
        pincode: matched.pincode,
        etaMinutes: matched.etaMinutes + 5,
        deliveryFee: matched.deliveryFee,
        distanceKm: 4.5
      }
    };
  }

  return {
    pincode: pin,
    serviceable: false,
    serviceType: "bbnow",
    message: `Pincode ${pin} is outside BigBasket bbnow 10-minute delivery coverage area.`,
    primaryHub: null
  };
}

const COMMON_ADDRESS_SUGGESTIONS = [
  { placeId: "ChIJbU60qLMWrjsR5SqRIv4OM4U", mainText: "HSR Layout", secondaryText: "Bengaluru, Karnataka, India", city: "Bengaluru", pincode: "560102", lat: 12.9121, lng: 77.6446 },
  { placeId: "ChIJW8p7xWwUrjsRO_1W1d2N_G8", mainText: "Koramangala", secondaryText: "Bengaluru, Karnataka, India", city: "Bengaluru", pincode: "560034", lat: 12.9352, lng: 77.6245 },
  { placeId: "ChIJK0tU5bQUrjsR76Z-3YgN2pU", mainText: "Indiranagar", secondaryText: "Bengaluru, Karnataka, India", city: "Bengaluru", pincode: "560038", lat: 12.9784, lng: 77.6408 },
  { placeId: "ChIJc8QkO3EUrjsRgfKq0rRj4eA", mainText: "Whitefield", secondaryText: "Bengaluru, Karnataka, India", city: "Bengaluru", pincode: "560066", lat: 12.9698, lng: 77.7499 },
  { placeId: "ChIJZ3j4lE3O5zsRP-75gX6N1y8", mainText: "Andheri West", secondaryText: "Mumbai, Maharashtra, India", city: "Mumbai", pincode: "400053", lat: 19.1363, lng: 72.8277 },
  { placeId: "ChIJ9W0d5_bO5zsR0gL5g9x7h2U", mainText: "Bandra West", secondaryText: "Mumbai, Maharashtra, India", city: "Mumbai", pincode: "400050", lat: 19.0596, lng: 72.8295 },
  { placeId: "ChIJ8TuuKk3kDDkR4h4aW6W8Z8M", mainText: "South Extension", secondaryText: "New Delhi, Delhi, India", city: "Delhi", pincode: "110049", lat: 28.5729, lng: 77.2227 },
  { placeId: "ChIJF8Z8ZzTkDDkR8y8y1m7mG7k", mainText: "DLF Cyber City", secondaryText: "Gurugram, Haryana, India", city: "Gurugram", pincode: "122002", lat: 28.4906, lng: 77.0898 }
];

export function searchAddresses(query) {
  const q = String(query).toLowerCase().trim();
  if (!q) return [];
  const tokens = q.split(/[\s,]+/).filter(Boolean);

  return COMMON_ADDRESS_SUGGESTIONS.filter(addr => {
    const full = `${addr.mainText} ${addr.secondaryText} ${addr.city} ${addr.pincode}`.toLowerCase();
    return tokens.every(token => full.includes(token));
  });
}

export function getHubs(city = null) {
  if (!city) return BIGBASKET_HUBS;
  const c = city.toLowerCase().trim();
  return BIGBASKET_HUBS.filter(h => h.city.toLowerCase() === c);
}
