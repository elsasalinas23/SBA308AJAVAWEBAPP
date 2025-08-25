// scripts/utils.js
// A tiny helper module with one or two small functions

// format a date string to something nicer
export function formatDate(dateStr) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString(undefined, options);
}

// clear storage (could be used by multiple parts of your app)
export function clearLocalBookings() {
  localStorage.removeItem('bookings');
}
