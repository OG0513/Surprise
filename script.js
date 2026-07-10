/* =====================================================
   BIRTHDAY WEBSITE — MAIN SCRIPT
   Version 8: + Procedural Flower Field (9 species, ~70 flowers)
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
    startMode: 'day',
  },

  world: {
    butterflyCount: 2,
    fireflyCount: 10,
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

function applyLightMode(mode) {
  const root = document.documentElement;
  const preset = LIGHT_PRESETS[mode] || LIGHT_PRESETS.day;

  root.style.setProperty('--light-progress', mode === 'night' ? '1' : '0');
  root.style.setProperty('--sun-color', preset.sunColor);
  root.style.setProperty('--ambient-color', preset.ambientColor);
  root.style.setProperty('--shadow-color', preset.shadowColor);

  currentLightMode = mode;
}

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
   11. PROCEDURAL FLOWER FIELD (Version 8)
   -----------------------------------------------------
   Each species' actual petal/stem geometry lives ONCE in
   the <symbol> sprite sheet in index.html. Every flower
   instance created here is a lightweight <use> pointing
   back at one of those 9 symbols, styled per-instance via
   CSS custom properties — nothing about the shape itself
   is duplicated, only position/color/size/rotation/timing.

   Distribution uses a small number of randomly-placed
   "cluster centers," with each flower's position jittered
   around one of them (or, occasionally, placed completely
   independently as a "loner") — producing natural-looking
   dense patches and gaps rather than an even scatter.
----------------------------------------------------- */

const FLOWER_SPECIES = [
  {
    id: 'wildflower', symbol: 'flower-wildflower', baseScale: 1.0, baseSway: 0.7,
    palette: [
      { petal: '#ff8fab', center: '#f5c66b' },
      { petal: '#d9c9f5', center: '#fff8f2' },
      { petal: '#f5c66b', center: '#ff8fab' },
    ],
  },
  {
    id: 'rose', symbol: 'flower-rose', baseScale: 1.05, baseSway: 0.45,
    palette: [
      { petal: '#e0577a' },
      { petal: '#ff8fab' },
      { petal: '#c9436b' },
      { petal: '#f5b8c8' },
    ],
  },
  {
    id: 'tulip', symbol: 'flower-tulip', baseScale: 1.1, baseSway: 0.5,
    palette: [
      { petal: '#ff8fab', center: '#c9436b' },
      { petal: '#f5c66b', center: '#e0a53a' },
      { petal: '#b98be0', center: '#8a5cc4' },
      { petal: '#ff7a6f', center: '#c9483f' },
    ],
  },
  {
    id: 'daisy', symbol: 'flower-daisy', baseScale: 0.85, baseSway: 0.8,
    palette: [
      { petal: '#fffdf7', center: '#f5c66b' },
      { petal: '#fdf0e6', center: '#f0a93a' },
    ],
  },
  {
    id: 'sunflower', symbol: 'flower-sunflower', baseScale: 1.4, baseSway: 0.35,
    palette: [
      { petal: '#f5c66b', center: '#7a5230' },
      { petal: '#f0b93a', center: '#6b431f' },
    ],
  },
  {
    id: 'bluebell', symbol: 'flower-bluebell', baseScale: 0.8, baseSway: 0.85,
    palette: [
      { petal: '#7ea0e0' },
      { petal: '#8f7fd6' },
      { petal: '#6a8fd1' },
    ],
  },
  {
    id: 'poppy', symbol: 'flower-poppy', baseScale: 1.1, baseSway: 0.55,
    palette: [
      { petal: '#e0473f', center: '#3a2a1e' },
      { petal: '#ef7a3c', center: '#3a2a1e' },
    ],
  },
  {
    id: 'lavender', symbol: 'flower-lavender', baseScale: 0.9, baseSway: 0.9,
    palette: [
      { petal: '#9b87d1' },
      { petal: '#b98be0' },
      { petal: '#8069c2' },
    ],
  },
  {
    id: 'babysBreath', symbol: 'flower-babys-breath', baseScale: 0.65, baseSway: 1.0,
    palette: [
      { petal: '#ffffff' },
      { petal: '#fdf0f5' },
    ],
  },
];

const FLOWER_FIELD_CONFIG = {
  layerSplit: { 1: 8, 2: 42, 3: 20 }, // ~70 total — within the 60-100 brief, chosen for perf headroom
  clusterCount: 7,
  clusterSpreadPercent: 9,
  loneFlowerChance: 0.15,
  smallScreenMultiplier: 0.65,
};

function jitterGaussianish(spread) {
  // Sum of 3 uniforms approximates a bell curve (central limit theorem),
  // so positions cluster naturally around a center with soft falloff
  // instead of a hard-edged uniform blob.
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
    return Math.random() * 100; // an occasional "loner," scattered independently
  }
  const center = clusterCenters[Math.floor(Math.random() * clusterCenters.length)];
  return center + jitterGaussianish(FLOWER_FIELD_CONFIG.clusterSpreadPercent);
}

function createFlowerInstance(layerNumber, clusterCenters) {
  const species = FLOWER_SPECIES[Math.floor(Math.random() * FLOWER_SPECIES.length)];
  const colorway = species.palette[Math.floor(Math.random() * species.palette.length)];

  let leftPercent = pickFlowerLeftPercent(clusterCenters);
  // Layer 1 (closest) is allowed to bleed past 0–100 so a few large
  // flowers are genuinely cropped by the viewport edge, per the brief.
  const minLeft = layerNumber === 1 ? -8 : 1;
  const maxLeft = layerNumber === 1 ? 108 : 99;
  leftPercent = Math.min(maxLeft, Math.max(minLeft, leftPercent));

  const layerScale = layerNumber === 1 ? 1.5 : layerNumber === 3 ? 0.55 : 1;
  const scale = species.baseScale * layerScale * (0.75 + Math.random() * 0.5);

  // Heavier/larger instances sway less; smaller ones sway more — combines
  // each species' inherent tendency with this specific instance's size.
  const sizeFactor = Math.min(1.4, Math.max(0.6, scale));
  const swayMult = (species.baseSway / sizeFactor) * (0.85 + Math.random() * 0.3);

  const bottomBase = layerNumber === 1 ? 8 : layerNumber === 2 ? 10 : 14;
  const bottomPercent = bottomBase + (Math.random() * 10 - 5);

  const bloomRotation = (Math.random() * 30 - 15).toFixed(1);
  const stemLean = (Math.random() * 14 - 7).toFixed(1);

  // Staggers each flower's reaction to the shared --wind-angle value so
  // the field doesn't sway in perfect lockstep — an approximation of
  // "different wind timing" at flower scale; true spatial wave
  // propagation across the field arrives with the grass system.
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
   12. ILLUSTRATED WORLD — Butterflies + Fireflies
   -----------------------------------------------------
   Unchanged from Version 6/7. Not yet aware of individual
   flower positions — that lands in a future version.
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

function initFireflies() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!dom.creatureLayer) return;

  const isSmallScreen = window.innerWidth < 480;
  const count = isSmallScreen
    ? Math.round(CONFIG.world.fireflyCount * 0.6)
    : CONFIG.world.fireflyCount;

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

function initIllustratedWorld() {
  initButterflies();
  initFireflies();
}

/* -----------------------------------------------------
   13. EVENT LISTENERS
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
   14. INIT — Runs once DOM is ready
----------------------------------------------------- */
function init() {
  applyPersonalization();
  initParticles();
  bindEvents();
  initBirthdayCard();
  initGiftBoxes();
  initCake();
  initEnvironmentSystem();
  generateFlowerField(); // Version 8
  initIllustratedWorld();
}

document.addEventListener('DOMContentLoaded', init);
