//  get a random cat image URL from The Cat API.

export async function getRandomCatImageUrl() {
  const resp = await fetch('https://api.thecatapi.com/v1/images/search');
  if (!resp.ok) {
    throw new Error('Network error fetching cat image');
  }
  // This endpoint returns an ARRAY
  const data = await resp.json();
  return (data[0] && data[0].url) || '';
}
