// scripts/utils.js
// A tiny helper module with one or two small functions

// make page look pretty
export function formatDate(dateStr) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateStr).toLocaleDateString(undefined, options);
}

// clear storage
export function clearLocalBookings() {
  localStorage.removeItem('bookings');
}
