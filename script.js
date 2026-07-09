/* =====================================================
   BIRTHDAY WEBSITE — MAIN SCRIPT
   Version 2: + Interactive Birthday Card
===================================================== */

'use strict';

/* -----------------------------------------------------
   1. CONFIG — Personalize the celebration here
   Organized per-feature so it stays easy to scan as more
   interactive objects (gifts, cake, gallery...) are added.
----------------------------------------------------- */
const CONFIG = {
  name: 'Beautiful',
  subtitle: "Today the world gets a little brighter — because it's your day. 🎂",
  particleCount: 22, // scales down automatically on small screens, see initParticles()

  card: {
    message:
      "Wishing you a day filled with warm light, soft laughter, and every " +
      "little thing that makes you smile. May this new year of your life " +
      "be as radiant and wonderful as you are.",
    signature: 'With all my love 💛',
  },
};

/* -----------------------------------------------------
   2. DOM REFERENCES
----------------------------------------------------- */
const dom = {
  landing: document.getElementById('landing'),
  experience: document.getElementById('experience'),
  startBtn: document.getElementById('startBtn'),
  nameEl: document.getElementById('birthdayName'),
  subtitleEl: document.getElementById('birthdaySubtitle'),
  particlesContainer: document.getElementById('particles'),

  // Version 2 — Birthday Card
  experienceNameEl: document.getElementById('experienceName'),
  greetingCard: document.getElementById('greetingCard'),
  cardNameEl: document.getElementById('cardName'),
  cardMessageEl: document.getElementById('cardMessage'),
  cardSignatureEl: document.getElementById('cardSignature'),
  closeCardBtn: document.getElementById('closeCardBtn'),
  cardStatusHint: document.getElementById('cardStatusHint'),
};

/* -----------------------------------------------------
   3. PERSONALIZATION
   Applies CONFIG values into the DOM on load.
----------------------------------------------------- */
function applyPersonalization() {
  if (dom.nameEl) dom.nameEl.textContent = CONFIG.name;
  if (dom.subtitleEl) dom.subtitleEl.textContent = CONFIG.subtitle;

  // Version 2 — Birthday Card personalization
  if (dom.experienceNameEl) dom.experienceNameEl.textContent = CONFIG.name;
  if (dom.cardNameEl) dom.cardNameEl.textContent = CONFIG.name;
  if (dom.cardMessageEl) dom.cardMessageEl.textContent = CONFIG.card.message;
  if (dom.cardSignatureEl) dom.cardSignatureEl.textContent = CONFIG.card.signature;
}

/* -----------------------------------------------------
   4. FLOATING PARTICLES
   Lightweight CSS-driven particles injected via JS.
   Uses randomized size/position/duration for organic feel.
   Automatically reduces count on small screens for performance,
   and skips entirely if the user prefers reduced motion.
----------------------------------------------------- */
function initParticles() {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion || !dom.particlesContainer) return;

  const isSmallScreen = window.innerWidth < 480;
  const count = isSmallScreen
    ? Math.round(CONFIG.particleCount * 0.5)
    : CONFIG.particleCount;

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('span');
    particle.className = 'particle';

    const size = Math.random() * 6 + 3;
    const left = Math.random() * 100;
    const duration = Math.random() * 10 + 10;
    const delay = Math.random() * 12;
    const drift = Math.random() * 80 - 40;

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${left}%`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;
    particle.style.setProperty('--drift', `${drift}px`);

    fragment.appendChild(particle);
  }

  dom.particlesContainer.appendChild(fragment);
}

/* -----------------------------------------------------
   5. START CELEBRATION TRANSITION
   Smoothly transitions from landing screen to the
   interactive experience screen without a page reload.
----------------------------------------------------- */
function startCelebration() {
  if (!dom.landing || !dom.experience) return;

  dom.landing.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  dom.landing.style.opacity = '0';
  dom.landing.style.transform = 'scale(0.98)';

  window.setTimeout(() => {
    dom.landing.classList.add('is-hidden');
    dom.experience.classList.add('is-active');
    dom.experience.setAttribute('aria-hidden', 'false');

    dom.experience.setAttribute('tabindex', '-1');
    dom.experience.focus({ preventScroll: true });

    console.log('🎉 Celebration started!');
  }, 600);
}

/* -----------------------------------------------------
   6. BIRTHDAY CARD — Open/Close Interaction
   Self-contained module: owns its own DOM state and event
   listeners. Every future interactive object (gift, cake,
   flower...) will follow this same "initXxx()" pattern so
   features never tangle with one another.

   All motion is CSS-driven (see style.css §9); this function
   only ever toggles a single ".is-open" class plus the ARIA
   attributes that describe it.
----------------------------------------------------- */
function initBirthdayCard() {
  const card = dom.greetingCard;
  const closeBtn = dom.closeCardBtn;
  if (!card) return;

  function setCardOpen(isOpen) {
    card.classList.toggle('is-open', isOpen);

    // aria-pressed models this as a toggle button (open/closed state),
    // rather than aria-expanded, since the message is already present
    // in the accessibility tree in both states — nothing is being
    // shown/hidden from assistive tech, only animated for sighted users.
    card.setAttribute('aria-pressed', String(isOpen));
    card.setAttribute(
      'aria-label',
      isOpen
        ? 'Birthday card, open. Press the close button to close it.'
        : 'Birthday card, closed. Press to open and read your message.'
    );

    if (dom.cardStatusHint) {
      dom.cardStatusHint.textContent = isOpen
        ? 'tap the ✕ to close the card'
        : 'tap the card to open it';
    }

    // Only let the close button take keyboard focus once it's visible/usable
    if (closeBtn) {
      if (isOpen) {
        closeBtn.removeAttribute('tabindex');
      } else {
        closeBtn.setAttribute('tabindex', '-1');
      }
    }
  }

  // Clicking/tapping the card only ever OPENS it.
  card.addEventListener('click', () => {
    if (!card.classList.contains('is-open')) {
      setCardOpen(true);
    }
  });

  // Keyboard: Enter / Space opens it, same rule as the click above
  card.addEventListener('keydown', (event) => {
    const isActivationKey = event.key === 'Enter' || event.key === ' ';
    if (isActivationKey && !card.classList.contains('is-open')) {
      event.preventDefault(); // stop the page from scrolling on Space
      setCardOpen(true);
    }
  });

  // Closing is handled ONLY by the dedicated close button, so tapping
  // the message text or signature never accidentally closes the card.
  if (closeBtn) {
    closeBtn.addEventListener('click', (event) => {
      event.stopPropagation(); // don't let this bubble up and re-open
      setCardOpen(false);
    });
  }

  // Ensure everything starts in a clean, synchronized closed state
  setCardOpen(false);
}

/* -----------------------------------------------------
   7. EVENT LISTENERS
   Page-level / global events only. Feature-specific
   interactions live inside their own initXxx() function.
----------------------------------------------------- */
function bindEvents() {
  if (dom.startBtn) {
    dom.startBtn.addEventListener('click', startCelebration);

    dom.startBtn.addEventListener('keyup', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        startCelebration();
      }
    });
  }
}

/* -----------------------------------------------------
   8. INIT — Runs once DOM is ready
----------------------------------------------------- */
function init() {
  applyPersonalization();
  initParticles();
  bindEvents();
  initBirthdayCard(); // Version 2
}

document.addEventListener('DOMContentLoaded', init);
