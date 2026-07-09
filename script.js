/* =====================================================
   BIRTHDAY WEBSITE — MAIN SCRIPT
   Version 5: + Environment Engine (Wind + Light Foundations)
===================================================== */

'use strict';

/* -----------------------------------------------------
   1. CONFIG — Personalize the celebration here
----------------------------------------------------- */
const CONFIG = {
  name: 'Beautiful',
  subtitle: "Today the world gets a little brighter — because it's your day. 🎂",
  particleCount: 22,

  card: {
    message:
      "Wishing you a day filled with warm light, soft laughter, and every " +
      "little thing that makes you smile. May this new year of your life " +
      "be as radiant and wonderful as you are.",
    signature: 'With all my love 💛',
  },

  cake: {
    candleCount: 5,
    wishPrompt: 'Close your eyes and make a wish… then tap again to blow out the candles.',
    wishGrantedMessage: "Wish sent — here's to a beautiful year ahead! 🎉",
  },

  // Version 5 — Environment System (wind + light)
  environment: {
    startMode: 'day', // 'day' | 'night' — which lighting state the site boots into.
                       // A visible Day/Night button lands in a future version and will
                       // call toggleLightMode(), already defined below, with no changes here.
  },

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

  giftRow: document.getElementById('giftRow'),
  confettiLayer: document.getElementById('confettiLayer'),

  birthdayCake: document.getElementById('birthdayCake'),
  cakeCandles: document.getElementById('cakeCandles'),
  cakeMessage: document.getElementById('cakeMessage'),
  cakeStatusHint: document.getElementById('cakeStatusHint'),
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
----------------------------------------------------- */
const CONFETTI_COLORS = ['#ff8fab', '#f5c66b', '#b98be0', '#c9e4ff', '#ffc2d1'];

function triggerConfetti(originXPercent = 50) {
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion || !dom.confettiLayer) return;

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < CONFIG.confettiPiecesPerBurst; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';

    const color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    const left = Math.min(100, Math.max(0, originXPercent + (Math.random() * 40 - 20)));
    const duration = Math.random() * 1.5 + 2;
    const delay = Math.random() * 0.3;
    const drift = Math.random() * 160 - 80;
    const spin = Math.random() * 720 - 360;
    const size = Math.random() * 4 + 6;

    piece.style.left = `${left}%`;
    piece.style.background = color;
    piece.style.width = `${size}px`;
    piece.style.height = `${size * 1.6}px`;
    piece.style.animationDuration = `${duration}s`;
    piece.style.animationDelay = `${delay}s`;
    piece.style.setProperty('--confetti-drift', `${drift}px`);
    piece.style.setProperty('--confetti-spin', `${spin}deg`);

    const totalLifetime = (duration + delay) * 1000 + 100;
    window.setTimeout(() => piece.remove(), totalLifetime);

    fragment.appendChild(piece);
  }

  dom.confettiLayer.appendChild(fragment);
}

/* -----------------------------------------------------
   8. GIFT BOXES — Open Interaction
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
        const rect = gift.getBoundingClientRect();
        const originXPercent = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
        triggerConfetti(originXPercent);
      }
    }

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
   9. CAKE & CANDLES — Rendering + Interaction
----------------------------------------------------- */
const CANDLE_COLORS = ['#ff8fab', '#f5c66b', '#b98be0', '#ffb997'];

function renderCakeCandles() {
  if (!dom.cakeCandles) return;

  dom.cakeCandles.innerHTML = '';

  const count = Math.max(1, CONFIG.cake.candleCount);
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const candle = document.createElement('span');
    candle.className = 'candle';

    const color = CANDLE_COLORS[i % CANDLE_COLORS.length];
    const scale = i % 3 === 1 ? 1.15 : i % 3 === 2 ? 0.9 : 1;

    candle.style.setProperty('--candle-color', color);
    candle.style.setProperty('--candle-scale', String(scale));

    candle.innerHTML =
      '<span class="candle__flame"></span>' +
      '<span class="candle__wick"></span>' +
      '<span class="candle__stick"></span>';

    fragment.appendChild(candle);
  }

  dom.cakeCandles.appendChild(fragment);
}

function initCake() {
  const cake = dom.birthdayCake;
  if (!cake) return;

  renderCakeCandles();

  let isLit = false;
  let hasWished = false;

  function refreshCakeState() {
    if (isLit) {
      cake.setAttribute('aria-pressed', 'true');
      cake.setAttribute(
        'aria-label',
        'Birthday cake, candles lit. Press to blow them out and make your wish come true.'
      );
      if (dom.cakeMessage) dom.cakeMessage.textContent = CONFIG.cake.wishPrompt;
      if (dom.cakeStatusHint) dom.cakeStatusHint.textContent = 'tap again to blow out the candles';
    } else {
      cake.setAttribute('aria-pressed', 'false');
      cake.setAttribute(
        'aria-label',
        hasWished
          ? 'Birthday cake, candles blown out. Press to light them again and make another wish.'
          : 'Birthday cake, candles unlit. Press to light them and make a wish.'
      );
      if (dom.cakeMessage) {
        dom.cakeMessage.textContent = hasWished ? CONFIG.cake.wishGrantedMessage : '';
      }
      if (dom.cakeStatusHint) {
        dom.cakeStatusHint.textContent = hasWished
          ? 'tap to light them again'
          : 'tap the cake to light the candles';
      }
    }
  }

  function handleCakeActivate() {
    if (!isLit) {
      isLit = true;
      cake.classList.add('is-lit');
      refreshCakeState();
      return;
    }

    isLit = false;
    hasWished = true;
    cake.classList.remove('is-lit');
    cake.classList.add('is-puffing');

    window.setTimeout(() => {
      cake.classList.remove('is-puffing');
    }, 500);

    refreshCakeState();

    const rect = cake.getBoundingClientRect();
    const originXPercent = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
    triggerConfetti(originXPercent);
  }

  cake.addEventListener('click', handleCakeActivate);

  cake.addEventListener('keydown', (event) => {
    const isActivationKey = event.key === 'Enter' || event.key === ' ';
    if (isActivationKey) {
      event.preventDefault();
      handleCakeActivate();
    }
  });

  refreshCakeState();
}

/* -----------------------------------------------------
   10. ENVIRONMENT SYSTEM — Wind + Light (Foundation)
   -----------------------------------------------------
   Shared "ambient state" for the whole site, exposed as
   CSS custom properties on <html> so any element in the
   stylesheet can react to one consistent wind direction/
   strength and lighting mode instead of animating on its
   own separate loop.

   This version is deliberately mostly invisible — it's
   the plumbing, laid down first so the next versions
   (illustrated sky, swaying garden, fireflies, butterflies,
   day/night toggle, cake lighting) all read from the same
   source instead of each reinventing its own motion/color
   logic. The one visible tie-in today is the existing
   floating decorations (@keyframes floatDrift in style.css),
   which now sway with this shared wind.
----------------------------------------------------- */

// --- Wind ---
const WIND_CONFIG = {
  updateIntervalMs: 120, // ~8 updates/sec — smooth enough for slow ambient sway,
                          // far cheaper than a 60fps loop for something this subtle
  baseAngleDeg: -6,       // gentle constant "prevailing" lean
  swayDeg: 14,            // how far the angle wanders around that base
  strengthMin: 0.25,
  strengthMax: 0.85,
};

let windElapsedStart = null;

/**
 * Combines a few slow sine waves with mismatched periods/phases into one
 * signal. A single sine would visibly "loop" on a short, predictable
 * cycle; summing several avoids that mechanical feel without needing a
 * full noise/Perlin implementation.
 */
function computeWindState(elapsedSeconds) {
  const wave =
    Math.sin(elapsedSeconds * 0.10) * 0.5 +
    Math.sin(elapsedSeconds * 0.037 + 1.3) * 0.3 +
    Math.sin(elapsedSeconds * 0.081 + 4.1) * 0.2; // settles roughly within -1..1

  const angle = WIND_CONFIG.baseAngleDeg + wave * WIND_CONFIG.swayDeg;

  const strengthWave = (Math.sin(elapsedSeconds * 0.06 + 2.2) + 1) / 2; // 0..1
  const strength =
    WIND_CONFIG.strengthMin + strengthWave * (WIND_CONFIG.strengthMax - WIND_CONFIG.strengthMin);

  return { angle, strength };
}

function initWindSystem() {
  const root = document.documentElement;
  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion) {
    // Set once, then stop — a gentle fixed lean rather than a perfectly
    // static 0, so reduced-motion visitors still see a natural-looking
    // (just unanimated) scene rather than everything snapping upright.
    root.style.setProperty('--wind-angle', `${WIND_CONFIG.baseAngleDeg}deg`);
    root.style.setProperty('--wind-strength', '0.3');
    return;
  }

  windElapsedStart = performance.now();

  function tick() {
    const elapsedSeconds = (performance.now() - windElapsedStart) / 1000;
    const { angle, strength } = computeWindState(elapsedSeconds);

    root.style.setProperty('--wind-angle', `${angle.toFixed(2)}deg`);
    root.style.setProperty('--wind-strength', strength.toFixed(3));
  }

  tick(); // apply an initial value immediately, rather than waiting for the first interval
  window.setInterval(tick, WIND_CONFIG.updateIntervalMs);
}

// --- Light ---
const LIGHT_PRESETS = {
  day: {
    sunColor: '#fff1d0',
    ambientColor: 'rgba(255, 233, 184, 0.35)',
    shadowColor: 'rgba(120, 90, 60, 0.22)',
  },
  // Not visually connected to anything yet — there's no sky or moon to
  // show it off. Defined now so the future Day/Night button, illustrated
  // sky, and glowing night-flowers can read these variables the day
  // they're built, with zero changes needed in this function.
  night: {
    sunColor: '#b9c4e8',
    ambientColor: 'rgba(90, 100, 160, 0.35)',
    shadowColor: 'rgba(20, 20, 45, 0.4)',
  },
};

let currentLightMode = 'day';

function applyLightMode(mode) {
  const root = document.documentElement;
  const preset = LIGHT_PRESETS[mode] || LIGHT_PRESETS.day;

  root.style.setProperty('--light-progress', mode === 'night' ? '1' : '0');
  root.style.setProperty('--sun-color', preset.sunColor);
  root.style.setProperty('--ambient-color', preset.ambientColor);
  root.style.setProperty('--shadow-color', preset.shadowColor);

  currentLightMode = mode;
}

// Exposed now so a future Day/Night button can call this directly —
// no changes to this file will be needed when that button is added.
function toggleLightMode() {
  applyLightMode(currentLightMode === 'day' ? 'night' : 'day');
}

function initLightSystem() {
  applyLightMode(CONFIG.environment.startMode);
}

function initEnvironmentSystem() {
  initWindSystem();
  initLightSystem();
}

/* -----------------------------------------------------
   11. EVENT LISTENERS
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
   12. INIT — Runs once DOM is ready
----------------------------------------------------- */
function init() {
  applyPersonalization();
  initParticles();
  bindEvents();
  initBirthdayCard();
  initGiftBoxes();
  initCake();
  initEnvironmentSystem(); // Version 5
}

document.addEventListener('DOMContentLoaded', init);
