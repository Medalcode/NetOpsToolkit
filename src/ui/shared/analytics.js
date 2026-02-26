/**
 * @fileoverview Google Analytics 4 integration module
 * Provides privacy-conscious event tracking for user interactions
 * @module analytics
 */

/**
 * Configuration object for Google Analytics
 * @type {Object}
 */
const config = {
  // Replace with your actual GA4 Measurement ID
  // Get this from: https://analytics.google.com/analytics/web/
  measurementId: "G-XXXXXXXXXX", // TODO: Replace with actual ID

  // Only track in production (not localhost)
  enabledDomains: ["luxury-dango-9d7cff.netlify.app"], // Add custom domain when configured

  // Privacy settings
  anonymizeIp: true,
  cookieFlags: "SameSite=None; Secure",
};

/**
 * Check if analytics should be enabled for current environment
 * @returns {boolean} True if analytics should be active
 */
function isAnalyticsEnabled() {
  // Don't track on localhost or file protocol
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1" ||
    window.location.protocol === "file:"
  ) {
    return false;
  }

  // Check if current domain is in enabled list
  const currentDomain = window.location.hostname;
  return config.enabledDomains.some(domain => currentDomain.includes(domain));
}

/**
 * Initialize Google Analytics
 * This function is called automatically when the module loads
 */
function initializeAnalytics() {
  if (!isAnalyticsEnabled()) {
    console.log("[Analytics] Disabled for current environment");
    return;
  }

  // Check if gtag is already loaded
  if (typeof window.gtag !== "function") {
    console.warn("[Analytics] gtag is not loaded. Make sure GA4 script is in HTML.");
    return;
  }

  // Configure GA4
  window.gtag("config", config.measurementId, {
    anonymize_ip: config.anonymizeIp,
    cookie_flags: config.cookieFlags,
  });

  console.log("[Analytics] Initialized successfully");
}

/**
 * Track a custom event
 * @param {string} eventName - Name of the event
 * @param {Object} [eventParams={}] - Additional parameters for the event
 */
export function trackEvent(eventName, eventParams = {}) {
  if (!isAnalyticsEnabled()) {
    console.log(`[Analytics] Event "${eventName}" not tracked (disabled)`);
    return;
  }

  if (typeof window.gtag !== "function") {
    console.warn(`[Analytics] Cannot track event "${eventName}" - gtag not available`);
    return;
  }

  window.gtag("event", eventName, eventParams);
  console.log(`[Analytics] Event tracked: ${eventName}`, eventParams);
}

/**
 * Track VLSM calculation event
 * @param {number} subnetCount - Number of subnets calculated
 * @param {string} baseNetwork - Base network address
 * @param {number} totalHosts - Total hosts requested
 */
export function trackCalculation(subnetCount, baseNetwork, totalHosts) {
  trackEvent("vlsm_calculation", {
    subnet_count: subnetCount,
    base_network: baseNetwork,
    total_hosts: totalHosts,
  });
}

/**
 * Track export event
 * @param {string} format - Export format (csv, json, txt)
 * @param {number} subnetCount - Number of subnets exported
 */
export function trackExport(format, subnetCount) {
  trackEvent("export_data", {
    export_format: format,
    subnet_count: subnetCount,
  });
}

/**
 * Track copy to clipboard event
 * @param {string} type - Type of copy ('subnet' or 'all')
 * @param {number} [subnetIndex] - Index of subnet copied (if type is 'subnet')
 */
export function trackCopy(type, subnetIndex = null) {
  const params = { copy_type: type };
  if (subnetIndex !== null) {
    params.subnet_index = subnetIndex;
  }
  trackEvent("copy_to_clipboard", params);
}

/**
 * Track validation error
 * @param {string} errorType - Type of validation error
 * @param {string} field - Field that failed validation
 */
export function trackValidationError(errorType, field) {
  trackEvent("validation_error", {
    error_type: errorType,
    field_name: field,
  });
}

/**
 * Track page view (called automatically by GA4, but can be used for SPAs)
 * @param {string} [pagePath] - Custom page path
 */
export function trackPageView(pagePath = null) {
  if (!isAnalyticsEnabled()) {
    return;
  }

  if (typeof window.gtag !== "function") {
    return;
  }

  const params = {};
  if (pagePath) {
    params.page_path = pagePath;
  }

  window.gtag("event", "page_view", params);
}

/**
 * Track a custom metric or user property
 * @param {Object} properties - User properties to set
 */
export function setUserProperties(properties) {
  if (!isAnalyticsEnabled()) {
    return;
  }

  if (typeof window.gtag !== "function") {
    return;
  }

  window.gtag("set", "user_properties", properties);
}

// Initialize analytics when module loads
initializeAnalytics();

// Export configuration for testing/debugging
export const analyticsConfig = {
  isEnabled: isAnalyticsEnabled(),
  measurementId: config.measurementId,
};
