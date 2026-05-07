/**
 * Same-origin API when frontend is served by Express.
 * Override before other scripts if needed: window.APP_API_BASE = 'http://localhost:3000';
 */
(function () {
  if (typeof window.APP_API_BASE === "undefined") {
    window.APP_API_BASE = "";
  }
})();
