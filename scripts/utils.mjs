

// Turn "2025-08-26" into "August 26, 2025"
export function formatDate(dateStr) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString(undefined, options);
}


   // CLEAR JUST THE BOOKINGS KEY
export function clearLocalBookings() {
  localStorage.removeItem('bookings');
}


  // GENERIC JSON SAVE / LOAD HELPERS
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
