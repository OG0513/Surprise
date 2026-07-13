/* =====================================================
   BIRTHDAY WEBSITE — MAIN SCRIPT
   Version 10: Re-zoned garden depth (flower-hiding fix)
   + Night Mode (glow flowers, moon/stars, bonus fireflies)
   triggered by Start Celebration + small day/night toggle
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

  environment: {
    startMode: 'day', // always boots in day; Start Celebration switches to night
  },

  world: {
    butterflyCount: 2,
    fireflyCount: 10,       // day baseline — present from the start, unchanged from V6
    fireflyNightBonus: 20,  // extra fireflies spawned once, the first time night activates (10+20≈3x)
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

  world: document.getElementById('world'),
  gardenStrip: document.getElementById('gardenStrip'),
  creatureLayer: document.getElementById('creatureLayer'),

  celestialToggle: document.getElementById('celestialToggle'),
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
   -----------------------------------------------------
   Version 10: also switches the environment to night,
   fired at the same moment the landing card starts fading
   — so the sky/flowers are already transforming while the
   experience screen reveals, rather than the two feeling
   like two separate, disconnected events.
----------------------------------------------------- */
function startCelebration() {
  if (!dom.landing || !dom.experience) return;

  applyLightMode('night'); // Version 10

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
   10. ENVIRONMENT SYSTEM — Wind + Light
   -----------------------------------------------------
   applyLightMode() toggles a single `is-night` class on
   <body>, which drives every smooth night-mode transition
   in style.css (sky, moon/sun, stars, flower glow,
   grass/cloud darkening). The CSS custom properties below
   are kept for backward compatibility with anything still
   reading them.
----------------------------------------------------- */
const WIND_CONFIG = {
  updateIntervalMs: 120,
  baseAngleDeg: -6,
  swayDeg: 14,
  strengthMin: 0.25,
  strengthMax: 0.85,
};

let windElapsedStart = null;

function computeWindState(elapsedSeconds) {
  const wave =
    Math.sin(elapsedSeconds * 0.10) * 0.5 +
    Math.sin(elapsedSeconds * 0.037 + 1.3) * 0.3 +
    Math.sin(elapsedSeconds * 0.081 + 4.1) * 0.2;

  const angle = WIND_CONFIG.baseAngleDeg + wave * WIND_CONFIG.swayDeg;

  const strengthWave = (Math.sin(elapsedSeconds * 0.06 + 2.2) + 1) / 2;
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

  tick();
  window.setInterval(tick, WIND_CONFIG.updateIntervalMs);
}

const LIGHT_PRESETS = {
  day: {
    sunColor: '#fff1d0',
    ambientColor: 'rgba(255, 233, 184, 0.35)',
    shadowColor: 'rgba(120, 90, 60, 0.22)',
  },
  night: {
    sunColor: '#b9c4e8',
    ambientColor: 'rgba(90, 100, 160, 0.35)',
    shadowColor: 'rgba(20, 20, 45, 0.4)',
  },
};

let currentLightMode = 'day';
let hasSpawnedNightFireflies = false;

function applyLightMode(mode) {
  const root = document.documentElement;
  const preset = LIGHT_PRESETS[mode] || LIGHT_PRESETS.day;

  root.style.setProperty('--light-progress', mode === 'night' ? '1' : '0');
  root.style.setProperty('--sun-color', preset.sunColor);
  root.style.setProperty('--ambient-color', preset.ambientColor);
  root.style.setProperty('--shadow-color', preset.shadowColor);

  document.body.classList.toggle('is-night', mode === 'night');

  currentLightMode = mode;

  if (mode === 'night' && !hasSpawnedNightFireflies) {
    ensureNightFireflies();
    hasSpawnedNightFireflies = true;
  }

  updateCelestialToggleLabel();
}

// Exposed so the small celestial toggle button (and anything else) can
// call this directly.
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
   11. CELESTIAL TOGGLE — the small "way back to day"
----------------------------------------------------- */
function updateCelestialToggleLabel() {
  if (!dom.celestialToggle) return;
  dom.celestialToggle.setAttribute(
    'aria-label',
    currentLightMode === 'night' ? 'Switch to day view' : 'Switch to night view'
  );
}

function initCelestialToggle() {
  const btn = dom.celestialToggle;
  if (!btn) return;

  btn.addEventListener('click', () => {
    toggleLightMode();
  });

  updateCelestialToggleLabel();
}

/* -----------------------------------------------------
   12. PROCEDURAL FLOWER FIELD
   -----------------------------------------------------
   Species now carry a glowColor (used only at night — see
   .garden-flower__glow in style.css). FLOWER_LAYER_ZONES
   matches the re-authored terrain paths in index.html so
   every flower sits safely above its own layer's ground
   and safely below the next-nearer layer's ground.
----------------------------------------------------- */

const FLOWER_SPECIES = [
  {
    id: 'wildflower', symbol: 'flower-wildflower', baseScale: 1.0, baseSway: 0.7,
    glowColor: '#ffb0d9',
    palette: [
      { petal: '#ff8fab', center: '#f5c66b' },
      { petal: '#d9c9f5', center: '#fff8f2' },
      { petal: '#f5c66b', center: '#ff8fab' },
    ],
  },
  {
    id: 'rose', symbol: 'flower-rose', baseScale: 1.05, baseSway: 0.45,
    glowColor: '#ff4f8b',
    palette: [
      { petal: '#e0577a' },
      { petal: '#ff8fab' },
      { petal: '#c9436b' },
      { petal: '#f5b8c8' },
    ],
  },
  {
    id: 'tulip', symbol: 'flower-tulip', baseScale: 1.1, baseSway: 0.5,
    glowColor: '#c68bff',
    palette: [
      { petal: '#ff8fab', center: '#c9436b' },
      { petal: '#f5c66b', center: '#e0a53a' },
      { petal: '#b98be0', center: '#8a5cc4' },
      { petal: '#ff7a6f', center: '#c9483f' },
    ],
  },
  {
    id: 'daisy', symbol: 'flower-daisy', baseScale: 0.85, baseSway: 0.8,
    glowColor: '#fff2b8',
    palette: [
      { petal: '#fffdf7', center: '#f5c66b' },
      { petal: '#fdf0e6', center: '#f0a93a' },
    ],
  },
  {
    id: 'sunflower', symbol: 'flower-sunflower', baseScale: 1.4, baseSway: 0.35,
    glowColor: '#ffcf5c',
    palette: [
      { petal: '#f5c66b', center: '#7a5230' },
      { petal: '#f0b93a', center: '#6b431f' },
    ],
  },
  {
    id: 'bluebell', symbol: 'flower-bluebell', baseScale: 0.8, baseSway: 0.85,
    glowColor: '#6fa8ff',
    palette: [
      { petal: '#7ea0e0' },
      { petal: '#8f7fd6' },
      { petal: '#6a8fd1' },
    ],
  },
  {
    id: 'poppy', symbol: 'flower-poppy', baseScale: 1.1, baseSway: 0.55,
    glowColor: '#ff6b4a',
    palette: [
      { petal: '#e0473f', center: '#3a2a1e' },
      { petal: '#ef7a3c', center: '#3a2a1e' },
    ],
  },
  {
    id: 'lavender', symbol: 'flower-lavender', baseScale: 0.9, baseSway: 0.9,
    glowColor: '#c9a3ff',
    palette: [
      { petal: '#9b87d1' },
      { petal: '#b98be0' },
      { petal: '#8069c2' },
    ],
  },
 {
    id: 'babysBreath', symbol: 'flower-babys-breath', baseScale: 0.65, baseSway: 1.0,
    glowColor: '#7ff0d4',
    palette: [
      { petal: '#ffffff' },
      { petal: '#fdf0f5' },
    ],
  },
  // Version 12 — ported from the uploaded canvas bouquet, redrawn as
  // reusable SVG symbols (see flower-lily / flower-hyacinth in index.html)
  {
    id: 'lily', symbol: 'flower-lily', baseScale: 1.15, baseSway: 0.5,
    glowColor: '#ff8a6b',
    palette: [
      { petal: '#ff6b4a', center: '#f5c66b' },
      { petal: '#ff9466', center: '#e0a53a' },
      { petal: '#ffd166', center: '#c96b3f' },
    ],
  },
  {
    id: 'hyacinth', symbol: 'flower-hyacinth', baseScale: 0.75, baseSway: 0.9,
    glowColor: '#9b87ff',
    palette: [
      { petal: '#8f7fd6' },
      { petal: '#6a8fd1' },
      { petal: '#b98be0' },
    ],
  },
];

const FLOWER_LAYER_ZONES = {
  1: { base: 17, jitter: 5 },
  2: { base: 40, jitter: 4 },
  3: { base: 63, jitter: 4 },
};

const FLOWER_FIELD_CONFIG = {
  layerSplit: { 1: 8, 2: 42, 3: 20 },
  clusterCount: 7,
  clusterSpreadPercent: 9,
  loneFlowerChance: 0.15,
  smallScreenMultiplier: 0.65,
};

function jitterGaussianish(spread) {
  const sum = Math.random() + Math.random() + Math.random() - 1.5;
  return (sum / 1.5) * spread;
}

function buildClusterCenters(count) {
  const centers = [];
  for (let i = 0; i < count; i++) {
    centers.push(Math.random() * 100);
  }
  return centers;
}

function pickFlowerLeftPercent(clusterCenters) {
  const useCluster = Math.random() > FLOWER_FIELD_CONFIG.loneFlowerChance;
  if (!useCluster || clusterCenters.length === 0) {
    return Math.random() * 100;
  }
  const center = clusterCenters[Math.floor(Math.random() * clusterCenters.length)];
  return center + jitterGaussianish(FLOWER_FIELD_CONFIG.clusterSpreadPercent);
}

function createFlowerInstance(layerNumber, clusterCenters) {
  const species = FLOWER_SPECIES[Math.floor(Math.random() * FLOWER_SPECIES.length)];
  const colorway = species.palette[Math.floor(Math.random() * species.palette.length)];

  let leftPercent = pickFlowerLeftPercent(clusterCenters);
  const minLeft = layerNumber === 1 ? -8 : 1;
  const maxLeft = layerNumber === 1 ? 108 : 99;
  leftPercent = Math.min(maxLeft, Math.max(minLeft, leftPercent));

  const layerScale = layerNumber === 1 ? 1.5 : layerNumber === 3 ? 0.55 : 1;
  const scale = species.baseScale * layerScale * (0.75 + Math.random() * 0.5);

  const sizeFactor = Math.min(1.4, Math.max(0.6, scale));
  const swayMult = (species.baseSway / sizeFactor) * (0.85 + Math.random() * 0.3);

  const zone = FLOWER_LAYER_ZONES[layerNumber] || FLOWER_LAYER_ZONES[2];
  const bottomPercent = zone.base + (Math.random() * zone.jitter * 2 - zone.jitter);

  const bloomRotation = (Math.random() * 30 - 15).toFixed(1);
  const stemLean = (Math.random() * 14 - 7).toFixed(1);

  const transitionDelay = (Math.random() * 0.5).toFixed(2);
  const transitionDuration = (0.25 + Math.random() * 0.3).toFixed(2);

  const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  el.setAttribute('viewBox', '0 0 40 100');
  el.setAttribute('focusable', 'false');
  el.classList.add('garden-flower');

  el.style.left = `${leftPercent.toFixed(2)}%`;
  el.style.bottom = `${bottomPercent.toFixed(2)}%`;
  el.style.setProperty('--flower-scale', scale.toFixed(2));
  el.style.setProperty('--sway-mult', swayMult.toFixed(2));
  el.style.setProperty('--bloom-rotation', `${bloomRotation}deg`);
  el.style.setProperty('--stem-lean', `${stemLean}deg`);
  el.style.setProperty('--petal-color', colorway.petal);
  if (colorway.center) {
    el.style.setProperty('--center-color', colorway.center);
  }
  el.style.setProperty('--glow-color', species.glowColor);
  el.style.setProperty('--glow-pulse-duration', `${(2.4 + Math.random() * 2).toFixed(2)}s`);
  el.style.setProperty('--glow-pulse-delay', `${(Math.random() * 3).toFixed(2)}s`);
  el.style.transitionDelay = `${transitionDelay}s`;
  el.style.transitionDuration = `${transitionDuration}s`;

  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', `#${species.symbol}`);
  use.setAttribute('width', '40');
  use.setAttribute('height', '100');
  el.appendChild(use);

  return el;
}

function generateFlowerField() {
  const isSmallScreen = window.innerWidth < 480;
  const multiplier = isSmallScreen ? FLOWER_FIELD_CONFIG.smallScreenMultiplier : 1;
  const clusterCenters = buildClusterCenters(FLOWER_FIELD_CONFIG.clusterCount);

  Object.entries(FLOWER_FIELD_CONFIG.layerSplit).forEach(([layerNumber, baseCount]) => {
    const container = document.querySelector(`.garden-layer--${layerNumber} .garden-layer__contents`);
    if (!container) return;

    const count = Math.round(baseCount * multiplier);
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
      fragment.appendChild(createFlowerInstance(Number(layerNumber), clusterCenters));
    }

    container.appendChild(fragment);
  });
}

/* -----------------------------------------------------
   13. PROCEDURAL GRASS FIELD
   -----------------------------------------------------
   Each layer's grass-strip now uses its OWN viewBox height
   (100/200/300/400, matching the 24/48/72/96% CSS heights
   in style.css — an exact 1:2:3:4 ratio both ways). Since
   the shared pattern tile is always 100 "pattern units"
   tall regardless of viewBox, a taller viewBox makes that
   same tile occupy a smaller fraction of it — which, paired
   with the proportionally taller CSS box, keeps individual
   blades roughly the same apparent pixel size across all 4
   layers instead of farther grass stretching taller just
   because its strip is bigger.
----------------------------------------------------- */

const GRASS_CONFIG = {
  layers: [
    { layer: 1, bandCount: 14, viewBoxHeight: 100 },
    { layer: 2, bandCount: 12, viewBoxHeight: 200 },
    { layer: 3, bandCount: 10, viewBoxHeight: 300 },
    { layer: 4, bandCount: 8,  viewBoxHeight: 400 },
  ],
  maxStaggerSeconds: 0.6,
  smallScreenBandMultiplier: 0.7,
};

function createGrassStrip(bandCount, viewBoxHeight) {
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.classList.add('grass-strip');
  svg.setAttribute('viewBox', `0 0 1000 ${viewBoxHeight}`);
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.setAttribute('focusable', 'false');

  const bandWidth = 1000 / bandCount;

  for (let i = 0; i < bandCount; i++) {
    const band = document.createElementNS(svgNS, 'rect');
    band.setAttribute('x', (i * bandWidth).toFixed(2));
    band.setAttribute('y', '0');
    band.setAttribute('width', bandWidth.toFixed(2));
    band.setAttribute('height', String(viewBoxHeight));
    band.classList.add('grass-band');

    const delay = (i / bandCount) * GRASS_CONFIG.maxStaggerSeconds;
    band.style.setProperty('--grass-band-delay', `${delay.toFixed(3)}s`);

    svg.appendChild(band);
  }

  return svg;
}

function generateGrass() {
  const isSmallScreen = window.innerWidth < 480;

  GRASS_CONFIG.layers.forEach(({ layer, bandCount, viewBoxHeight }) => {
    const container = document.querySelector(`.garden-layer--${layer} .garden-layer__contents`);
    if (!container) return;

    const adjustedCount = isSmallScreen
      ? Math.max(4, Math.round(bandCount * GRASS_CONFIG.smallScreenBandMultiplier))
      : bandCount;

    const strip = createGrassStrip(adjustedCount, viewBoxHeight);
    container.insertBefore(strip, container.firstChild);
  });
}

/* -----------------------------------------------------
   14. PROCEDURAL GARDEN PROPS
   -----------------------------------------------------
   Bushes, ferns, mushrooms, stones, logs — same reused-
   symbol / lightweight-<use> pattern as flowers and grass.
   PROP_LAYER_ZONES matches the same re-zoned terrain bands
   the flowers now use, so props also stay clear of the
   ground shapes.
----------------------------------------------------- */

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const PROP_SPECIES = {
  bush: {
    symbol: 'prop-bush', sways: true, swayMult: 0.5, viewBox: [0, 0, 80, 60],
    colorVars: () => ({
      '--bush-color': pick(['#5a9c46', '#4a8c3a', '#6bab52']),
      '--bush-accent': pick(['#7ec95e', '#8fd671']),
    }),
  },
  fern: {
    symbol: 'prop-fern', sways: true, swayMult: 0.85, viewBox: [0, 0, 60, 90],
    colorVars: () => ({ '--fern-color': pick(['#3f7a35', '#4a8c3a', '#356b2d']) }),
  },
  mushroom: {
    symbol: 'prop-mushroom', sways: false, viewBox: [0, 0, 30, 34],
    colorVars: () => ({ '--mushroom-cap': pick(['#d1524a', '#c96b3f', '#a9506f']) }),
  },
  stone: {
    symbol: 'prop-stone', sways: false, viewBox: [0, 0, 40, 24],
    colorVars: () => ({ '--stone-color': pick(['#9a9086', '#8a8f7e', '#a89a88']) }),
  },
  log: {
    symbol: 'prop-log', sways: false, viewBox: [0, 0, 90, 32],
    colorVars: () => ({
      '--log-color': pick(['#8a6141', '#7a5636']),
      '--log-end-color': pick(['#a9825c', '#96714f']),
    }),
  },
};

const PROP_LAYER_ZONES = {
  1: { base: 5, jitter: 3 },
  3: { base: 10, jitter: 5 },
  4: { base: 8, jitter: 5 },
};

const PROP_FIELD_CONFIG = {
  layerProps: {
    1: [{ species: 'stone', count: 3 }, { species: 'log', count: 1 }],
    3: [{ species: 'bush', count: 6 }, { species: 'stone', count: 5 }, { species: 'mushroom', count: 4 }],
    4: [{ species: 'fern', count: 8 }, { species: 'bush', count: 4 }],
  },
  smallScreenMultiplier: 0.6,
};

function createPropInstance(speciesKey, layerNumber) {
  const species = PROP_SPECIES[speciesKey];
  const [, , vbWidth, vbHeight] = species.viewBox;

  const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  el.setAttribute('viewBox', species.viewBox.join(' '));
  el.setAttribute('focusable', 'false');
  el.classList.add('garden-prop', `garden-prop--${speciesKey}`);
  if (species.sways) el.classList.add('garden-prop--sways');

  const leftPercent = Math.random() * 100;
  const zone = PROP_LAYER_ZONES[layerNumber] || { base: 5, jitter: 3 };
  const bottomPercent = Math.max(0.5, zone.base + (Math.random() * zone.jitter * 2 - zone.jitter));
  const scale = 0.75 + Math.random() * 0.6;
  const rotation = species.sways ? 0 : (Math.random() * 8 - 4);

  el.style.left = `${leftPercent.toFixed(2)}%`;
  el.style.bottom = `${bottomPercent.toFixed(2)}%`;
  el.style.setProperty('--prop-scale', scale.toFixed(2));
  el.style.setProperty('--prop-rotation', `${rotation.toFixed(1)}deg`);

  if (species.sways) {
    const swayMult = species.swayMult * (0.85 + Math.random() * 0.3);
    el.style.setProperty('--prop-sway-mult', swayMult.toFixed(2));
    el.style.transitionDelay = `${(Math.random() * 0.4).toFixed(2)}s`;
  }

  const colorVars = species.colorVars();
  Object.entries(colorVars).forEach(([key, value]) => {
    el.style.setProperty(key, value);
  });

  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.setAttribute('href', `#${species.symbol}`);
  use.setAttribute('width', vbWidth);
  use.setAttribute('height', vbHeight);
  el.appendChild(use);

  return el;
}

function generateProps() {
  const isSmallScreen = window.innerWidth < 480;
  const multiplier = isSmallScreen ? PROP_FIELD_CONFIG.smallScreenMultiplier : 1;

  Object.entries(PROP_FIELD_CONFIG.layerProps).forEach(([layerNumber, speciesList]) => {
    const container = document.querySelector(`.garden-layer--${layerNumber} .garden-layer__contents`);
    if (!container) return;

    const fragment = document.createDocumentFragment();
    speciesList.forEach(({ species, count }) => {
      const adjustedCount = Math.max(1, Math.round(count * multiplier));
      for (let i = 0; i < adjustedCount; i++) {
        fragment.appendChild(createPropInstance(species, Number(layerNumber)));
      }
    });

    container.appendChild(fragment);
  });
}

/* -----------------------------------------------------
   15. ILLUSTRATED WORLD — Butterflies + Fireflies
   -----------------------------------------------------
   Butterflies unchanged from Version 6 — still no flower-
   seeking behavior (flagged honestly in the message above,
   still deferred). Fireflies now split into a shared
   spawnFireflies() helper so the day-mode baseline batch
   and the one-time night bonus batch never duplicate logic.
----------------------------------------------------- */

function getCreatureLayerBounds() {
  if (!dom.creatureLayer) return null;
  const rect = dom.creatureLayer.getBoundingClientRect();
  return { width: rect.width, height: rect.height };
}

const BUTTERFLY_WING_COLORS = ['#ff8fab', '#b98be0', '#f5c66b'];

function createButterflyElement(index) {
  const wrapper = document.createElement('div');
  wrapper.className = 'butterfly';
  wrapper.style.setProperty(
    '--wing-color',
    BUTTERFLY_WING_COLORS[index % BUTTERFLY_WING_COLORS.length]
  );
  wrapper.innerHTML =
    '<svg viewBox="-40 -30 80 60" focusable="false">' +
      '<g class="butterfly__wing butterfly__wing--left">' +
        '<path d="M -2,-2 C -22,-26 -40,-14 -34,4 C -28,20 -10,18 -2,6 Z" />' +
      '</g>' +
      '<g class="butterfly__wing butterfly__wing--right">' +
        '<path d="M 2,-2 C 22,-26 40,-14 34,4 C 28,20 10,18 2,6 Z" />' +
      '</g>' +
      '<ellipse class="butterfly__body" cx="0" cy="0" rx="2.4" ry="14" />' +
    '</svg>';
  return wrapper;
}

function flyButterflyToRandomPoint(el, prefersReducedMotion) {
  if (prefersReducedMotion) return;

  const bounds = getCreatureLayerBounds();
  if (!bounds) return;

  const targetX = Math.random() * Math.max(0, bounds.width - 40);
  const targetY = Math.random() * Math.max(0, bounds.height - 40) * 0.8;

  const prevX = parseFloat(el.dataset.x || targetX);
  const facingRight = targetX >= prevX;
  const duration = Math.random() * 3 + 3.5;

  el.style.transition = `transform ${duration}s cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
  el.style.transform = `translate(${targetX}px, ${targetY}px) scaleX(${facingRight ? 1 : -1})`;
  el.dataset.x = targetX;
  el.classList.remove('is-resting');

  const willRest = Math.random() < 0.4;
  const pauseDuration = willRest ? Math.random() * 2500 + 1500 : Math.random() * 900 + 300;

  window.setTimeout(() => {
    if (willRest) el.classList.add('is-resting');
    window.setTimeout(() => {
      flyButterflyToRandomPoint(el, prefersReducedMotion);
    }, pauseDuration);
  }, duration * 1000);
}

function initButterflies() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!dom.creatureLayer) return;

  for (let i = 0; i < CONFIG.world.butterflyCount; i++) {
    const el = createButterflyElement(i);
    dom.creatureLayer.appendChild(el);

    const bounds = getCreatureLayerBounds();
    if (bounds) {
      const startX = Math.random() * Math.max(0, bounds.width - 40);
      const startY = Math.random() * Math.max(0, bounds.height - 40) * 0.8;
      el.style.transform = `translate(${startX}px, ${startY}px)`;
      el.dataset.x = startX;
    }

    if (prefersReducedMotion) continue;

    window.setTimeout(() => {
      flyButterflyToRandomPoint(el, prefersReducedMotion);
    }, Math.random() * 3000);
  }
}

function createFireflyElement() {
  const el = document.createElement('span');
  el.className = 'firefly';

  const size = Math.random() * 3 + 4;
  const blinkDuration = Math.random() * 2 + 1.8;
  const blinkDelay = Math.random() * 3;

  el.style.setProperty('--firefly-size', `${size}px`);
  el.style.setProperty('--blink-duration', `${blinkDuration}s`);
  el.style.setProperty('--blink-delay', `${blinkDelay}s`);
  el.style.setProperty('--blink-min', (Math.random() * 0.2 + 0.15).toFixed(2));
  el.style.setProperty('--blink-max', (Math.random() * 0.15 + 0.85).toFixed(2));

  return el;
}

function scheduleFireflyMove(el, prefersReducedMotion) {
  if (prefersReducedMotion) return;

  const bounds = getCreatureLayerBounds();
  if (!bounds) return;

  const targetX = Math.random() * bounds.width;
  const targetY = Math.random() * bounds.height;
  const willTeleport = Math.random() < 0.2;
  const moveDuration = Math.random() * 4 + 3;
  const pauseDuration = Math.random() * 2500 + 800;

  if (willTeleport) {
    el.style.animationPlayState = 'paused';
    el.style.opacity = '0';

    window.setTimeout(() => {
      el.style.setProperty('--move-duration', '0.01s');
      el.style.transform = `translate(${targetX}px, ${targetY}px)`;
      el.style.opacity = '1';

      window.setTimeout(() => {
        el.style.animationPlayState = 'running';
      }, 450);
    }, 450);
  } else {
    el.style.setProperty('--move-duration', `${moveDuration}s`);
    el.style.transform = `translate(${targetX}px, ${targetY}px)`;
  }

  const totalDelay = (willTeleport ? 900 : moveDuration * 1000) + pauseDuration;
  window.setTimeout(() => scheduleFireflyMove(el, prefersReducedMotion), totalDelay);
}

/**
 * Spawns `count` fireflies into the creature layer. Shared by both the
 * initial day-mode population and the one-time night bonus batch, so
 * the two never drift into duplicated logic.
 */
function spawnFireflies(count) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!dom.creatureLayer) return;

  for (let i = 0; i < count; i++) {
    const el = createFireflyElement();
    dom.creatureLayer.appendChild(el);

    const bounds = getCreatureLayerBounds();
    if (bounds) {
      el.style.transform = `translate(${Math.random() * bounds.width}px, ${Math.random() * bounds.height}px)`;
    }

    if (prefersReducedMotion) continue;

    window.setTimeout(() => scheduleFireflyMove(el, prefersReducedMotion), Math.random() * 4000);
  }
}

function initFireflies() {
  const isSmallScreen = window.innerWidth < 480;
  const count = isSmallScreen
    ? Math.round(CONFIG.world.fireflyCount * 0.6)
    : CONFIG.world.fireflyCount;

  spawnFireflies(count);
}

/**
 * Called once, the first time night mode activates (see applyLightMode
 * in §10 — fired either by Start Celebration or the celestial toggle).
 * Adds the "fireflies increase ~3x at night" bonus batch additively, on
 * top of whatever's already flying — existing fireflies never restart.
 */
function ensureNightFireflies() {
  const isSmallScreen = window.innerWidth < 480;
  const bonus = isSmallScreen
    ? Math.round(CONFIG.world.fireflyNightBonus * 0.6)
    : CONFIG.world.fireflyNightBonus;

  spawnFireflies(bonus);
}

function initIllustratedWorld() {
  initButterflies();
  initFireflies();
}

/* -----------------------------------------------------
   16. EVENT LISTENERS
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
   17. INIT — Runs once DOM is ready
----------------------------------------------------- */
function init() {
  applyPersonalization();
  initParticles();
  bindEvents();
  initBirthdayCard();
  initGiftBoxes();
  initCake();
  initEnvironmentSystem();
  initCelestialToggle();  // Version 10
  generateGrass();
  generateProps();
  generateFlowerField();
  initIllustratedWorld();
}

document.addEventListener('DOMContentLoaded', init);
