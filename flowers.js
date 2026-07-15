/* =====================================================
   NEON FLOWERS GARDEN — Bottom of Page
===================================================== */
'use strict';

const flowerCanvas = document.getElementById('flowerGarden');
const gardenCtx = flowerCanvas.getContext('2d');

function resizeFlowerCanvas() {
  flowerCanvas.width = window.innerWidth;
  flowerCanvas.height = window.innerHeight * 0.3; // 30% of viewport
}
resizeFlowerCanvas();
window.addEventListener('resize', resizeFlowerCanvas);

// ── HELPERS ──────────────────────────────────────────────────────────
function lerp(a, b, t) { return a + (b - a) * t; }
function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
function easeOutElastic(t) {
  const c4 = (2*Math.PI)/3;
  return t===0?0:t===1?1:Math.pow(2,-10*t)*Math.sin((t*10-0.75)*c4)+1;
}

// ── COLOUR HELPERS ─────────────────────────────────────────────────────────
function hex2rgb(h) {
  const r = parseInt(h.slice(1,3),16), g = parseInt(h.slice(3,5),16), b = parseInt(h.slice(5,7),16);
  return [r,g,b];
}
function rgba(h, a) { const [r,g,b] = hex2rgb(h); return `rgba(${r},${g},${b},${a})`; }

function darken(hex, factor) {
  let [r,g,b] = hex2rgb(hex);
  r=Math.round(r*factor); g=Math.round(g*factor); b=Math.round(b*factor);
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}
function lighten(hex, factor) {
  let [r,g,b] = hex2rgb(hex);
  r=Math.min(255,Math.round(r+(255-r)*factor));
  g=Math.min(255,Math.round(g+(255-g)*factor));
  b=Math.min(255,Math.round(b+(255-b)*factor));
  return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
}

// ── DRAW LEAF ────────────────────────────────────────────────────────────────
function drawLeaf(x, y, angle, size, color, alpha) {
  if (alpha <= 0) return;
  gardenCtx.save();
  gardenCtx.translate(x, y);
  gardenCtx.rotate(angle);
  gardenCtx.globalAlpha = alpha;

  gardenCtx.beginPath();
  gardenCtx.moveTo(0, 0);
  gardenCtx.bezierCurveTo(-size*0.4, -size*0.5, -size*0.3, -size, 0, -size*1.1);
  gardenCtx.bezierCurveTo( size*0.3, -size, size*0.4, -size*0.5, 0, 0);
  gardenCtx.closePath();

  const lg = gardenCtx.createLinearGradient(0, 0, 0, -size*1.1);
  lg.addColorStop(0, 'rgba(10,80,10,0.9)');
  lg.addColorStop(0.4, rgba(color, 0.92));
  lg.addColorStop(1, rgba(color, 0.7));
  gardenCtx.fillStyle = lg;
  gardenCtx.shadowColor = color;
  gardenCtx.shadowBlur = 8;
  gardenCtx.fill();

  gardenCtx.globalAlpha = 1;
  gardenCtx.restore();
}

// ── DRAW STEM ───────────────────────────────────────────────────────────
function drawStem(x, y, height, color, alpha) {
  if (alpha <= 0) return;
  gardenCtx.save();
  gardenCtx.globalAlpha = alpha;
  
  // Curved stem
  const curve = height * 0.15 * (Math.random() - 0.5);
  gardenCtx.beginPath();
  gardenCtx.moveTo(x, y);
  gardenCtx.quadraticCurveTo(x + curve, y - height*0.5, x + curve*0.5, y - height);
  gardenCtx.strokeStyle = 'rgba(46, 184, 0, 0.8)';
  gardenCtx.lineWidth = 2;
  gardenCtx.shadowColor = '#2eb800';
  gardenCtx.shadowBlur = 6;
  gardenCtx.stroke();
  
  // Leaves along stem
  for (let i = 0.3; i < 1; i += 0.35) {
    const lx = x + curve * i;
    const ly = y - height * i;
    const leafSide = i % 2 === 0 ? 1 : -1;
    drawLeaf(lx, ly, Math.PI/2 * leafSide + 0.3, height*0.08, '#00cc44', alpha*0.7);
  }
  
  gardenCtx.restore();
}

// ── DRAW GRASS BLADE ───────────────────────────────────────────────────
function drawGrassBlade(x, y, height, lean, alpha) {
  if (alpha <= 0) return;
  gardenCtx.save();
  gardenCtx.globalAlpha = alpha;
  gardenCtx.translate(x, y);
  gardenCtx.rotate(lean);
  
  gardenCtx.beginPath();
  gardenCtx.moveTo(0, 0);
  gardenCtx.bezierCurveTo(-height*0.08, -height*0.3, -height*0.05, -height*0.7, 0, -height);
  gardenCtx.bezierCurveTo(height*0.05, -height*0.7, height*0.08, -height*0.3, 0, 0);
  gardenCtx.closePath();
  
  const lg = gardenCtx.createLinearGradient(0, 0, 0, -height);
  lg.addColorStop(0, 'rgba(30, 120, 30, 0.9)');
  lg.addColorStop(0.5, 'rgba(60, 180, 60, 0.8)');
  lg.addColorStop(1, 'rgba(90, 220, 90, 0.7)');
  gardenCtx.fillStyle = lg;
  gardenCtx.shadowColor = '#3aff00';
  gardenCtx.shadowBlur = 4;
  gardenCtx.fill();
  
  gardenCtx.restore();
}

// ── FLOWER DRAWERS ──────────────────────────────────────────────────────
function drawRose(cx, cy, r, color, bloom) {
  if (bloom <= 0) return;
  const petalLayers = [
    { count:5, dist:0.25, rx:0.22, ry:0.38, rot:0,   col:darken(color,0.7), alpha:0.9 },
    { count:6, dist:0.42, rx:0.26, ry:0.42, rot:18,  col:color,             alpha:0.85},
    { count:7, dist:0.60, rx:0.28, ry:0.44, rot:8,   col:lighten(color,0.3),alpha:0.8 },
    { count:8, dist:0.72, rx:0.26, ry:0.38, rot:25,  col:lighten(color,0.5),alpha:0.75},
  ];
  const maxLayer = Math.floor(bloom * petalLayers.length);
  const partialBloom = (bloom * petalLayers.length) % 1;

  for (let l = 0; l < petalLayers.length; l++) {
    const layer = petalLayers[l];
    const layerAlpha = l < maxLayer ? 1 : (l === maxLayer ? partialBloom : 0);
    if (layerAlpha <= 0) continue;
    for (let i = 0; i < layer.count; i++) {
      const angle = (i / layer.count) * Math.PI * 2 + (layer.rot * Math.PI / 180);
      const px = cx + r * layer.dist * Math.cos(angle - Math.PI/2);
      const py = cy + r * layer.dist * Math.sin(angle - Math.PI/2);
      gardenCtx.save();
      gardenCtx.translate(px, py);
      gardenCtx.rotate(angle);
      gardenCtx.beginPath();
      gardenCtx.ellipse(0, 0, r*layer.rx, r*layer.ry, 0, 0, Math.PI*2);
      gardenCtx.fillStyle = rgba(layer.col, layer.alpha * layerAlpha);
      gardenCtx.shadowColor = color;
      gardenCtx.shadowBlur  = 12;
      gardenCtx.fill();
      gardenCtx.restore();
    }
  }
  gardenCtx.beginPath();
  gardenCtx.arc(cx, cy, r*0.18, 0, Math.PI*2);
  const cg = gardenCtx.createRadialGradient(cx, cy-r*0.05, 0, cx, cy, r*0.18);
  cg.addColorStop(0, lighten(color, 0.8));
  cg.addColorStop(1, darken(color, 0.4));
  gardenCtx.fillStyle = cg;
  gardenCtx.shadowColor = lighten(color,0.6);
  gardenCtx.shadowBlur  = 14;
  gardenCtx.fill();
}

function drawTulip(cx, cy, r, color, bloom) {
  if (bloom <= 0) return;
  const petals = [
    { a:-0.4, col:darken(color,0.3) },
    { a: 0,   col:color },
    { a: 0.4, col:darken(color,0.3) },
    { a:-0.15,col:lighten(color,0.4) },
    { a: 0.15,col:lighten(color,0.4) },
  ];
  const scale = easeOutElastic(Math.min(bloom, 1));
  gardenCtx.save();
  gardenCtx.translate(cx, cy);
  gardenCtx.scale(scale, scale);
  for (const p of petals) {
    gardenCtx.save();
    gardenCtx.rotate(p.a);
    gardenCtx.beginPath();
    gardenCtx.moveTo(0, 0);
    gardenCtx.bezierCurveTo(-r*0.4, -r*0.5, -r*0.35, -r*1.1, 0, -r*1.2);
    gardenCtx.bezierCurveTo( r*0.35, -r*1.1, r*0.4, -r*0.5,  0,  0);
    gardenCtx.fillStyle = rgba(p.col, 0.92);
    gardenCtx.shadowColor = color;
    gardenCtx.shadowBlur  = 16;
    gardenCtx.fill();
    gardenCtx.restore();
  }
  gardenCtx.restore();
}

function drawSunflower(cx, cy, r, bloom) {
  if (bloom <= 0) return;
  const scale = easeOutElastic(Math.min(bloom, 1));
  gardenCtx.save();
  gardenCtx.translate(cx, cy);
  gardenCtx.scale(scale, scale);
  const n = 16;
  for (let i = 0; i < n; i++) {
    const angle = (i/n)*Math.PI*2;
    gardenCtx.save();
    gardenCtx.rotate(angle);
    gardenCtx.beginPath();
    gardenCtx.ellipse(0, -r*0.72, r*0.14, r*0.38, 0, 0, Math.PI*2);
    const lg = gardenCtx.createLinearGradient(0, -r*0.4, 0, -r*1.1);
    lg.addColorStop(0, 'rgba(255,190,0,0.95)');
    lg.addColorStop(0.5,'rgba(255,220,30,0.9)');
    lg.addColorStop(1, 'rgba(255,240,80,0.8)');
    gardenCtx.fillStyle = lg;
    gardenCtx.shadowColor = '#ffcc00';
    gardenCtx.shadowBlur  = 14;
    gardenCtx.fill();
    gardenCtx.restore();
  }
  const dg = gardenCtx.createRadialGradient(0, 0, 0, 0, 0, r*0.36);
  dg.addColorStop(0, '#8B4513');
  dg.addColorStop(0.5,'#5C2E00');
  dg.addColorStop(1, '#3a1a00');
  gardenCtx.beginPath();
  gardenCtx.arc(0, 0, r*0.36, 0, Math.PI*2);
  gardenCtx.fillStyle = dg;
  gardenCtx.shadowColor = '#ff8800';
  gardenCtx.shadowBlur  = 12;
  gardenCtx.fill();
  gardenCtx.restore();
}

function drawDaisy(cx, cy, r, color, bloom) {
  if (bloom <= 0) return;
  const scale = easeOutElastic(Math.min(bloom,1));
  gardenCtx.save();
  gardenCtx.translate(cx, cy);
  gardenCtx.scale(scale, scale);
  const n = 14;
  for (let i = 0; i < n; i++) {
    const angle = (i/n)*Math.PI*2;
    gardenCtx.save();
    gardenCtx.rotate(angle);
    gardenCtx.beginPath();
    gardenCtx.ellipse(0, -r*0.58, r*0.10, r*0.32, 0, 0, Math.PI*2);
    gardenCtx.fillStyle = rgba(color, 0.95);
    gardenCtx.shadowColor = color;
    gardenCtx.shadowBlur  = 14;
    gardenCtx.fill();
    gardenCtx.restore();
  }
  const cg = gardenCtx.createRadialGradient(0,-r*0.05,0, 0,0,r*0.28);
  cg.addColorStop(0, '#fff176');
  cg.addColorStop(0.6,'#ffcc00');
  cg.addColorStop(1, '#e65c00');
  gardenCtx.beginPath();
  gardenCtx.arc(0, 0, r*0.28, 0, Math.PI*2);
  gardenCtx.fillStyle = cg;
  gardenCtx.shadowColor = '#ffdd00';
  gardenCtx.shadowBlur  = 16;
  gardenCtx.fill();
  gardenCtx.restore();
}

function drawLily(cx, cy, r, color, bloom) {
  if (bloom <= 0) return;
  const scale = easeOutElastic(Math.min(bloom,1));
  gardenCtx.save();
  gardenCtx.translate(cx, cy);
  gardenCtx.scale(scale, scale);
  const petals = 6;
  for (let i = 0; i < petals; i++) {
    const a = (i/petals)*Math.PI*2 - Math.PI/2;
    gardenCtx.save();
    gardenCtx.rotate(a);
    gardenCtx.beginPath();
    gardenCtx.moveTo(0, 0);
    gardenCtx.bezierCurveTo(-r*0.22, -r*0.35, -r*0.28, -r*0.75, 0, -r*1.05);
    gardenCtx.bezierCurveTo( r*0.28, -r*0.75,  r*0.22, -r*0.35, 0,  0);
    const pg = gardenCtx.createLinearGradient(0, 0, 0, -r*1.05);
    pg.addColorStop(0, rgba(darken(color,0.4), 0.9));
    pg.addColorStop(0.5, rgba(color, 0.88));
    pg.addColorStop(1, rgba(lighten(color,0.45), 0.85));
    gardenCtx.fillStyle = pg;
    gardenCtx.shadowColor = color;
    gardenCtx.shadowBlur  = 16;
    gardenCtx.fill();
    gardenCtx.restore();
  }
  gardenCtx.restore();
}

function drawPoppy(cx, cy, r, color, bloom) {
  if (bloom <= 0) return;
  const scale = easeOutElastic(Math.min(bloom,1));
  gardenCtx.save();
  gardenCtx.translate(cx, cy);
  gardenCtx.scale(scale, scale);
  const petals = 4;
  for (let i = 0; i < petals; i++) {
    const a = (i/petals)*Math.PI*2;
    gardenCtx.save();
    gardenCtx.rotate(a);
    gardenCtx.beginPath();
    gardenCtx.moveTo(0, 0);
    gardenCtx.bezierCurveTo(-r*0.4, -r*0.25, -r*0.45, -r*0.8, -r*0.1, -r*0.9);
    gardenCtx.bezierCurveTo( r*0.0,  -r*1.0,  r*0.1, -r*0.9, r*0.45, -r*0.8);
    gardenCtx.bezierCurveTo( r*0.4,  -r*0.25,  0, 0, 0, 0);
    const pg = gardenCtx.createLinearGradient(0,0,0,-r);
    pg.addColorStop(0, rgba(darken(color,0.5), 0.9));
    pg.addColorStop(0.4, rgba(color, 0.92));
    pg.addColorStop(1, rgba(lighten(color,0.4), 0.85));
    gardenCtx.fillStyle = pg;
    gardenCtx.shadowColor = color;
    gardenCtx.shadowBlur  = 18;
    gardenCtx.fill();
    gardenCtx.restore();
  }
  const sg = gardenCtx.createRadialGradient(0,-r*0.08,0,0,0,r*0.18);
  sg.addColorStop(0,'#2a1a5a'); sg.addColorStop(1,'#0d0828');
  gardenCtx.beginPath();
  gardenCtx.arc(0, 0, r*0.18, 0, Math.PI*2);
  gardenCtx.fillStyle = sg;
  gardenCtx.shadowColor = '#6600cc';
  gardenCtx.shadowBlur  = 14;
  gardenCtx.fill();
  gardenCtx.restore();
}

function drawHyacinth(cx, cy, r, color, bloom) {
  if (bloom <= 0) return;
  const scale = easeOutElastic(Math.min(bloom,1));
  gardenCtx.save();
  gardenCtx.translate(cx, cy);
  gardenCtx.scale(scale, scale);
  const rows = 5;
  for (let row = 0; row < rows; row++) {
    const rowBloom = Math.max(0, Math.min(1, bloom * rows - row));
    if (rowBloom <= 0) continue;
    const y = -row * r*0.15 - r*0.08;
    const count = Math.max(2, 4 - Math.floor(row/2));
    for (let i = 0; i < count; i++) {
      const angle = (i/count)*Math.PI*2;
      const fx = Math.cos(angle)*r*(0.25 - row*0.025);
      const fy = Math.sin(angle)*r*(0.18 - row*0.02) + y;
      gardenCtx.save();
      gardenCtx.translate(fx, fy);
      for (let p = 0; p < 4; p++) {
        const pa = (p/4)*Math.PI*2;
        gardenCtx.beginPath();
        gardenCtx.ellipse(Math.cos(pa)*r*0.06, Math.sin(pa)*r*0.06, r*0.04, r*0.07, pa, 0, Math.PI*2);
        gardenCtx.fillStyle = rgba(color, 0.85 * rowBloom);
        gardenCtx.shadowColor = color;
        gardenCtx.shadowBlur  = 10;
        gardenCtx.fill();
      }
      gardenCtx.restore();
    }
  }
  gardenCtx.restore();
}

// ── GARDEN STATE ────────────────────────────────────────────────────
const flowerTypes = [
  { color: '#e8003d', type: 'rose' },
  { color: '#ff00aa', type: 'tulip' },
  { color: '#ff6600', type: 'lily' },
  { color: '#ffcc00', type: 'sunflower' },
  { color: '#ff2200', type: 'poppy' },
  { color: '#ffffff', type: 'daisy' },
  { color: '#8833ff', type: 'hyacinth' },
];

const garden = [];
const grassBlades = [];

function initGarden() {
  garden.length = 0;
  const W = flowerCanvas.width;
  const H = flowerCanvas.height;
  
  // Create 2-3 copies of each flower type
  flowerTypes.forEach((flowerType) => {
    const copies = 2 + Math.floor(Math.random() * 2); // 2-3 copies
    for (let c = 0; c < copies; c++) {
      const randomX = Math.random() * W * 0.9 + W * 0.05; // Scattered across width
      const randomY = H * 0.5 + Math.random() * H * 0.35; // Bottom half
      
      garden.push({
        x: randomX,
        y: randomY,
        type: flowerType.type,
        color: flowerType.color,
        size: (W * 0.018 + Math.random() * W * 0.012),
        bloom: 0,
        bloomSpeed: 0.003 + Math.random() * 0.003,
        bloomDelay: Math.random() * 2,
        bobPhase: Math.random() * Math.PI * 2,
        stemHeight: W * 0.08 + Math.random() * W * 0.04,
      });
    }
  });
}

function initGrass() {
  grassBlades.length = 0;
  const W = flowerCanvas.width;
  const H = flowerCanvas.height;
  const grassCount = 40 + Math.floor(Math.random() * 30);
  
  for (let i = 0; i < grassCount; i++) {
    grassBlades.push({
      x: Math.random() * W,
      y: H,
      height: W * 0.03 + Math.random() * W * 0.02,
      lean: Math.random() * Math.PI * 2,
      bobPhase: Math.random() * Math.PI * 2,
      bobSpeed: 0.4 + Math.random() * 0.3,
    });
  }
}

// ── ANIMATION LOOP ───────────────────────────────────────────────
let animationTime = 0;

function animateGarden(ts) {
  const W = flowerCanvas.width;
  const H = flowerCanvas.height;

  gardenCtx.clearRect(0, 0, W, H);
  gardenCtx.shadowBlur = 0;

  animationTime += 0.016; // ~60fps

  // Draw grass first (background)
  for (const blade of grassBlades) {
    const bob = Math.sin(animationTime * blade.bobSpeed + blade.bobPhase) * 1;
    drawGrassBlade(blade.x, blade.y + bob, blade.height, blade.lean + bob*0.05, 0.6);
  }

  // Update and draw flowers
  for (const flower of garden) {
    // Bloom animation with delay
    if (animationTime > flower.bloomDelay && flower.bloom < 1) {
      flower.bloom += flower.bloomSpeed;
    }

    const bloomVal = Math.min(1, Math.max(0, flower.bloom));

    // Gentle bobbing motion
    const bob = Math.sin(animationTime * 0.4 + flower.bobPhase) * 2.5;

    gardenCtx.save();
    gardenCtx.translate(flower.x, flower.y + bob);

    // Draw stem and leaves
    drawStem(0, 0, flower.stemHeight, '#00cc44', bloomVal);

    // Draw the flower based on type
    switch (flower.type) {
      case 'rose':
        drawRose(0, -flower.stemHeight, flower.size, flower.color, bloomVal);
        break;
      case 'tulip':
        drawTulip(0, -flower.stemHeight, flower.size, flower.color, bloomVal);
        break;
      case 'sunflower':
        drawSunflower(0, -flower.stemHeight, flower.size, bloomVal);
        break;
      case 'daisy':
        drawDaisy(0, -flower.stemHeight, flower.size, flower.color, bloomVal);
        break;
      case 'lily':
        drawLily(0, -flower.stemHeight, flower.size, flower.color, bloomVal);
        break;
      case 'poppy':
        drawPoppy(0, -flower.stemHeight, flower.size, flower.color, bloomVal);
        break;
      case 'hyacinth':
        drawHyacinth(0, -flower.stemHeight, flower.size, flower.color, bloomVal);
        break;
    }

    gardenCtx.restore();
  }

  gardenCtx.shadowBlur = 0;
  requestAnimationFrame(animateGarden);
}

// Initialize and start
initGarden();
initGrass();
requestAnimationFrame(animateGarden);

// Export for use in main script
window.flowerGarden = { initGarden, initGrass };
