// scripts/utils.mjs
// Small helper functions the whole app can use.

/* ========================
   1) PRETTY DATE FORMATTER
   ======================== */
// Turn "2025-08-26" into "August 26, 2025"
export function formatDate(dateStr) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString(undefined, options);
}

/* ==============================
   2) CLEAR JUST THE BOOKINGS KEY
   ============================== */
// Remove the saved bookings from localStorage
export function clearLocalBookings() {
  localStorage.removeItem('bookings');
}

/* ==================================
   3) GENERIC JSON SAVE / LOAD HELPERS
   ================================== */
// Save ANY value to localStorage under a key (it will be JSON-encoded)
export function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('localStorage save failed:', e);
  }
}

// Read ANY value back from localStorage. If nothing there, give fallback.
export function loadJSON(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

// Remove a specific key (generic version)
export function clearKey(key) {
  localStorage.removeItem(key);
}
