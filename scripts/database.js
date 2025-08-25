// scripts/database.js
// Tiny wrapper around The Cat API to get a random cat image.
// No API key required for this endpoint.

export async function getRandomCatImageUrl() {
  const resp = await fetch('https://api.thecatapi.com/v1/images/BkIEhN3pG');
  if (!resp.ok) throw new Error('Network error fetching cat image');
  const data = await resp.json(); // example: [{ url: "https://..." }]
  return (data[0] && data[0].url) || '';
}
