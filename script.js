/**
 * Cinematic Environment Engine (Version 2.3 Clustered Starfield & Lunar Warmth)
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
   * Environment System (Version 1.3 Sub-System - Preserved)
   * Renders a highly performance-optimized, slowly breathing atmospheric evening sky.
   */
  const EnvironmentSystem = {
    name: 'EnvironmentSystem',
    canvas: null,
    ctx: null,
    bufferWidth: 512,
    bufferHeight: 512,
    ambientTime: 0,
    ambientSpeed: 0.04,

    init(width, height, dpr) {
      this.canvas = document.getElementById('environment-canvas');
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d', { alpha: false });
      this.onResize(width, height, dpr);
    },

    onResize(width, height, dpr) {
      if (!this.canvas) return;
      this.canvas.width = this.bufferWidth;
      this.canvas.height = this.bufferHeight;
    },

    update(dt) {
      this.ambientTime += this.ambientSpeed * dt;
    },

    render() {
      if (!this.ctx) return;

      const ctx = this.ctx;
      const w = this.bufferWidth;
      const h = this.bufferHeight;

      ctx.clearRect(0, 0, w, h);

      const baseGradient = ctx.createLinearGradient(0, 0, 0, h);
      baseGradient.addColorStop(0, 'hsla(230, 25%, 12%, 1)');
      baseGradient.addColorStop(0.5, 'hsla(260, 20%, 18%, 1)');
      baseGradient.addColorStop(1, 'hsla(265, 30%, 25%, 1)');
      ctx.fillStyle = baseGradient;
      ctx.fillRect(0, 0, w, h);

      const driftX = Math.sin(this.ambientTime) * (w * 0.15);
      const driftY = Math.cos(this.ambientTime * 0.8) * (h * 0.08);

      const horizonGlow = ctx.createRadialGradient(
        w * 0.5 + driftX,
        h * 0.85 + driftY,
        0,
        w * 0.5 + driftX,
        h * 0.85 + driftY,
        w * 0.6
      );
      horizonGlow.addColorStop(0, 'hsla(43, 40%, 75%, 0.15)');
      horizonGlow.addColorStop(0.5, 'hsla(350, 40%, 88%, 0.08)');
      horizonGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = horizonGlow;
      ctx.fillRect(0, 0, w, h);

      const upperAtmosphereGlow = ctx.createRadialGradient(
        w * 0.35 - driftX * 0.5,
        h * 0.2 + driftY * 0.5,
        w * 0.1,
        w * 0.35 - driftX * 0.5,
        h * 0.2 + driftY * 0.5,
        w * 0.8
      );
      upperAtmosphereGlow.addColorStop(0, 'hsla(205, 35%, 84%, 0.12)');
      upperAtmosphereGlow.addColorStop(0.6, 'hsla(265, 30%, 82%, 0.04)');
      upperAtmosphereGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = upperAtmosphereGlow;
      ctx.fillRect(0, 0, w, h);
    }
  };

  /**
   * Moon System (Version 2.3 Refined)
   * Manages the warm celestial moon coordinates, pre-rendered surfaces, and nested glow filters.
   */
  const MoonSystem = {
    name: 'MoonSystem',
    canvas: null,
    ctx: null,
    offscreenCanvas: null,
    offscreenCtx: null,
    
    // Globally exposed coordinates (consumed by StarSystem for ambient illumination damping)
    centerX: 0,
    centerY: 0,
    radius: 0,
    
    glowTime: 0,
    glowSpeed: 0.35, // Slower, highly realistic breathing sweep

    init(width, height, dpr) {
      this.canvas = document.getElementById('moon-canvas');
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d');
      this.offscreenCanvas = document.createElement('canvas');
      this.offscreenCtx = this.offscreenCanvas.getContext('2d');

      this.onResize(width, height, dpr);
    },

    onResize(width, height, dpr) {
      if (!this.canvas) return;

      this.canvas.width = width * dpr;
      this.canvas.height = height * dpr;
      this.ctx.scale(dpr, dpr);

      const isMobile = width < 600;
      this.centerX = width * (isMobile ? 0.66 : 0.74);
      this.centerY = height * (isMobile ? 0.24 : 0.28);
      
      const baseMeasurement = Math.min(width, height);
      this.radius = baseMeasurement * (isMobile ? 0.16 : 0.135);
      this.radius = Math.max(Math.min(this.radius, 200), 55);

      this.preRenderLunarSurface();
    },

    /**
     * Pre-renders the moon texture using ultra-soft, warm yellow-gold and cream properties.
     */
    preRenderLunarSurface() {
      const dpr = State.pixelRatio;
      const size = Math.ceil(this.radius * 2 * dpr);
      const center = size / 2;
      const r = this.radius * dpr;

      this.offscreenCanvas.width = size;
      this.offscreenCanvas.height = size;
      const octx = this.offscreenCtx;

      octx.clearRect(0, 0, size, size);

      octx.save();
      octx.beginPath();
      octx.arc(center, center, r, 0, Math.PI * 2);
      octx.clip();

      // 1. Base Layer: Natural Golden-Ivory Evening Full Moon
      const baseGrad = octx.createRadialGradient(
        center - r * 0.15,
        center - r * 0.15,
        r * 0.05,
        center,
        center,
        r
      );
      baseGrad.addColorStop(0, 'hsla(38, 55%, 94%, 1)');       /* Warm Ivory */
      baseGrad.addColorStop(0.45, 'hsla(35, 45%, 88%, 1)');    /* Warm Cream */
      baseGrad.addColorStop(0.82, 'hsla(43, 50%, 82%, 1)');    /* Soft Gold tone */
      baseGrad.addColorStop(1, 'hsla(30, 10%, 65%, 1)');       /* Warm shadow grey edge rim */
      octx.fillStyle = baseGrad;
      octx.beginPath();
      octx.arc(center, center, r, 0, Math.PI * 2);
      octx.fill();

      // 2. Warm-toned Maria Basaltic plains
      octx.globalAlpha = 0.11;
      octx.fillStyle = 'hsla(25, 10%, 42%, 1)'; // Warm grey-brown maria
      const maria = [
        { x: center - r * 0.35, y: center - r * 0.25, r: r * 0.38 },
        { x: center - r * 0.15, y: center + r * 0.1, r: r * 0.28 },
        { x: center + r * 0.3, y: center - r * 0.45, r: r * 0.24 },
        { x: center + r * 0.35, y: center + r * 0.1, r: r * 0.32 },
        { x: center - r * 0.5, y: center + r * 0.3, r: r * 0.22 },
        { x: center + r * 0.05, y: center - r * 0.5, r: r * 0.18 }
      ];
      maria.forEach(m => {
        octx.beginPath();
        octx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        octx.filter = `blur(${r * 0.09}px)`;
        octx.fill();
      });
      octx.filter = 'none';
      octx.globalAlpha = 1.0;

      // 3. Procedural Craters (Deterministic layout via PRNG)
      let seed = 123;
      const seededRandom = () => {
        let x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
      };

      const generateCraters = (count, maxR, shadowIntensity) => {
        for (let i = 0; i < count; i++) {
          const angle = seededRandom() * Math.PI * 2;
          const distance = Math.sqrt(seededRandom()) * r * 0.95;
          const cx = center + Math.cos(angle) * distance;
          const cy = center + Math.sin(angle) * distance;
          const cr = r * seededRandom() * maxR;

          octx.save();
          octx.beginPath();
          octx.arc(cx, cy, cr, 0, Math.PI * 2);
          octx.clip();

          // Left-Top Shadow Arc (warm shadowed indent)
          octx.beginPath();
          octx.arc(cx - cr * 0.12, cy - cr * 0.12, cr, 0, Math.PI * 2);
          octx.fillStyle = `rgba(50, 42, 35, ${shadowIntensity * 0.26})`;
          octx.fill();

          // Right-Bottom Highlight Ridge (Ivory edge)
          octx.beginPath();
          octx.arc(cx + cr * 0.1, cy + cr * 0.1, cr, 0, Math.PI * 2);
          octx.strokeStyle = 'rgba(253, 246, 226, 0.45)';
          octx.lineWidth = Math.max(cr * 0.08, 0.5);
          octx.stroke();

          octx.restore();
        }
      };

      generateCraters(12, 0.08, 1.2);
      generateCraters(60, 0.025, 0.9);

      octx.restore();
    },

    update(dt) {
      this.glowTime += this.glowSpeed * dt;
    },

    render() {
      if (!this.ctx || !this.offscreenCanvas) return;

      const ctx = this.ctx;
      const x = this.centerX;
      const y = this.centerY;
      const r = this.radius;

      ctx.clearRect(0, 0, State.width, State.height);

      // Slower, almost imperceptible breathing coefficient (0.85 to 1.15)
      const breath = 1.0 + Math.sin(this.glowTime) * 0.15;

      ctx.globalCompositeOperation = 'screen';
      
      // Layer 1: Extreme Atmospheric Glow (Broad diffusion)
      const outerGlow = ctx.createRadialGradient(x, y, r * 0.8, x, y, r * 5.0);
      outerGlow.addColorStop(0, `hsla(43, 50%, 75%, ${0.05 * breath})`);
      outerGlow.addColorStop(0.4, `hsla(350, 40%, 88%, ${0.02 * breath})`);
      outerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = outerGlow;
      ctx.beginPath();
      ctx.arc(x, y, r * 5.0, 0, Math.PI * 2);
      ctx.fill();

      // Layer 2: Medium Soft Ambient Glow
      const ambientGlow = ctx.createRadialGradient(x, y, r * 0.5, x, y, r * 3.0);
      ambientGlow.addColorStop(0, `hsla(43, 60%, 75%, ${0.09 * breath})`);
      ambientGlow.addColorStop(0.5, `hsla(38, 50%, 94%, ${0.03 * breath})`);
      ambientGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = ambientGlow;
      ctx.beginPath();
      ctx.arc(x, y, r * 3.0, 0, Math.PI * 2);
      ctx.fill();

      // Layer 3: Intense Core Glow Halo (Smooth edge blend)
      const coreGlow = ctx.createRadialGradient(x, y, r * 0.2, x, y, r * 1.5);
      coreGlow.addColorStop(0, `hsla(38, 50%, 94%, ${0.18 * breath})`);
      coreGlow.addColorStop(0.6, `hsla(43, 55%, 75%, ${0.06 * breath})`);
      coreGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = coreGlow;
      ctx.beginPath();
      ctx.arc(x, y, r * 1.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalCompositeOperation = 'source-over';

      const size = r * 2;
      ctx.drawImage(
        this.offscreenCanvas,
        0, 0, this.offscreenCanvas.width, this.offscreenCanvas.height,
        x - r, y - r, size, size
      );
    }
  };

  /**
   * Star System (Version 2.3 Sub-System - Added)
   * Procedurally generates, clusters, and renders hundreds of organic, multi-depth stars.
   * Dynamically attenuates (dims) stars based on their proximity to the moon's light glare.
   */
  const StarSystem = {
    name: 'StarSystem',
    canvas: null,
    ctx: null,
    stars: [],

    init(width, height, dpr) {
      this.canvas = document.getElementById('stars-canvas');
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d');
      this.onResize(width, height, dpr);
    },

    onResize(width, height, dpr) {
      if (!this.canvas) return;

      this.canvas.width = width * dpr;
      this.canvas.height = height * dpr;
      this.ctx.scale(dpr, dpr);

      this.generateStarfield(width, height);
    },

    /**
     * Builds an organically distributed starfield.
     * Uses a cluster-center algorithm to form gorgeous, natural cosmic spacing.
     */
    generateStarfield(width, height) {
      this.stars = [];
      const utils = GardenEngine.getUtils();

      // Responsive Density Calculation (scales naturally based on viewport area)
      const area = width * height;
      const starCount = utils.clamp(Math.floor(area / 3200), 120, 500);

      // Create 5 organic coordinate clusters (Constellation generators)
      const clusters = [];
      for (let c = 0; c < 5; c++) {
        clusters.push({
          x: utils.randomRange(width * 0.1, width * 0.9),
          y: utils.randomRange(height * 0.1, height * 0.6)
        });
      }

      for (let i = 0; i < starCount; i++) {
        let sx, sy;

        // 65% of stars spawn grouped near constellation centers; 35% are uniform
        if (Math.random() < 0.65) {
          const parent = clusters[Math.floor(Math.random() * clusters.length)];
          // Gaussian offset distribution
          const r = utils.randomRange(20, Math.min(width, height) * 0.25);
          const theta = Math.random() * Math.PI * 2;
          sx = parent.x + Math.cos(theta) * r;
          sy = parent.y + Math.sin(theta) * r;
        } else {
          sx = utils.randomRange(0, width);
          sy = utils.randomRange(0, height * 0.75); // Restrict stars mostly to upper portions
        }

        // Clip stars coordinates securely within viewport boundaries
        sx = utils.clamp(sx, 1, width - 1);
        sy = utils.clamp(sy, 1, height - 1);

        // Multi-Depth Classification (0: Distant, 1: Medium, 2: Closer)
        const depthRandom = Math.random();
        let depth = 0;
        let size = utils.randomRange(0.4, 0.75); // Most stars are tiny, distant points
        let glow = 0;

        if (depthRandom > 0.70 && depthRandom <= 0.94) {
          depth = 1; // Medium distance
          size = utils.randomRange(0.8, 1.25);
        } else if (depthRandom > 0.94) {
          depth = 2; // Closer, brighter points
          size = utils.randomRange(1.3, 1.75);
          glow = utils.randomRange(2, 4); // Extra luminous bloom
        }

        this.stars.push({
          x: sx,
          y: sy,
          size: size,
          depth: depth,
          glow: glow,
          baseOpacity: utils.randomRange(0.2, 0.7),
          opacity: 0,
          twinkleSpeed: utils.randomRange(0.6, 2.2),
          twinklePhase: utils.randomRange(0, Math.PI * 2)
        });
      }
    },

    update(dt) {
      const utils = GardenEngine.getUtils();

      // Retrieve public moon state variables for distance glare attenuation calculations
      const moonX = MoonSystem.centerX;
      const moonY = MoonSystem.centerY;
      const moonR = MoonSystem.radius;
      const glareRadius = moonR * 3.8; // Proximity threshold for moonlight damping

      for (let i = 0; i < this.stars.length; i++) {
        const s = this.stars[i];

        // 1. Twinkling Progression (Independent sinewaves)
        s.twinklePhase += s.twinkleSpeed * dt;
        let twinkleFactor = 0.6 + Math.sin(s.twinklePhase) * 0.4; // Ranges between 0.2 and 1.0
        
        let targetOpacity = s.baseOpacity * twinkleFactor;

        // 2. Proximity Glare Attenuation (dim stars that are close to the moon)
        if (moonR > 0) {
          const dx = s.x - moonX;
          const dy = s.y - moonY;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < glareRadius) {
            // Smooth step dampening curve (stars near the rim approach near 0 opacity)
            const factor = utils.clamp((distance - moonR * 1.1) / (glareRadius - moonR * 1.1), 0.05, 1.0);
            targetOpacity *= factor;
          }
        }

        s.opacity = targetOpacity;
      }
    },

    render() {
      if (!this.ctx) return;

      const ctx = this.ctx;
      ctx.clearRect(0, 0, State.width, State.height);

      for (let i = 0; i < this.stars.length; i++) {
        const s = this.stars[i];
        
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);

        // Golden-ivory tones for nearby close stars; clear whites for background points
        if (s.depth === 2) {
          ctx.fillStyle = `rgba(253, 246, 226, ${s.opacity})`;
          ctx.shadowColor = 'rgba(253, 246, 226, 0.5)';
          ctx.shadowBlur = s.glow;
        } else {
          ctx.fillStyle = `rgba(240, 243, 255, ${s.opacity})`;
        }

        ctx.fill();
        ctx.shadowBlur = 0; // Quick reset
      }
    }
  };

  /**
   * Loading Screen System (Version 1.2 Sub-System - Preserved)
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
          vx: utils.randomRange(-8, 8),
          vy: utils.randomRange(-15, -5),
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
        p.x += (p.vx * dt);
        p.y += (p.vy * dt);

        p.pulsePhase += p.pulseSpeed * dt;
        p.opacity = p.baseOpacity + Math.sin(p.pulsePhase) * 0.15;
        p.opacity = utils.clamp(p.opacity, 0.05, 0.85);

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

      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(43, 60%, 75%, ${p.opacity})`;
        ctx.shadowColor = 'hsla(43, 60%, 75%, 0.4)';
        ctx.shadowBlur = 4;
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    },

    triggerMonogramTimeline() {
      const paths = document.querySelectorAll('.draw-path');
      const monogramSvg = document.querySelector('.monogram-svg');
      const message = document.querySelector('.loading-message');

      paths.forEach(path => {
        const length = path.getTotalLength();
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
      });

      setTimeout(() => {
        paths.forEach(path => {
          path.style.strokeDashoffset = '0';
        });
      }, 400);

      setTimeout(() => {
        if (monogramSvg) monogramSvg.classList.add('glowing');
      }, 2100);

      setTimeout(() => {
        if (message) message.classList.add('visible');
      }, 3000);

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
   * mount scene layers, and control transition states. (Preserved)
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

        setTimeout(() => {
          this.dom.loading.style.display = 'none';
          LoadingSystem.destroy();
          GardenEngine.unregisterSystem(LoadingSystem);
        }, 1200);
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

      ResizeManager.init();
      SceneManager.init();
      
      // Register global systems
      this.registerSystem(LoadingSystem);
      this.registerSystem(EnvironmentSystem);
      this.registerSystem(MoonSystem); 
      this.registerSystem(StarSystem); // Version 2.3 Active
      
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
