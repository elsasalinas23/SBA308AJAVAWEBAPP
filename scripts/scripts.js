// scripts/scripts.js
// We import our API helper from database.js .
import { getRandomCatImageUrl } from './database.js';

/* ========= 1) GET DOM ELEMENTS ========= */
const clockEl   = document.getElementById('clock');
const selectEl  = document.getElementById('service'); // your pet chooser
const photoEl   = document.getElementById('pet-photo');
const dateEl    = document.getElementById('date');
const timeEl    = document.getElementById('time');
const bookBtn   = document.getElementById('book-btn');
const tableBody = document.getElementById('bookings-body');

/* ========= 2) CLOCK (updates every second) ========= */
function startClock() {
  function tick() {
    const now = new Date();
    clockEl.textContent = now.toLocaleString();  // toLocaleString shows nice human format with date + time
  }
  tick();                 // show immediately
  setInterval(tick, 1000); // then update every second
}
startClock();

/* ========= 3) LOAD EXISTING BOOKINGS FROM LOCALSTORAGE =========
   We'll keep an array of bookings in the browser.
   Each booking: { pet, date, time, createdAt }
*/
let bookings = [];
try {
  bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
} catch {
  bookings = [];
}
renderBookings();

/* ========= 4) WHEN PET CHANGES, SHOW A RANDOM CAT PHOTO =========
   This is our "user interaction + fetch + async/await" requirement.
*/
selectEl.addEventListener('change', async () => {
  const petName = selectEl.value;
  if (!petName) {
    photoEl.removeAttribute('src');
    photoEl.alt = 'Your pet will appear here';
    return;
  }

  // Show a tiny "loading" state
  photoEl.alt = 'Loading a cute photo...';
  photoEl.removeAttribute('src');

  try {
    const url = await getRandomCatImageUrl(); // <-- async/await + fetch
    photoEl.src = url;
    photoEl.alt = petName;
  } catch (err) {
    console.error(err);
    photoEl.alt = 'Could not load photo (check internet)';
  }
});

/* ========= 5) BOOK BUTTON: VALIDATE + SAVE + RENDER ========= */
bookBtn.addEventListener('click', (e) => {
  e.preventDefault(); // keep the page from reloading

  const pet  = selectEl.value;
  const date = dateEl.value;
  const time = timeEl.value;

  // Simple checks for the user (friendly messages)
  if (!pet)  return alert('Please pick a pet from the list.');
  if (!date) return alert('Please pick a date.');
  if (!time) return alert('Please pick a time.');

  const newBooking = { pet, date, time, createdAt: Date.now() };
  bookings.push(newBooking);

  // Save to localStorage so it stays after refresh
  localStorage.setItem('bookings', JSON.stringify(bookings));

  // Re-render the table
  renderBookings();

  // Nice little confirmation
  alert('🎉 Booking saved!');
});

/* ========= 6) RENDER THE BOOKINGS TABLE ========= */
function renderBookings() {
  tableBody.innerHTML = ''; // clear old rows

  bookings.forEach((b, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${b.pet}</td>
      <td>${b.date}</td>
      <td>${b.time}</td>
    `;
    tableBody.appendChild(tr);
  });
}
