/**
 * BigBasket Session and Device Bootstrapping Manager
 * Handles anonymous session tokens, device UUIDs, geolocation cookies, and request headers.
 */

import crypto from 'crypto';

export class SessionManager {
  constructor() {
    this.sessions = new Map();
  }

  /**
   * Bootstraps client session with BigBasket cookies and location context
   */
  createSession({ latitude = null, longitude = null, pincode = null, hubId = null, cityId = "1" } = {}) {
    const sessionId = crypto.randomUUID();
    const deviceId = crypto.randomUUID();
    const bbMid = `bb_mid_${crypto.randomBytes(12).toString('hex')}`;
    const csrfToken = crypto.randomBytes(16).toString('hex');
    const resolvedHubId = hubId || "7427";

    const sessionData = {
      sessionId,
      deviceId,
      bbMid,
      csrfToken,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      location: {
        latitude,
        longitude,
        pincode,
        hubId: resolvedHubId,
        cityId
      },
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "x-channel": "bb-web",
        "xentrycontext": "bbnow",
        "xentrycontextid": "10",
        "x-tracker": sessionId,
        "x-csrf-token": csrfToken
      },
      cookies: {
        "_bb_cid": String(cityId),
        "_bb_nhid": String(resolvedHubId),
        "_bb_dsid": String(resolvedHubId),
        "_bb_sa_ids": "19224",
        "_bb_cda_sa_info": "djIuY2RhX3NhLjEwLjE5MjI0",
        "xentrycontext": "bbnow",
        "xentrycontextid": "10",
        "_bb_mid": bbMid,
        ...(latitude ? { "_bb_lat": String(latitude) } : {}),
        ...(longitude ? { "_bb_lng": String(longitude) } : {})
      }
    };

    this.sessions.set(sessionId, sessionData);
    return sessionData;
  }

  getSession(sessionId) {
    if (!sessionId) return null;
    return this.sessions.get(sessionId) || null;
  }

  updateSessionLocation(sessionId, { latitude, longitude, pincode, hubId, cityId }) {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    session.location = { latitude, longitude, pincode, hubId, cityId };
    if (hubId) {
      session.cookies._bb_nhid = String(hubId);
      session.cookies._bb_dsid = String(hubId);
    }
    if (cityId) {
      session.cookies._bb_cid = String(cityId);
    }
    if (latitude) {
      session.cookies._bb_lat = String(latitude);
    }
    if (longitude) {
      session.cookies._bb_lng = String(longitude);
    }
    return session;
  }
}
