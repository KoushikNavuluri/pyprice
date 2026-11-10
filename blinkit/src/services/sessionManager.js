/**
 * Blinkit Session and Device Bootstrapping Manager
 * Handles anonymous auth keys, device UUIDs, geolocation cookies, and request headers.
 */

import crypto from 'crypto';

export class SessionManager {
  constructor() {
    this.sessions = new Map();
  }

  /**
   * Bootstraps client session with auth_key, deviceId, and location context
   */
  createSession({ latitude = null, longitude = null, pincode = null, storeId = null } = {}) {
    const sessionId = crypto.randomUUID();
    const deviceId = crypto.randomUUID();
    const authKey = `bk_auth_${crypto.randomBytes(16).toString('hex')}`;
    const reqKey = "4f14ad32-8df7-46e3-ae9e-1fa99042b406";

    const sessionData = {
      sessionId,
      deviceId,
      authKey,
      reqKey,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      location: {
        latitude,
        longitude,
        pincode,
        storeId
      },
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "auth_key": authKey,
        "req_key": reqKey,
        "device_id": deviceId,
        ...(latitude ? { "lat": String(latitude) } : {}),
        ...(longitude ? { "lon": String(longitude) } : {}),
        ...(storeId ? { "store_id": String(storeId) } : {})
      },
      cookies: {
        "device_id": deviceId,
        "auth_key": authKey,
        ...(latitude ? { "gr_1_lat": String(latitude) } : {}),
        ...(longitude ? { "gr_1_lng": String(longitude) } : {}),
        ...(storeId ? { "store_id": String(storeId) } : {})
      }
    };

    this.sessions.set(sessionId, sessionData);
    return sessionData;
  }

  getSession(sessionId) {
    if (!sessionId) return null;
    return this.sessions.get(sessionId) || null;
  }

  updateSessionLocation(sessionId, { latitude, longitude, pincode, storeId }) {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    session.location = { latitude, longitude, pincode, storeId };
    if (latitude) {
      session.headers.lat = String(latitude);
      session.cookies.gr_1_lat = String(latitude);
    }
    if (longitude) {
      session.headers.lon = String(longitude);
      session.cookies.gr_1_lng = String(longitude);
    }
    if (storeId) {
      session.headers.store_id = String(storeId);
      session.cookies.store_id = String(storeId);
    }
    return session;
  }
}
