/**
 * src/utils.js
 * Utility module for pure functions, decoupling logic from implementation details.
 */

const Utils = {
  /**
   * Generates a unique identifier.
   * Uses crypto.randomUUID if available, falls back to timestamp + random string.
   */
  generateId() {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
    return `id-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  },

  /**
   * Sanitizes input strings against XSS.
   * Removes tag-like characters and 'javascript:' schemes.
   */
  sanitizeString(str) {
    if (typeof str !== "string") return "";
    return str
      .replace(/[<>]/g, "")
      .replace(/javascript:/gi, "")
      .trim();
  }
};

// Expose globally for no-build environment
window.Utils = Utils;
