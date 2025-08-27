// scripts/scripts.js
// Main page logic: clock, cat photo, bookings table, contact form

/* ========= 0) IMPORT OUR HELPERS ========= */
// API helper to fetch a random cat image URL
import { getRandomCatImageUrl } from './database.mjs';
// Utility helpers (format dates, clear storage, save/load JSON)
import {
  formatDate,
  clearLocalBookings,
  saveJSON,
  loadJSON,
  clearKey
} from './utils.mjs';

/* ========= 1) GET DOM ELEMENTS ========= */
// Clock
const clockEl   = document.getElementById('clock');

// Booking / photo area
const selectEl  = document.getElementById('service');   // the pet dropdown
const photoEl   = document.getElementById('pet-photo'); // <img> where photo goes
const dateEl    = document.getElementById('date');      // date input
const timeEl    = document.getElementById('time');      // time input
const bookBtn   = document.getElementById('book-btn');  // "Book it" button
const tableBody = document.getElementById('bookings-body'); // tbody for rows
const clearBtn  = document.getElementById('clear-bookings'); // clear bookings

// Contact form
const contactForm = document.getElementById('contact-form');
const nameInput   = document.getElementById('name');
const emailInput  = document.getElementById('email');
const clearContactBtn = document.getElementById('clear-contact');

/* ========= 2) CLOCK (updates every second) ========= */
function startClock() {
  function tick() {
    const now = new Date();
    clockEl.textContent = now.toLocaleString(); // nice local date+time
  }
  tick();                 // show immediately
  setInterval(tick, 1000); // then update every second
}
startClock();

/* ========= 3) LOAD EXISTING DATA FROM localStorage ========= */
// Bookings are an array in memory and in localStorage
let bookings = [];
try {
  bookings = loadJSON('bookings', []); // [] if nothing saved yet
} catch {
  bookings = [];
}
renderBookings(); // draw any existing rows right away

// Contact info: prefill the form if we have it
const savedContact = loadJSON('contact', null);
if (savedContact) {
  nameInput.value  = savedContact.name  || '';
  emailInput.value = savedContact.email || '';
}

/* ========= 4) WHEN PET CHANGES, SHOW A RANDOM CAT PHOTO =========
   This is our async/await + fetch requirement. */
selectEl.addEventListener('change', async () => {
  const petName = selectEl.value;
  // if user chose the placeholder/empty item, clear the photo and exit
  if (!petName) {
    photoEl.removeAttribute('src');
    photoEl.alt = 'Your pet will appear here';
    return;
  }
  // tiny "loading" hint
  photoEl.alt = 'Loading a cute photo...';
  photoEl.removeAttribute('src');

  try{

    const url = await getRandomCatImageUrl(); // fetch from Cat API
    if (url) {
      photoEl.src = url;
      photoEl.alt = petName;
    } else {
      photoEl.alt = 'No photo found right now.';
    }
  } catch (err) {
    console.error(err);
    photoEl.alt = 'Could not load photo (check internet)';
  }
});

/* ========= 5) BOOK BUTTON: VALIDATE + SAVE + RENDER ========= */
bookBtn.addEventListener('click', (e) => {
  e.preventDefault(); // keep the page from reloading

  const pet  = selectEl.value;
  const date = dateEl.value; // "YYYY-MM-DD"
  const time = timeEl.value; // "HH:MM"

  // Simple checks (friendly messages)
  if (!pet)  return alert('Please pick a pet from the list.');
  if (!date) return alert('Please pick a date.');
  if (!time) return alert('Please pick a time.');

  // Build a booking object
  const newBooking = { pet, date, time, createdAt: Date.now() };

  // Add to our in-memory array
  bookings.push(newBooking);

  // Save the WHOLE array back to localStorage so it survives refresh
  saveJSON('bookings', bookings);

  // Re-render the table
  renderBookings();

  // Little confirmation
  alert('✅ Booking saved!');
});

/* ========= 6) RENDER THE BOOKINGS TABLE ========= */
function renderBookings() {
  // Clear old rows
  tableBody.innerHTML = '';

  // Add a <tr> for each booking
  bookings.forEach((b, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${b.pet}</td>
      <td>${formatDate(b.date)}</td>
      <td>${b.time}</td>
    `;
    tableBody.appendChild(tr);
  });
}

/* ========= 7) CLEAR BOOKINGS BUTTON ========= */
clearBtn.addEventListener('click', () => {
  // 1) reset the array in memory
  bookings = [];
  // 2) remove from localStorage
  clearLocalBookings();
  // 3) update the table UI
  renderBookings();
  alert('All bookings cleared!');
});

/* ========= 8) CONTACT FORM: SAVE + PREFILL ========= */
contactForm.addEventListener('submit', (e) => {
  e.preventDefault(); // no page reload

  const name  = nameInput.value.trim();
  const email = emailInput.value.trim();

  // Because <form novalidate> is set, do a tiny check ourselves
  if (!name) return alert('Please enter your full name.');
  const emailOK = /^\S+@\S+\.\S+$/.test(email);
  if (!emailOK) return alert('Please enter a valid email (e.g., name@example.com).');

  // Save to localStorage under the key "contact"
  saveJSON('contact', { name, email, savedAt: Date.now() });

  alert('✅ Info saved! Your form will auto-fill next time.');
});

