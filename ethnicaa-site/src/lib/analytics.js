/**
 * GA4 Custom Event Tracking Utilities
 */

export const GA_TRACKING_ID = "G-XF0XGW58DX";

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({ action, category, label, value }) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track Product View
export const trackProductView = (product) => {
  event({
    action: "view_item",
    category: "ecommerce",
    label: product.name || product.catalog,
    value: product.price || 0,
  });
};

// Track WhatsApp Click (Conversion)
export const trackWhatsAppClick = (label = "General") => {
  event({
    action: "whatsapp_click",
    category: "conversion",
    label: label,
    value: 1,
  });
};

// Track Enquire (Conversion)
export const trackEnquiry = (productName) => {
  event({
    action: "generate_lead",
    category: "conversion",
    label: productName,
    value: 1,
  });
};
