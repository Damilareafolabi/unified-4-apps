/**
 * Google Marketing Platform & Measurement Service
 * GA4, Firebase Analytics, Display & Video 360 (DV360), Campaign Manager 360 (CM360)
 * Includes Consent Mode v2, Privacy Sanitization & Deduplication
 */

export type ConsentStatus = 'granted' | 'denied';

export interface UserConsent {
  ad_storage: ConsentStatus;
  analytics_storage: ConsentStatus;
  ad_user_data: ConsentStatus;
  ad_personalization: ConsentStatus;
  updatedAt: string;
}

export interface GMPConfig {
  ga4MeasurementId?: string;
  firebaseAnalyticsEnabled?: boolean;
  cm360ConfigId?: string;
  dv360AdvertiserId?: string;
  floodlightActivityGroup?: string;
  debugMode?: boolean;
}

// In-memory deduplication set (prevents duplicate conversions within session)
const dispatchedEventIds = new Set<string>();

// Default privacy-conscious consent
const DEFAULT_CONSENT: UserConsent = {
  ad_storage: 'denied',
  analytics_storage: 'granted',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  updatedAt: new Date().toISOString()
};

// Retrieve stored consent
export function getStoredConsent(): UserConsent {
  try {
    const raw = localStorage.getItem('gmp_user_consent');
    if (raw) return JSON.parse(raw);
  } catch {}
  return DEFAULT_CONSENT;
}

// Update and persist consent
export function setStoredConsent(consent: Partial<UserConsent>): UserConsent {
  const current = getStoredConsent();
  const updated: UserConsent = {
    ...current,
    ...consent,
    updatedAt: new Date().toISOString()
  };
  localStorage.setItem('gmp_user_consent', JSON.stringify(updated));

  // Forward to gtag if available in window
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('consent', 'update', {
      ad_storage: updated.ad_storage,
      analytics_storage: updated.analytics_storage,
      ad_user_data: updated.ad_user_data,
      ad_personalization: updated.ad_personalization
    });
  }
  return updated;
}

// Sanitize event parameters: remove PII, passwords, CV texts, secrets
function sanitizeParams(params: Record<string, any>): Record<string, any> {
  const clean: Record<string, any> = {};
  const forbiddenKeywords = ['password', 'secret', 'token', 'cv_text', 'resume_body', 'raw_card', 'message_body', 'phone_full', 'nin', 'ssn'];

  for (const [key, value] of Object.entries(params)) {
    const lowerKey = key.toLowerCase();
    const isSensitive = forbiddenKeywords.some(f => lowerKey.includes(f));
    if (isSensitive) continue;

    // Truncate long strings to prevent accidental data leaks
    if (typeof value === 'string') {
      clean[key] = value.length > 120 ? value.substring(0, 117) + '...' : value;
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      clean[key] = value;
    } else if (Array.isArray(value)) {
      clean[key] = value.length;
    }
  }
  return clean;
}

// Log of recorded events for in-app transparency & debugging
export interface RecordedAnalyticsEvent {
  id: string;
  eventName: string;
  platform: 'lazyceo' | 'keydirect' | 'talentdock' | 'gigconnect' | 'global';
  params: Record<string, any>;
  timestamp: string;
  isConversion: boolean;
  consentState: string;
}

const analyticsEventLog: RecordedAnalyticsEvent[] = [];

export function getRecordedAnalyticsEvents(): RecordedAnalyticsEvent[] {
  return [...analyticsEventLog];
}

/**
 * Universal Event & Conversion Dispatcher
 */
export function trackEvent(
  platform: 'lazyceo' | 'keydirect' | 'talentdock' | 'gigconnect' | 'global',
  eventName: string,
  params: Record<string, any> = {},
  isConversion: boolean = false,
  dedupKey?: string
) {
  // Prevent duplicate conversion fires
  if (dedupKey) {
    if (dispatchedEventIds.has(dedupKey)) {
      console.warn(`[GMP Analytics] Duplicate event prevented: ${eventName} (dedupKey: ${dedupKey})`);
      return;
    }
    dispatchedEventIds.add(dedupKey);
  }

  const consent = getStoredConsent();
  if (consent.analytics_storage === 'denied' && !isConversion) {
    return;
  }

  const cleanParams = sanitizeParams(params);
  cleanParams.platform = platform;
  cleanParams.timestamp = new Date().toISOString();

  const record: RecordedAnalyticsEvent = {
    id: dedupKey || `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    eventName,
    platform,
    params: cleanParams,
    timestamp: new Date().toLocaleTimeString(),
    isConversion,
    consentState: `Analytics: ${consent.analytics_storage}, Ads: ${consent.ad_storage}`
  };

  analyticsEventLog.unshift(record);
  if (analyticsEventLog.length > 100) analyticsEventLog.pop();

  // Log in development console
  console.log(`%c[GMP Event: ${platform.toUpperCase()}] ${eventName}${isConversion ? ' ★ KEY CONVERSION' : ''}`, 'color: #10b981; font-weight: bold;', cleanParams);

  // Dispatch to window.gtag if integrated
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, cleanParams);
  }
}

// ---------------------------------------------------------------------------
// Typed Conversion Event Triggers per Platform
// ---------------------------------------------------------------------------

// A. LazyCEO Conversions
export const trackLazyCEOCampaignCreated = (campaignId: string, name: string) => {
  trackEvent('lazyceo', 'campaign_created', { campaign_id: campaignId, campaign_name: name }, false, `lc-create-${campaignId}`);
};

export const trackLazyCEOCampaignPublished = (campaignId: string, channelsCount: number) => {
  trackEvent('lazyceo', 'campaign_published', { campaign_id: campaignId, channels_count: channelsCount }, true, `lc-pub-${campaignId}`);
};

export const trackLazyCEOLeadGenerated = (leadSource: string) => {
  trackEvent('lazyceo', 'lead_generated', { lead_source: leadSource }, true);
};

export const trackLazyCEOSubscriptionStarted = (planId: string, priceUSD: number, currency: string = 'USD') => {
  trackEvent('lazyceo', 'subscription_started', { value: priceUSD, currency, plan_id: planId }, true, `sub-${planId}-${Date.now()}`);
};

export const trackLazyCEOBillboardBooked = (bookingId: string, location: string, valueUSD: number) => {
  trackEvent('lazyceo', 'advertising_booking_completed', { booking_id: bookingId, location, value: valueUSD, currency: 'USD' }, true, `bb-${bookingId}`);
};

// B. KeyDirect Conversions
export const trackKeyDirectPropertyPublished = (propertyId: string, category: string, priceNaira: number) => {
  trackEvent('keydirect', 'property_published', { property_id: propertyId, category, price_naira: priceNaira }, true, `kd-pub-${propertyId}`);
};

export const trackKeyDirectEnquirySubmitted = (propertyId: string, advertiserType: string) => {
  trackEvent('keydirect', 'property_enquiry_submitted', { property_id: propertyId, advertiser_type: advertiserType }, true);
};

export const trackKeyDirectViewingRequested = (propertyId: string, date: string) => {
  trackEvent('keydirect', 'viewing_requested', { property_id: propertyId, preferred_date: date }, true);
};

export const trackKeyDirectFeaturedPurchased = (propertyId: string, amountNaira: number) => {
  trackEvent('keydirect', 'featured_listing_purchased', { property_id: propertyId, value: amountNaira, currency: 'NGN' }, true, `kd-feat-${propertyId}`);
};

// C. TalentDock Conversions
export const trackTalentDockServicePublished = (serviceId: string, category: string, basePriceUSD: number) => {
  trackEvent('talentdock', 'service_published', { service_id: serviceId, category, price_usd: basePriceUSD }, true, `td-srv-${serviceId}`);
};

export const trackTalentDockProposalSubmitted = (jobId: string, proposalId: string) => {
  trackEvent('talentdock', 'project_proposal_submitted', { job_id: jobId, proposal_id: proposalId }, true, `td-prop-${proposalId}`);
};

export const trackTalentDockOrderCreated = (orderId: string, gigTitle: string, priceUSD: number) => {
  trackEvent('talentdock', 'order_created', { order_id: orderId, gig_title: gigTitle, value: priceUSD, currency: 'USD' }, true, `td-ord-${orderId}`);
};

export const trackTalentDockOrderCompleted = (orderId: string, revenueUSD: number) => {
  trackEvent('talentdock', 'order_completed', { order_id: orderId, value: revenueUSD, currency: 'USD' }, true, `td-done-${orderId}`);
};

// D. GIGCONNECT Conversions
export const trackGigConnectJobSaved = (jobId: string, jobTitle: string) => {
  trackEvent('gigconnect', 'job_saved', { job_id: jobId, title: jobTitle });
};

export const trackGigConnectApplicationPrepared = (jobId: string, cvVersion: string) => {
  trackEvent('gigconnect', 'application_prepared', { job_id: jobId, cv_version: cvVersion });
};

export const trackGigConnectApplicationSubmitted = (jobId: string, company: string) => {
  trackEvent('gigconnect', 'application_submitted_confirmed', { job_id: jobId, company }, true, `gc-sub-${jobId}`);
};

export const trackGigConnectInterviewRecorded = (jobId: string, stage: string) => {
  trackEvent('gigconnect', 'interview_recorded', { job_id: jobId, stage }, true);
};

export const trackGigConnectSubscriptionStarted = (tier: string, priceUSD: number) => {
  trackEvent('gigconnect', 'subscription_started', { tier, value: priceUSD, currency: 'USD' }, true, `gc-sub-${tier}-${Date.now()}`);
};
