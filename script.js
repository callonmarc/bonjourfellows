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
// Shop page: interactive placeholder cards
// =========================================
const shirtCards = document.querySelectorAll('.shirt-placeholder');

shirtCards.forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    const rotateY = x * 5;
    const rotateX = -y * 4;
    card.style.transform = `translateY(-6px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
  });

  card.addEventListener('pointerleave', () => {
    card.style.transform = '';
  });
});

// =========================================
// Community wall: Supabase-backed posts
// =========================================
const wallForm = document.getElementById('wallForm');
const noteWall = document.getElementById('noteWall');
const messageInput = document.getElementById('message');
const messageCounter = document.getElementById('messageCounter');

const supabaseClient = window.supabase?.createClient(
  'https://rprfplqbocrzfjdmazfs.supabase.co',
  'sb_publishable_oBaM2lmb4-hmfgSczpQ05g_ru8_GAJU'
);

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function getRelativeTime(createdAt) {
  const created = new Date(createdAt);
  const now = new Date();
  const diffSeconds = Math.max(0, Math.floor((now.getTime() - created.getTime()) / 1000));

  if (diffSeconds < 45) return 'just now';
  if (diffSeconds < 3600) {
    const mins = Math.floor(diffSeconds / 60);
    return `${mins} min${mins === 1 ? '' : 's'} ago`;
  }
  if (diffSeconds < 86400) {
    const hours = Math.floor(diffSeconds / 3600);
    return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  }
  const days = Math.floor(diffSeconds / 86400);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

function createNoteMarkup(note, index) {
  const tilt = `${(Math.random() * 7 - 3.5).toFixed(2)}deg`;
  const yOffset = `${Math.round(Math.random() * 8)}px`;
  const tone = String((index % 4) + 1);
  const delay = `${(index * 0.04).toFixed(2)}s`;
  const author = note.name ? note.name : 'anonymous';
  const city = note.location ? ` · ${note.location}` : '';
  const timestamp = note.created_at ? getRelativeTime(note.created_at) : 'just now';

  return `
    <article class="note note--tone-${tone}" style="--tilt:${tilt};--offset:${yOffset};--enter-delay:${delay}">
      <p>${escapeHtml(note.message)}</p>
      <p class="note-footer">— ${escapeHtml(author)}${escapeHtml(city)}</p>
      <p class="note-time">${escapeHtml(timestamp)}</p>
      <p class="note-stamp">I'm a bonjour fellow</p>
      <span class="note-france-stamp" aria-hidden="true"></span>
    </article>
  `;
}

function renderNotes(notes) {
  if (!noteWall) return;
  noteWall.innerHTML = notes.map((note, index) => createNoteMarkup(note, index)).join('');
}

async function loadNotes() {
  if (!supabaseClient || !noteWall) return;

  const { data, error } = await supabaseClient
    .from('messages')
    .select('id, message, name, location, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch wall messages:', error);
    return;
  }

  renderNotes(data || []);
}

if (messageInput && messageCounter) {
  const syncCounter = () => {
    messageCounter.textContent = `${messageInput.value.length} / ${messageInput.maxLength}`;
  };

  messageInput.addEventListener('input', syncCounter);
  syncCounter();
}

if (noteWall) {
  if (!supabaseClient) {
    console.error('Supabase client failed to initialize on wall page.');
  }
  loadNotes();
}

if (wallForm && noteWall && supabaseClient) {
  wallForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(wallForm);
    const message = String(formData.get('message') || '').trim();
    const name = String(formData.get('name') || '').trim();
    const location = String(formData.get('location') || '').trim();

    if (!message) return;

    const payload = {
      message,
      name: name || 'anonymous',
      location: location || null
    };

    const { error } = await supabaseClient.from('messages').insert(payload);
    if (error) {
      console.error('Failed to insert wall message:', error);
      return;
    }

    wallForm.reset();
    if (messageCounter) {
      messageCounter.textContent = `0 / ${messageInput?.maxLength || 280}`;
    }
    await loadNotes();
  });
}
