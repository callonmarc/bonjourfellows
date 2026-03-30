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

  const words = ['bonjour', 'bonjour', 'bonjour', 'bonjour', 'bonjour', 'blowup', 'bonjour', 'bonjour'];
  const placements = Array.from({ length: 12 }, (_, index) => ({
    word: words[index % words.length],
    x: Math.round(6 + Math.random() * 84),
    y: Math.round(8 + Math.random() * 80),
    size: `${Math.round(1.8 + Math.random() * 4.8)}rem`,
    duration: `${16 + Math.round(Math.random() * 11)}s`,
    delay: `-${Math.round(Math.random() * 13)}s`,
    tilt: `${-14 + Math.round(Math.random() * 28)}deg`,
    skew: `${-14 + Math.round(Math.random() * 22)}deg`,
    blur: `${(Math.random() * 1.8).toFixed(2)}px`,
    alpha: (0.24 + Math.random() * 0.45).toFixed(2),
    flicker: `${(1.8 + Math.random() * 1.6).toFixed(2)}s`
  }));

  placements.forEach((item) => {
    const word = document.createElement('span');
    word.className = 'floating-bonjour';
    word.textContent = item.word;
    word.style.left = `${item.x}%`;
    word.style.top = `${item.y}%`;
    word.style.fontSize = item.size;
    word.style.setProperty('--duration', item.duration);
    word.style.setProperty('--delay', item.delay);
    word.style.setProperty('--tilt', item.tilt);
    word.style.setProperty('--skew', item.skew);
    word.style.setProperty('--blur', item.blur);
    word.style.setProperty('--alpha', item.alpha);
    word.style.setProperty('--flicker', item.flicker);
    floatingLayer.appendChild(word);
  });

  document.body.appendChild(floatingLayer);
}

mountFloatingBonjour();

function mountGritOverlays() {
  if (document.querySelector('.grit-overlay--dark')) return;

  const layers = ['dark', 'scratches', 'grain'];
  layers.forEach((layer) => {
    const overlay = document.createElement('div');
    overlay.className = `grit-overlay grit-overlay--${layer}`;
    overlay.setAttribute('aria-hidden', 'true');
    document.body.appendChild(overlay);
  });
}

mountGritOverlays();

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
