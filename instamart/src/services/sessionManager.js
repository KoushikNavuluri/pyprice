/**
 * Swiggy Instamart Session & Security Manager
 * Manages deviceId, session ID (sid), token ID (tid), and client cookies matching Instamart standards.
 */

import crypto from 'crypto';

export class SessionManager {
  constructor() {
    this.sessions = new Map();
  }

  /**
   * Create or update client session context with pod assignment and security tokens
   */
  createSession({ latitude = null, longitude = null, pincode = null, podId = null } = {}) {
    const rawDeviceId = crypto.randomUUID();
    const deviceSignature = crypto.randomBytes(24).toString('base64url');
    const deviceId = `s:${rawDeviceId}.${deviceSignature}`;

    const rawSid = `uoe${crypto.randomBytes(12).toString('hex')}`;
    const sidSig = crypto.randomBytes(24).toString('base64url');
    const sid = `s:${rawSid}.${sidSig}`;

    // Token ID (tid) simulating JWT header & payload structure
    const tidPayload = Buffer.from(JSON.stringify({
      exp: Math.floor(Date.now() / 1000) + 2592000,
      iat: Math.floor(Date.now() / 1000),
      sid: rawSid,
      sub: crypto.randomUUID(),
      user_id: "0"
    })).toString('base64url');
    const tid = `eyJLSUQiOiIyIiwiYWxnIjoiSFMyNTYiLCJ0eXAiOiJKV1QifQ.${tidPayload}.${crypto.randomBytes(32).toString('base64url')}`;

    const sessionData = {
      sessionId: rawSid,
      deviceId,
      sid,
      tid,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      location: {
        latitude,
        longitude,
        pincode,
        podId
      },
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "application/json",
        "Referer": "https://instamart.in/",
        "platform": "web",
        "subplatform": "dweb",
        "versionCode": "1200",
        ...(podId ? { "podId": podId } : {})
      },
      cookies: {
        "deviceId": deviceId,
        "sid": sid,
        "tid": tid,
        "platform": "web",
        "subplatform": "dweb",
        "versionCode": "1200",
        ...(podId ? { "podId": podId } : {})
      }
    };

    this.sessions.set(rawSid, sessionData);
    return sessionData;
  }

  getSession(sessionId) {
    if (!sessionId) return null;
    return this.sessions.get(sessionId) || null;
  }

  updateSessionLocation(sessionId, { latitude, longitude, pincode, podId }) {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    session.location = { latitude, longitude, pincode, podId };
    if (podId) {
      session.headers.podId = podId;
      session.cookies.podId = podId;
    }
    return session;
  }
}
