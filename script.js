/* =====================================================
   BIRTHDAY WEBSITE — MAIN SCRIPT
   Version 3: + Gift Boxes + Reusable Confetti Utility
===================================================== */

'use strict';

/* -----------------------------------------------------
   1. CONFIG — Personalize the celebration here
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

  // Version 3 — Gift Boxes. Order matches the boxes left-to-right in HTML;
  // add/remove objects here to add/remove boxes without touching markup logic.
  confettiPiecesPerBurst: 40,
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

  experienceNameEl: document.getElementById('experienceName'),
  greetingCard: document.getElementById('greetingCard'),
  cardNameEl: document.getElementById('cardName'),
  cardMessageEl: document.getElementById('cardMessage'),
  cardSignatureEl: document.getElementById('cardSignature'),
  closeCardBtn: document.getElementById('closeCardBtn'),
  cardStatusHint: document.getElementById('cardStatusHint'),

  // Version 3
  giftRow: document.getElementById('giftRow'),
  confettiLayer: document.getElementById('confettiLayer'),
};

/* -----------------------------------------------------
   3. PERSONALIZATION
----------------------------------------------------- */
function applyPersonalization() {
  if (dom.nameEl) dom.nameEl.textContent = CONFIG.name;
  if (dom.subtitleEl) dom.subtitleEl.textContent = CONFIG.subtitle;

  if (dom.experienceNameEl) dom.experienceNameEl.textContent = CONFIG.name;
  if (dom.cardNameEl) dom.cardNameEl.textContent = CONFIG.name;
  if (dom.cardMessageEl) dom.cardMessageEl.textContent = CONFIG.card.message;
  if (dom.cardSignatureEl) dom.cardSignatureEl.textContent = CONFIG.card.signature;
}

/* -----------------------------------------------------
   4. FLOATING PARTICLES
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
----------------------------------------------------- */
function initBirthdayCard() {
  const card = dom.greetingCard;
  const closeBtn = dom.closeCardBtn;
  if (!card) return;

  function setCardOpen(isOpen) {
    card.classList.toggle('is-open', isOpen);
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

    if (closeBtn) {
      if (isOpen) {
        closeBtn.removeAttribute('tabindex');
      } else {
        closeBtn.setAttribute('tabindex', '-1');
      }
    }
  }

  card.addEventListener('click', () => {
    if (!card.classList.contains('is-open')) {
      setCardOpen(true);
    }
  });

  card.addEventListener('keydown', (event) => {
    const isActivationKey = event.key === 'Enter' || event.key === ' ';
    if (isActivationKey && !card.classList.contains('is-open')) {
      event.preventDefault();
      setCardOpen(true);
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      setCardOpen(false);
    });
  }

  setCardOpen(false);
}

/* -----------------------------------------------------
   7. CONFETTI BURST — Reusable Celebration Utility
   -----------------------------------------------------
   Spawns short-lived colored rectangles that fall from
   near the top of the viewport. Every future "reveal"
   moment (cake lighting, final celebration screen, etc.)
   should call triggerConfetti() rather than reimplementing
   this — keeps the effect visually consistent and the
   codebase free of duplicate particle logic.

   Pieces remove themselves from the DOM once their fall
   animation ends, so bursts never accumulate in memory.
----------------------------------------------------- */
const CONFETTI_COLORS = ['#ff8fab', '#f5c66b', '#b98be0', '#c9e4ff', '#ffc2d1'];

function triggerConfetti(originXPercent = 50) {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  // Reduced-motion users still get the *event* (message reveal etc.),
  // just without the extra confetti animation layered on top.
  if (prefersReducedMotion || !dom.confettiLayer) return;

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < CONFIG.confettiPiecesPerBurst; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';

    const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    // Spread horizontally around the trigger point, clamped to stay on-screen
    const left = Math.min(100, Math.max(0, originXPercent + (Math.random() * 40 - 20)));
    const duration = Math.random() * 1.5 + 2; // 2s–3.5s fall time
    const delay = Math.random() * 0.3;
    const drift = Math.random() * 160 - 80; // -80px to 80px horizontal drift while falling
    const spin = Math.random() * 720 - 360; // varied rotation direction/amount
    const size = Math.random() * 4 + 6; // 6px–10px

    piece.style.left = `${left}%`;
    piece.style.background = color;
    piece.style.width = `${size}px`;
    piece.style.height = `${size * 1.6}px`;
    piece.style.animationDuration = `${duration}s`;
    piece.style.animationDelay = `${delay}s`;
    piece.style.setProperty('--confetti-drift', `${drift}px`);
    piece.style.setProperty('--confetti-spin', `${spin}deg`);

    // Self-cleanup: remove the piece once its own fall animation finishes,
    // so the confetti layer never accumulates stale nodes across bursts.
    const totalLifetime = (duration + delay) * 1000 + 100;
    window.setTimeout(() => piece.remove(), totalLifetime);

    fragment.appendChild(piece);
  }

  dom.confettiLayer.appendChild(fragment);
}

/* -----------------------------------------------------
   8. GIFT BOXES — Open Interaction
   -----------------------------------------------------
   Each .gift element is independent and self-toggling,
   following the same open-only-via-tap, ARIA-synced
   pattern as the birthday card. Opening a gift also
   fires a confetti burst centered on that gift's
   position, since a first-time surprise reveal deserves
   a little extra delight.
----------------------------------------------------- */
function initGiftBoxes() {
  const gifts = document.querySelectorAll('.gift');
  if (!gifts.length) return;

  gifts.forEach((gift) => {
    const giftId = gift.dataset.giftId || '';

    function setGiftOpen(isOpen) {
      gift.classList.toggle('is-open', isOpen);
      gift.setAttribute('aria-pressed', String(isOpen));
      gift.setAttribute(
        'aria-label',
        isOpen
          ? `Gift box ${giftId}, open.`
          : `Gift box ${giftId}, closed. Press to open.`
      );

      if (isOpen) {
        // Fire confetti centered on this specific gift's horizontal position,
        // so the burst feels attached to the object the user just opened.
        const rect = gift.getBoundingClientRect();
        const originXPercent = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
        triggerConfetti(originXPercent);
      }
    }

    // Tapping only ever opens — once opened, a gift stays open (it's a keepsake reveal,
    // not a toggle like the card, so there's no close button to manage here).
    gift.addEventListener('click', () => {
      if (!gift.classList.contains('is-open')) {
        setGiftOpen(true);
      }
    });

    gift.addEventListener('keydown', (event) => {
      const isActivationKey = event.key === 'Enter' || event.key === ' ';
      if (isActivationKey && !gift.classList.contains('is-open')) {
        event.preventDefault();
        setGiftOpen(true);
      }
    });
  });
}

/* -----------------------------------------------------
   9. EVENT LISTENERS
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
   10. INIT — Runs once DOM is ready
----------------------------------------------------- */
function init() {
  applyPersonalization();
  initParticles();
  bindEvents();
  initBirthdayCard();
  initGiftBoxes(); // Version 3
}

document.addEventListener('DOMContentLoaded', init);
