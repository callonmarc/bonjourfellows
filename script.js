// =========================================
// Shared mobile navigation behavior
// =========================================
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

// =========================================
// Home page first-visit overlay
// =========================================
const entryOverlay = document.getElementById('entryOverlay');
const entryOverlayButton = document.getElementById('entryOverlayButton');
const onHomePage = document.body.classList.contains('home-page');

function closeEntryOverlay() {
  if (!entryOverlay) return;
  entryOverlay.classList.add('is-closing');
  document.body.classList.remove('pre-entry');
  window.setTimeout(() => {
    entryOverlay.classList.add('is-hidden');
    entryOverlay.classList.remove('is-closing');
    entryOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('overlay-open');
  }, 500);
}

if (onHomePage && entryOverlay && entryOverlayButton) {
  entryOverlay.classList.remove('is-hidden');
  entryOverlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add('overlay-open', 'pre-entry');

  entryOverlayButton.addEventListener('click', closeEntryOverlay);
}

// =========================================
// Community wall: seed messages + local storage
// =========================================
const wallForm = document.getElementById('wallForm');
const noteWall = document.getElementById('noteWall');
const WALL_KEY = 'bonjour-fellow-wall-posts';

const defaultNotes = [
  {
    message: 'I am building with patience and pressure.',
    name: 'K.',
    location: 'Atlanta'
  },
  {
    message: 'The vision gets clearer every rep.',
    name: 'Mila',
    location: 'Decatur'
  },
  {
    message: 'No gatekeeping. We all rise when we share.',
    name: 'fellow',
    location: 'Paris'
  }
];

function getStoredNotes() {
  try {
    const stored = localStorage.getItem(WALL_KEY);
    if (!stored) return defaultNotes;
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) && parsed.length ? parsed : defaultNotes;
  } catch {
    return defaultNotes;
  }
}

function saveNotes(notes) {
  localStorage.setItem(WALL_KEY, JSON.stringify(notes));
}

function createNoteMarkup(note, index) {
  const tiltValues = ['-3deg', '-1deg', '2deg', '3deg', '-2deg'];
  const tilt = tiltValues[index % tiltValues.length];
  const author = note.name ? note.name : 'Anonymous';
  const city = note.location ? ` · ${note.location}` : '';

  return `
    <article class="note" style="--tilt:${tilt}">
      <p>${note.message}</p>
      <p class="note-footer">— ${author}${city}</p>
    </article>
  `;
}

function renderNotes(notes) {
  if (!noteWall) return;
  noteWall.innerHTML = notes.map((note, index) => createNoteMarkup(note, index)).join('');
}

if (noteWall) {
  const notes = getStoredNotes();
  renderNotes(notes);
}

if (wallForm && noteWall) {
  wallForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(wallForm);
    const message = String(formData.get('message') || '').trim();
    const name = String(formData.get('name') || '').trim();
    const location = String(formData.get('location') || '').trim();

    if (!message) return;

    const notes = getStoredNotes();
    notes.unshift({ message, name, location });
    saveNotes(notes.slice(0, 24));
    renderNotes(notes.slice(0, 24));
    wallForm.reset();
  });
}
