/**
 * Cinematic Environment Engine (Version 1.2 Immersive Entry)
 * Namespace structure to manage lifecycle, states, and render threads.
 */

const GardenEngine = (() => {
  'use strict';

  // 1. Core Configuration Parameters
  const Config = {
    fpsLimit: 60,
    resizeDebounceDelay: 150,
  };

  // 2. Global State Engine
  const State = {
    width: window.innerWidth,
    height: window.innerHeight,
    pixelRatio: Math.min(window.devicePixelRatio || 1, 2),
    isInitialized: false,
    isActive: true,
    lastFrameTime: 0,
    deltaTime: 0,
  };

  // 3. Module Registry (To easily mount future visual sub-systems)
  const ActiveSystems = new Set();

  /**
   * Performance-optimized window resizing utility.
   * Debounces callback execution to protect GPU performance.
   */
  const ResizeManager = {
    timer: null,

    init() {
      window.addEventListener('resize', this.handleResize.bind(this), { passive: true });
      window.addEventListener('orientationchange', this.handleResize.bind(this), { passive: true });
      this.updateViewportDimensions();
    },

    updateViewportDimensions() {
      State.width = window.innerWidth;
      State.height = window.innerHeight;
      State.pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      // Trigger resize handlers on all mounted dynamic modules
      ActiveSystems.forEach(system => {
        if (typeof system.onResize === 'function') {
          system.onResize(State.width, State.height, State.pixelRatio);
        }
      });
    },

    handleResize() {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.updateViewportDimensions();
      }, Config.resizeDebounceDelay);
    }
  };

  /**
   * Centralized Animation Loop Manager.
   * Computes delta-time independently of screen refresh-rates.
   */
  const AnimationManager = {
    frameId: null,

    start() {
      State.lastFrameTime = performance.now();
      this.loop(State.lastFrameTime);
    },

    loop(currentTime) {
      if (!State.isActive) return;

      this.frameId = requestAnimationFrame(this.loop.bind(this));

      State.deltaTime = (currentTime - State.lastFrameTime) / 1000;
      State.lastFrameTime = currentTime;

      // Update state and render all registered sub-systems
      ActiveSystems.forEach(system => {
        if (typeof system.update === 'function') {
          system.update(State.deltaTime);
        }
        if (typeof system.render === 'function') {
          system.render();
        }
      });
    },

    stop() {
      if (this.frameId) {
        cancelAnimationFrame(this.frameId);
      }
    }
  };

  /**
   * Loading Screen System (Version 1.2 Sub-System)
   * Manages SVG Calligraphy strokes, magical dust canvas updates, and transitions.
   */
  const LoadingSystem = {
    name: 'LoadingSystem',
    canvas: null,
    ctx: null,
    particles: [],
    maxParticles: 45,
    isRunning: true,

    init(width, height, dpr) {
      this.canvas = document.getElementById('loading-canvas');
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d', { alpha: true });
      this.onResize(width, height, dpr);
      this.generateParticles();

      // Trigger the calligraphy and UI progression timeline
      this.triggerMonogramTimeline();
    },

    onResize(width, height, dpr) {
      if (!this.canvas) return;
      this.canvas.width = width * dpr;
      this.canvas.height = height * dpr;
      this.ctx.scale(dpr, dpr);
    },

    generateParticles() {
      this.particles = [];
      const utils = GardenEngine.getUtils();

      for (let i = 0; i < this.maxParticles; i++) {
        this.particles.push({
          x: utils.randomRange(0, State.width),
          y: utils.randomRange(0, State.height),
          radius: utils.randomRange(1, 2.8),
          opacity: utils.randomRange(0.1, 0.6),
          baseOpacity: utils.randomRange(0.1, 0.5),
          vx: utils.randomRange(-8, 8), // Gentle drifting velocities
          vy: utils.randomRange(-15, -5), // Drifts predominantly upward
          pulseSpeed: utils.randomRange(1, 3),
          pulsePhase: utils.randomRange(0, Math.PI * 2)
        });
      }
    },

    update(dt) {
      if (!this.isRunning) return;

      const utils = GardenEngine.getUtils();

      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];

        // Frame-rate independent coordinate progression
        p.x += (p.vx * dt);
        p.y += (p.vy * dt);

        // Sinusoidal opacity pulsing to simulate glistening light
        p.pulsePhase += p.pulseSpeed * dt;
        p.opacity = p.baseOpacity + Math.sin(p.pulsePhase) * 0.15;
        p.opacity = utils.clamp(p.opacity, 0.05, 0.85);

        // Re-wrap particles that float off the viewport boundaries
        if (p.y < -10) {
          p.y = State.height + 10;
          p.x = utils.randomRange(0, State.width);
        }
        if (p.x < -10 || p.x > State.width + 10) {
          p.x = utils.randomRange(0, State.width);
        }
      }
    },

    render() {
      if (!this.isRunning || !this.ctx) return;

      const ctx = this.ctx;
      ctx.clearRect(0, 0, State.width, State.height);

      // Render magical dust coordinates
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(43, 60%, 75%, ${p.opacity})`; // Soft Gold particles
        ctx.shadowColor = 'hsla(43, 60%, 75%, 0.4)';
        ctx.shadowBlur = 4;
        ctx.fill();
      }
      ctx.shadowBlur = 0; // Reset canvas shadow context
    },

    triggerMonogramTimeline() {
      const paths = document.querySelectorAll('.draw-path');
      const monogramSvg = document.querySelector('.monogram-svg');
      const message = document.querySelector('.loading-message');

      // 1. Prepare SVG handwriting stroke lengths dynamically
      paths.forEach(path => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
      });

      // 2. Trigger Handwriting strokes (0.4s initial delay)
      setTimeout(() => {
        paths.forEach(path => {
          path.style.strokeDashoffset = '0';
        });
      }, 400);

      // 3. Trigger Glowing aura of completed calligraphy monogram
      setTimeout(() => {
        if (monogramSvg) monogramSvg.classList.add('glowing');
      }, 2100);

      // 4. Reveal subtext message
      setTimeout(() => {
        if (message) message.classList.add('visible');
      }, 3000);

      // 5. Unveil the world (Fade loading layer completely)
      setTimeout(() => {
        SceneManager.revealWorld();
      }, 4500);
    },

    destroy() {
      this.isRunning = false;
      this.particles = [];
      if (this.canvas) {
        this.canvas.style.display = 'none';
      }
    }
  };

  /**
   * Scene Manager to handle initialization lifecycle steps,
   * mount scene layers, and control transition states. (Enhanced)
   */
  const SceneManager = {
    dom: {},

    init() {
      this.dom = {
        loading: document.getElementById('layer-loading'),
        world: document.getElementById('layer-world'),
      };
    },

    revealWorld() {
      if (this.dom.loading) {
        this.dom.loading.style.opacity = '0';
        this.dom.loading.style.pointerEvents = 'none';

        // Unmount loading sub-system after transition closes to conserve CPU/GPU
        setTimeout(() => {
          this.dom.loading.style.display = 'none';
          LoadingSystem.destroy();
          GardenEngine.unregisterSystem(LoadingSystem);
        }, 1200); // Syncs with CSS '--transition-duration-slow'
      }
    }
  };

  /**
   * Mathematical and functional utility helpers. (Preserved)
   */
  const Utils = {
    randomRange(min, max) {
      return Math.random() * (max - min) + min;
    },

    clamp(value, min, max) {
      return Math.min(Math.max(value, min), max);
    }
  };

  // Public API exposure (Preserved & Enhanced)
  return {
    init() {
      if (State.isInitialized) return;

      // Bind global event managers
      ResizeManager.init();
      SceneManager.init();
      
      // Register loading experience system
      this.registerSystem(LoadingSystem);
      
      // Start processing general frame calculations
      AnimationManager.start();

      State.isInitialized = true;
      console.log('Garden Engine initialized.');
    },

    registerSystem(system) {
      if (system && typeof system.init === 'function') {
        system.init(State.width, State.height, State.pixelRatio);
        ActiveSystems.add(system);
        console.log(`System mounted successfully: ${system.name || 'Anonymous'}`);
      }
    },

    unregisterSystem(system) {
      if (ActiveSystems.has(system)) {
        ActiveSystems.delete(system);
      }
    },

    getUtils() {
      return Utils;
    }
  };
})();

// Boot engine once DOM loads completely
document.addEventListener('DOMContentLoaded', () => {
  GardenEngine.init();
});
