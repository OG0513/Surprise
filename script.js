/* =====================================================
   BIRTHDAY WEBSITE — MAIN SCRIPT
   Version 1: Landing Page Logic
===================================================== */

'use strict';

/* -----------------------------------------------------
   1. CONFIG — Personalize the celebration here
----------------------------------------------------- */
const CONFIG = {
  name: 'Beautiful',
  subtitle: "Today the world gets a little brighter — because it's your day. 🎂",
  particleCount: 22, // scales down automatically on small screens, see initParticles()
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
};

/* -----------------------------------------------------
   3. PERSONALIZATION
   Applies CONFIG values into the DOM on load.
----------------------------------------------------- */
function applyPersonalization() {
  if (dom.nameEl) dom.nameEl.textContent = CONFIG.name;
  if (dom.subtitleEl) dom.subtitleEl.textContent = CONFIG.subtitle;
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

  // Fewer particles on narrow viewports to keep things smooth
  const isSmallScreen = window.innerWidth < 480;
  const count = isSmallScreen
    ? Math.round(CONFIG.particleCount * 0.5)
    : CONFIG.particleCount;

  const fragment = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('span');
    particle.className = 'particle';

    // Randomize visual properties for a natural, non-repetitive look
    const size = Math.random() * 6 + 3; // 3px–9px
    const left = Math.random() * 100; // 0%–100%
    const duration = Math.random() * 10 + 10; // 10s–20s
    const delay = Math.random() * 12; // 0s–12s stagger
    const drift = Math.random() * 80 - 40; // -40px to 40px horizontal drift

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

  // Fade out the landing screen
  dom.landing.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  dom.landing.style.opacity = '0';
  dom.landing.style.transform = 'scale(0.98)';

  // After the fade completes, hide landing and reveal the experience screen
  window.setTimeout(() => {
    dom.landing.classList.add('is-hidden');
    dom.experience.classList.add('is-active');
    dom.experience.setAttribute('aria-hidden', 'false');

    // Move focus for accessibility/keyboard users
    dom.experience.setAttribute('tabindex', '-1');
    dom.experience.focus({ preventScroll: true });

    // Placeholder: future versions will trigger cake/card/gallery reveal here
    console.log('🎉 Celebration started! Building the experience screen next...');
  }, 600);
}

/* -----------------------------------------------------
   6. EVENT LISTENERS
----------------------------------------------------- */
function bindEvents() {
  if (dom.startBtn) {
    dom.startBtn.addEventListener('click', startCelebration);

    // Allow keyboard "Enter"/"Space" activation explicitly for clarity
    dom.startBtn.addEventListener('keyup', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        startCelebration();
      }
    });
  }
}

/* -----------------------------------------------------
   7. INIT — Runs once DOM is ready
----------------------------------------------------- */
function init() {
  applyPersonalization();
  initParticles();
  bindEvents();
}

document.addEventListener('DOMContentLoaded', init);
