/**
 * Swiggy Instamart Location & Dark Store (Pod) Service
 * Resolves location by GPS coordinates or PIN code, verifies serviceability, and assigns nearest fulfillment pod.
 */

import { INSTAMART_PODS } from '../../data/pods.js';

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
    throw new Error('Coordinates must be valid floating point numbers');
  }

  // Calculate distance to each known pod
  const podDistances = INSTAMART_PODS.map(pod => {
    const dist = haversineKm(latitude, longitude, pod.latitude, pod.longitude);
    return {
      ...pod,
      distanceKm: parseFloat(dist.toFixed(2))
    };
  }).sort((a, b) => a.distanceKm - b.distanceKm);

  const nearest = podDistances[0];
  const maxDeliveryRadiusKm = 15.0; // Hyperlocal dark store range

  if (nearest && nearest.distanceKm <= maxDeliveryRadiusKm) {
    return {
      latitude,
      longitude,
      serviceable: true,
      serviceabilityType: nearest.serviceabilityType,
      primaryPod: {
        podId: nearest.podId,
        storeName: nearest.storeName,
        city: nearest.city,
        state: nearest.state,
        pincode: nearest.pincode,
        sla: nearest.sla,
        distanceKm: nearest.distanceKm,
        cartConstraints: nearest.cartConstraints
      },
      nearbyPods: podDistances.slice(0, 3)
    };
  }

  return {
    latitude,
    longitude,
    serviceable: false,
    serviceabilityType: "NON_SERVICEABLE",
    message: "Instamart is not serviceable at these coordinates yet.",
    primaryPod: null,
    nearbyPods: []
  };
}

export function resolveLocationByPincode(pincode) {
  const pin = String(pincode).trim();
  if (!/^\d{6}$/.test(pin)) {
    throw new Error('Pincode must be a 6-digit Indian postal code');
  }

  // Match exact pod pincode
  const matchedPod = INSTAMART_PODS.find(pod => pod.pincode === pin);

  if (matchedPod) {
    return {
      pincode: pin,
      city: matchedPod.city,
      state: matchedPod.state,
      serviceable: true,
      serviceabilityType: matchedPod.serviceabilityType,
      primaryPod: {
        podId: matchedPod.podId,
        storeName: matchedPod.storeName,
        city: matchedPod.city,
        state: matchedPod.state,
        pincode: matchedPod.pincode,
        sla: matchedPod.sla,
        cartConstraints: matchedPod.cartConstraints
      }
    };
  }

  // City-level fallback for major hubs
  const prefix = pin.substring(0, 2);
  let defaultPod = null;
  if (prefix === '56') defaultPod = INSTAMART_PODS.find(p => p.city === 'Bengaluru');
  else if (prefix === '11') defaultPod = INSTAMART_PODS.find(p => p.city === 'Delhi');
  else if (prefix === '40') defaultPod = INSTAMART_PODS.find(p => p.city === 'Mumbai');

  if (defaultPod) {
    return {
      pincode: pin,
      city: defaultPod.city,
      state: defaultPod.state,
      serviceable: true,
      serviceabilityType: defaultPod.serviceabilityType,
      primaryPod: {
        podId: defaultPod.podId,
        storeName: defaultPod.storeName,
        city: defaultPod.city,
        state: defaultPod.state,
        pincode: defaultPod.pincode,
        sla: defaultPod.sla,
        cartConstraints: defaultPod.cartConstraints
      }
    };
  }

  return {
    pincode: pin,
    serviceable: false,
    serviceabilityType: "NON_SERVICEABLE",
    message: `Pincode ${pin} is outside current Swiggy Instamart operational dark stores.`
  };
}

export function searchAddresses(query) {
  const q = String(query).toLowerCase().trim();
  const knownAreas = [
    { pincode: "560102", formattedAddress: "HSR Layout, Bengaluru, Karnataka", city: "Bengaluru", state: "Karnataka", latitude: 12.9121, longitude: 77.6446 },
    { pincode: "560034", formattedAddress: "Koramangala, Bengaluru, Karnataka", city: "Bengaluru", state: "Karnataka", latitude: 12.9352, longitude: 77.6245 },
    { pincode: "560038", formattedAddress: "Indiranagar, Bengaluru, Karnataka", city: "Bengaluru", state: "Karnataka", latitude: 12.9784, longitude: 77.6408 },
    { pincode: "110001", formattedAddress: "Connaught Place, New Delhi, Delhi", city: "Delhi", state: "Delhi", latitude: 28.6304, longitude: 77.2177 },
    { pincode: "400050", formattedAddress: "Bandra West, Mumbai, Maharashtra", city: "Mumbai", state: "Maharashtra", latitude: 19.0596, longitude: 72.8295 }
  ];

  return knownAreas.filter(a =>
    a.formattedAddress.toLowerCase().includes(q) ||
    a.city.toLowerCase().includes(q) ||
    a.pincode.includes(q)
  );
}

export function getPods(city = null) {
  if (city) {
    const c = city.toLowerCase().trim();
    return INSTAMART_PODS.filter(p => p.city.toLowerCase() === c);
  }
  return INSTAMART_PODS;
}
