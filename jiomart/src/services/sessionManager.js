/**
 * JioMart Session & Security Token Manager
 * Manages JioMart/Fynd storefront tokens, guest sessions, and cookie payloads.
 */

import crypto from 'crypto';

export class JioMartSessionManager {
  constructor() {
    this.applicationId = '685945f46c8c7aee3f3af605';
    this.applicationToken = 'TpKw7wD9h';
    this.companyId = 1;
    this.sessions = new Map();
  }

  /**
   * Initializes or bootstraps a JioMart session
   */
  initSession({ pincode = '400001', city = 'MUMBAI', state = 'MAHARASHTRA', lat = 18.9316, lng = 72.8325 } = {}) {
    const sessionId = crypto.randomUUID();
    const visitorId = crypto.randomBytes(16).toString('hex');
    const stormbreakerUuid = crypto.randomUUID();

    const locationDetails = {
      country: 'INDIA',
      country_iso_code: 'IN',
      city: city.toUpperCase(),
      pincode: String(pincode),
      state: state.toUpperCase()
    };

    const geolocation = {
      latitude: String(lat),
      longitude: String(lng),
      polygon_ids: [`T6HZ_QC_${pincode.slice(0, 4)}`, `DEFAULT_QC_${city.slice(0, 3).toUpperCase()}`]
    };

    const sessionData = {
      sessionId,
      visitorId,
      stormbreakerUuid,
      applicationId: this.applicationId,
      applicationToken: this.applicationToken,
      companyId: this.companyId,
      channelType: 'jiomart-marketplace',
      journey: 'quick',
      location: locationDetails,
      geolocation,
      cookies: {
        app_location_details: encodeURIComponent(JSON.stringify(locationDetails)),
        app_geolocation: encodeURIComponent(JSON.stringify(geolocation)),
        fulfillment_stores: 'T6HZ,TXXH,8636',
        journey: 'quick'
      },
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    this.sessions.set(sessionId, sessionData);
    return sessionData;
  }

  getSession(sessionId) {
    return this.sessions.get(sessionId) || null;
  }

  updateLocation(sessionId, { pincode, city, state, lat, lng }) {
    const session = this.getSession(sessionId);
    if (!session) return null;

    if (pincode) session.location.pincode = String(pincode);
    if (city) session.location.city = city.toUpperCase();
    if (state) session.location.state = state.toUpperCase();
    if (lat) session.geolocation.latitude = String(lat);
    if (lng) session.geolocation.longitude = String(lng);

    session.cookies.app_location_details = encodeURIComponent(JSON.stringify(session.location));
    session.cookies.app_geolocation = encodeURIComponent(JSON.stringify(session.geolocation));

    return session;
  }
}

export const sessionManager = new JioMartSessionManager();
