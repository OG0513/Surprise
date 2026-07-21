/**
 * Application Foundation Script
 * Developed using Vanilla JS. Keeps core utilities separate from global scope.
 */

'use strict';

// IIFE to contain variable scoping and secure architecture
(function() {
  
  // Reusable DOM Utility Helper Functions
  const DOM = {
    /**
     * Find element inside DOM context
     * @param {string} selector - CSS Selector string
     * @param {HTMLElement} [context=document] - Parent element constraint
     * @returns {HTMLElement|null}
     */
    find: (selector, context = document) => context.querySelector(selector),

    /**
     * Find all elements inside DOM context
     * @param {string} selector - CSS Selector string
     * @param {HTMLElement} [context=document] - Parent element constraint
     * @returns {NodeList}
     */
    findAll: (selector, context = document) => context.querySelectorAll(selector),

    /**
     * Safe event binding mechanism
     * @param {HTMLElement} target - DOM Element
     * @param {string} type - Event action string
     * @param {Function} handler - Event handler callback
     */
    on: (target, type, handler) => {
      if (target) target.addEventListener(type, handler);
    }
  };

  /**
   * Utility helper to throttle function executions
   * @param {Function} func - Function to execute
   * @param {number} limit - Execution limit threshold in milliseconds
   * @returns {Function}
   */
  const throttle = (func, limit) => {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };

  // Canvas Loader Floating Particles Controller
  const ParticleSystem = {
    canvas: null,
    ctx: null,
    particles: [],
    animationFrameId: null,
    running: false,
    
    // Configurable Particle Options
    config: {
      count: 45,
      minSize: 1,
      maxSize: 3.5,
      minSpeed: 0.1,
      maxSpeed: 0.55,
      color: 'rgba(251, 191, 36, 0.4)' // Soft amber gold
    },

    /**
     * Start animation container
     * @param {HTMLCanvasElement} canvasElement 
     */
    init: function(canvasElement) {
      if (!canvasElement) return;
      this.canvas = canvasElement;
      this.ctx = this.canvas.getContext('2d');
      this.running = true;

      this.resizeCanvas();
      this.createParticles();
      this.animate();

      DOM.on(window, 'resize', () => this.resizeCanvas());
    },

    resizeCanvas: function() {
      if (!this.canvas) return;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    },

    createParticles: function() {
      this.particles = [];
      for (let i = 0; i < this.config.count; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          radius: Math.random() * (this.config.maxSize - this.config.minSize) + this.config.minSize,
          speedY: -(Math.random() * (this.config.maxSpeed - this.config.minSpeed) + this.config.minSpeed),
          speedX: (Math.random() - 0.5) * 0.25,
          alpha: Math.random() * 0.5 + 0.2,
          fadeSpeed: Math.random() * 0.005 + 0.002,
          oscillating: Math.random() > 0.5
        });
      }
    },

    animate: function() {
      if (!this.running) return;

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        
        // Draw Soft Glowing Particle
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        
        // Add subtle radial bloom to particles
        const gradient = this.ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2);
        gradient.addColorStop(0, `rgba(251, 191, 36, ${p.alpha})`);
        gradient.addColorStop(0.5, `rgba(251, 191, 36, ${p.alpha * 0.4})`);
        gradient.addColorStop(1, 'rgba(251, 191, 36, 0)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fill();

        // Update Position
        p.y += p.speedY;
        p.x += p.speedX;

        // Subtly oscillate alpha to mimic embers/fireflies
        if (p.oscillating) {
          p.alpha -= p.fadeSpeed;
          if (p.alpha <= 0.15) {
            p.oscillating = false;
          }
        } else {
          p.alpha += p.fadeSpeed;
          if (p.alpha >= 0.75) {
            p.oscillating = true;
          }
        }

        // Wrap around boundary logic
        if (p.y < -p.radius * 2) {
          p.y = this.canvas.height + p.radius * 2;
          p.x = Math.random() * this.canvas.width;
        }
        if (p.x < -p.radius * 2 || p.x > this.canvas.width + p.radius * 2) {
          p.x = Math.random() * this.canvas.width;
        }
      }

      this.animationFrameId = requestAnimationFrame(() => this.animate());
    },

    /**
     * Clean resources, detach animation updates to prevent background execution
     */
    stop: function() {
      this.running = false;
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }
    }
  };

  // Canvas Garden Ambient Effects Controller (Stars, Petals, Fireflies)
  const GardenEffects = {
    canvas: null,
    ctx: null,
    stars: [],
    fireflies: [],
    petals: [],
    animationFrameId: null,
    active: false,

    init: function(canvasElement) {
      if (!canvasElement) return;
      this.canvas = canvasElement;
      this.ctx = this.canvas.getContext('2d');
      this.active = true;

      this.resizeCanvas();
      this.setupFXLayers();
      this.loop();

      DOM.on(window, 'resize', () => this.resizeCanvas());
    },

    resizeCanvas: function() {
      if (!this.canvas) return;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    },

    setupFXLayers: function() {
      const w = this.canvas.width;
      const h = this.canvas.height;

      // 1. Twinkling Night Stars Layer
      this.stars = [];
      const starCount = Math.floor((w * h) / 11000); // Responsive density distribution
      for (let i = 0; i < starCount; i++) {
        this.stars.push({
          x: Math.random() * w,
          y: Math.random() * (h * 0.75), // Limit stars to higher sky regions
          size: Math.random() * 1.5 + 0.3,
          maxAlpha: Math.random() * 0.6 + 0.2,
          alpha: Math.random(),
          speed: Math.random() * 0.02 + 0.005
        });
      }

      // 2. Wandering Ambient Fireflies
      this.fireflies = [];
      for (let i = 0; i < 24; i++) {
        this.fireflies.push({
          x: Math.random() * w,
          y: h * 0.4 + Math.random() * (h * 0.55), // Ground focused
          radius: Math.random() * 2 + 1.2,
          alpha: Math.random() * 0.7 + 0.1,
          pulseSpeed: Math.random() * 0.03 + 0.015,
          angle: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.4 + 0.2,
          wobble: Math.random() * 0.02 + 0.01
        });
      }

      // 3. Floating Blush Pink Petals
      this.petals = [];
      for (let i = 0; i < 18; i++) {
        this.petals.push({
          x: Math.random() * w,
          y: -20 - (Math.random() * h),
          size: Math.random() * 8 + 4,
          speedY: Math.random() * 0.7 + 0.4,
          speedX: Math.random() * 0.3 - 0.15,
          rotation: Math.random() * 360,
          rotSpeed: Math.random() * 1.5 - 0.75,
          swingAngle: Math.random() * Math.PI,
          swingSpeed: Math.random() * 0.01 + 0.005
        });
      }
    },

    loop: function() {
      if (!this.active) return;
      const ctx = this.ctx;
      const w = this.canvas.width;
      const h = this.canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Render Layer 1: Twinkling Stars
      for (let i = 0; i < this.stars.length; i++) {
        const s = this.stars[i];
        s.alpha += s.speed;
        if (s.alpha > s.maxAlpha || s.alpha < 0.1) {
          s.speed = -s.speed; // Invert bounce
        }
        ctx.fillStyle = `rgba(254, 253, 246, ${Math.max(0.1, Math.min(s.maxAlpha, s.alpha))})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render Layer 2: Glowing Soft Gold Fireflies
      for (let i = 0; i < this.fireflies.length; i++) {
        const f = this.fireflies[i];
        
        // Organic random walk drift updates
        f.angle += f.wobble;
        f.x += Math.cos(f.angle) * f.speed;
        f.y += Math.sin(f.angle) * (f.speed * 0.8) - 0.05; // Gentle upward float bias
        
        f.alpha += f.pulseSpeed;
        if (f.alpha > 0.85 || f.alpha < 0.1) {
          f.pulseSpeed = -f.pulseSpeed;
        }

        // Screen boundary looping
        if (f.x < -20) f.x = w + 20;
        if (f.x > w + 20) f.x = -20;
        if (f.y < h * 0.25) f.y = h + 20;
        if (f.y > h + 20) f.y = h * 0.4;

        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius * 2.5, 0, Math.PI * 2);
        const glow = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.radius * 2.5);
        glow.addColorStop(0, `rgba(243, 210, 122, ${Math.max(0.1, f.alpha)})`);
        glow.addColorStop(0.4, `rgba(251, 191, 36, ${f.alpha * 0.3})`);
        glow.addColorStop(1, 'rgba(251, 191, 36, 0)');
        ctx.fillStyle = glow;
        ctx.fill();
      }

      // Render Layer 3: Drifting Blush Pink Petals
      for (let i = 0; i < this.petals.length; i++) {
        const p = this.petals[i];
        p.y += p.speedY;
        p.swingAngle += p.swingSpeed;
        p.x += p.speedX + Math.sin(p.swingAngle) * 0.25;
        p.rotation += p.rotSpeed;

        if (p.y > h + 20 || p.x < -20 || p.x > w + 20) {
          p.y = -20;
          p.x = Math.random() * w;
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        
        ctx.beginPath();
        // Handcrafted soft organic petal paths using bezier paths
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-p.size / 2, -p.size, p.size / 2, -p.size, 0, 0);
        ctx.fillStyle = 'rgba(250, 225, 230, 0.7)'; // Blush pink base
        ctx.fill();
        
        // Add subtle petal inner highlight shading
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-p.size / 4, -p.size * 0.8, p.size / 4, -p.size * 0.8, 0, 0);
        ctx.fillStyle = 'rgba(251, 207, 232, 0.85)'; // Slightly darker rose petal spine
        ctx.fill();

        ctx.restore();
      }

      this.animationFrameId = requestAnimationFrame(() => this.loop());
    }
  };

  // Application Logic Module
  const App = {
    init: function() {
      this.initLoader();
      this.initMobileMenu();
      this.initDynamicYear();
      this.setupResponsiveListeners();
      this.initSceneControllers();
    },

    /**
     * Initializes Loader overlay, binds Canvas Particle generation, 
     * and schedules elegant transition out after 4 seconds
     */
    initLoader: function() {
      const loaderOverlay = DOM.find('#premium-loader');
      const loaderCanvas = DOM.find('#loader-particles');

      if (!loaderOverlay) return;

      // Start floating glow particles inside canvas
      if (loaderCanvas) {
        ParticleSystem.init(loaderCanvas);
      }

      // Schedule Fade Out (Approx. 4 Seconds cinematic hold)
      setTimeout(() => {
        loaderOverlay.classList.add('loader-fade-out');
        loaderOverlay.setAttribute('aria-busy', 'false');

        // Start immersive garden background canvas layers once overlay fades
        const gardenCanvas = DOM.find('#garden-interactive-canvas');
        if (gardenCanvas) {
          GardenEffects.init(gardenCanvas);
        }

        // Cleanup loader resources once transition completes
        setTimeout(() => {
          ParticleSystem.stop();
          loaderOverlay.remove(); // Safely remove element from dynamic DOM structure
        }, 800); // Synchronized with --transition-cinematic timeline

      }, 4200);
    },

    /**
     * Set up UI controls to toggle interface layers to allow full screen focus
     */
    initSceneControllers: function() {
      const viewToggle = DOM.find('#ui-visibility-toggle');
      if (!viewToggle) return;

      DOM.on(viewToggle, 'click', () => {
        const body = document.body;
        body.classList.toggle('dashboard-hidden');
        
        // Update textual/visual details inside toggle button
        const isHidden = body.classList.contains('dashboard-hidden');
        const txt = DOM.find('.toggle-text', viewToggle);
        if (txt) {
          txt.textContent = isHidden ? 'Show Interface' : 'Toggle View';
        }
      });
    },

    /**
     * Initializes responsive toggle settings and accessibility properties for site header
     */
    initMobileMenu: function() {
      const toggleBtn = DOM.find('.mobile-nav-toggle');
      const navigation = DOM.find('.primary-navigation');

      if (!toggleBtn || !navigation) return;

      DOM.on(toggleBtn, 'click', () => {
        const isOpen = toggleBtn.getAttribute('aria-expanded') === 'true';
        
        toggleBtn.setAttribute('aria-expanded', !isOpen);
        navigation.classList.toggle('open', !isOpen);
      });

      // Close navigation automatically if background wrapper is selected or window resize happens
      DOM.on(document, 'click', (e) => {
        if (!toggleBtn.contains(e.target) && !navigation.contains(e.target)) {
          toggleBtn.setAttribute('aria-expanded', 'false');
          navigation.classList.remove('open');
        }
      });
    },

    /**
     * Updates copyright year tags within HTML elements automatically
     */
    initDynamicYear: function() {
      const yearContainer = DOM.find('#current-year');
      if (yearContainer) {
        yearContainer.textContent = new Date().getFullYear();
      }
    },

    /**
     * Listens to interface layout properties to reset state context changes
     */
    setupResponsiveListeners: function() {
      const toggleBtn = DOM.find('.mobile-nav-toggle');
      const navigation = DOM.find('.primary-navigation');

      if (!toggleBtn || !navigation) return;

      const handleResize = throttle(() => {
        if (window.innerWidth >= 768) {
          // Revert ARIA states if returning to viewport structures without dynamic dropdowns
          toggleBtn.setAttribute('aria-expanded', 'false');
          navigation.classList.remove('open');
        }
      }, 200);

      DOM.on(window, 'resize', handleResize);
    }
  };

  // Initialize once DOM tree completes processing
  document.addEventListener('DOMContentLoaded', () => {
    App.init();
  });

})();
