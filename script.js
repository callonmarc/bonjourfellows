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
  entryOverlayButton?.setAttribute('disabled', 'true');
  entryOverlay.classList.add('is-closing');
  document.body.classList.remove('pre-entry');
  window.setTimeout(() => {
    entryOverlay.classList.add('is-hidden');
    entryOverlay.classList.remove('is-closing');
    entryOverlay.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('overlay-open');
  }, 760);
}

if (onHomePage && entryOverlay && entryOverlayButton) {
  entryOverlay.classList.remove('is-hidden');
  entryOverlay.setAttribute('aria-hidden', 'false');
  document.body.classList.add('overlay-open', 'pre-entry');

  entryOverlayButton.addEventListener('click', closeEntryOverlay);
}

// =========================================
// Shared floating "bonjour" background accents
// =========================================
function mountFloatingBonjour() {
  if (document.querySelector('.floating-bonjour-layer')) return;

  const floatingLayer = document.createElement('div');
  floatingLayer.className = 'floating-bonjour-layer';
  floatingLayer.setAttribute('aria-hidden', 'true');

  const placements = [
    { x: 8, y: 16, size: 'clamp(2.5rem, 8vw, 5rem)', duration: '20s', delay: '-2s', tilt: '-8deg' },
    { x: 68, y: 14, size: 'clamp(2rem, 6.5vw, 4rem)', duration: '17s', delay: '-8s', tilt: '5deg' },
    { x: 22, y: 48, size: 'clamp(2.8rem, 7.5vw, 4.7rem)', duration: '22s', delay: '-3s', tilt: '-4deg' },
    { x: 74, y: 42, size: 'clamp(2.2rem, 7vw, 4.3rem)', duration: '19s', delay: '-10s', tilt: '7deg' },
    { x: 12, y: 74, size: 'clamp(2rem, 6vw, 3.8rem)', duration: '18s', delay: '-5s', tilt: '-6deg' },
    { x: 62, y: 78, size: 'clamp(2.4rem, 8vw, 4.8rem)', duration: '23s', delay: '-12s', tilt: '4deg' }
  ];

  placements.forEach((item) => {
    const word = document.createElement('span');
    word.className = 'floating-bonjour';
    word.textContent = 'bonjour';
    word.style.left = `${item.x}%`;
    word.style.top = `${item.y}%`;
    word.style.fontSize = item.size;
    word.style.setProperty('--duration', item.duration);
    word.style.setProperty('--delay', item.delay);
    word.style.setProperty('--tilt', item.tilt);
    floatingLayer.appendChild(word);
  });

  document.body.appendChild(floatingLayer);
}

mountFloatingBonjour();

// =========================================
// Community wall: local storage-backed posts
// =========================================
const wallForm = document.getElementById('wallForm');
const noteWall = document.getElementById('noteWall');
const WALL_KEY = 'bonjour-fellow-wall-posts';

function getStoredNotes() {
  try {
    const stored = localStorage.getItem(WALL_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
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
