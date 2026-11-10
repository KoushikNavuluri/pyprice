/**
 * Zepto Session and Security State Management
 * Encapsulates session initialization, CSRF secrets, cookies, and rate-limiting.
 */

import crypto from 'crypto';

export class SessionManager {
  constructor() {
    this.sessions = new Map();
  }

  /**
   * Create or retrieve client session with required CSRF tokens and location context
   */
  createSession({ latitude = null, longitude = null, pincode = null, storeId = null } = {}) {
    const sessionId = crypto.randomUUID();
    const csrfSecret = crypto.randomBytes(16).toString('hex');
    const userSessionId = crypto.randomUUID();

    const sessionData = {
      sessionId,
      userSessionId,
      csrfSecret,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      location: {
        latitude,
        longitude,
        pincode,
        storeId
      },
      headers: {
        "tenant": "ZEPTO",
        "platform": "WEB",
        "app_version": "16.2.11",
        "userSessionId": userSessionId,
        "x-csrf-secret": csrfSecret,
        ...(storeId ? { "storeId": storeId } : {})
      },
      cookies: {
        "session_id": sessionId,
        "user_session_id": userSessionId,
        ...(storeId ? { "storeId": storeId } : {})
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
    if (storeId) {
      session.headers.storeId = storeId;
      session.cookies.storeId = storeId;
    }
    return session;
  }
}
