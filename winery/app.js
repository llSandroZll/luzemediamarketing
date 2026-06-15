'use strict';

/* ═══════════════════════════════════════════════════════════════════════════
   BODEGAS TIERRA DE GIGANTES — Premium Winery Template
   Complete Interactive JavaScript · Vanilla ES6+ · No Dependencies
   ═══════════════════════════════════════════════════════════════════════════ */

/* ─── 0. Inject Critical Styles ─────────────────────────────────────────── */
(function injectStyles() {
  const css = `
    /* Fade-in scroll animations */
    .fade-in {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.7s cubic-bezier(0.23, 1, 0.32, 1),
                  transform 0.7s cubic-bezier(0.23, 1, 0.32, 1);
      will-change: opacity, transform;
    }
    .fade-in.visible {
      opacity: 1;
      transform: translateY(0);
    }

    /* Marquee keyframes */
    @keyframes marquee-scroll {
      0%   { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
    .marquee-track {
      display: flex;
      animation: marquee-scroll 40s linear infinite;
      will-change: transform;
    }
    .marquee-track:hover {
      animation-play-state: paused;
    }

    /* Wine scroll snap */
    .wines-scroll-track {
      scroll-snap-type: x mandatory;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }
    .wines-scroll-track::-webkit-scrollbar { display: none; }
    .wines-scroll-track > * {
      scroll-snap-align: start;
    }

    /* Mobile nav */
    .site-nav.active {
      transform: translateX(0) !important;
      opacity: 1 !important;
      pointer-events: auto !important;
      visibility: visible !important;
    }

    /* Hamburger animation */
    .mobile-menu-btn.open span:nth-child(1) {
      transform: translateY(7px) rotate(45deg);
    }
    .mobile-menu-btn.open span:nth-child(2) {
      opacity: 0;
      transform: scaleX(0);
    }
    .mobile-menu-btn.open span:nth-child(3) {
      transform: translateY(-7px) rotate(-45deg);
    }

    /* Header scroll shadow */
    .site-header.scrolled {
      box-shadow: 0 4px 30px rgba(0,0,0,0.35);
      background: rgba(26,15,10,0.97);
    }

    /* Success overlay */
    .form-success-overlay {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(26,15,10,0.92);
      backdrop-filter: blur(10px);
      opacity: 0;
      transition: opacity 0.5s ease;
      pointer-events: none;
    }
    .form-success-overlay.show {
      opacity: 1;
      pointer-events: auto;
    }
    .form-success-inner {
      text-align: center;
      color: #F5F0E8;
      max-width: 480px;
      padding: 3rem;
      animation: success-pop 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards;
    }
    @keyframes success-pop {
      0%   { opacity: 0; transform: scale(0.85) translateY(20px); }
      100% { opacity: 1; transform: scale(1) translateY(0); }
    }
    .form-success-inner .success-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
      display: block;
    }
    .form-success-inner h3 {
      font-family: 'Playfair Display', serif;
      font-size: 2rem;
      color: #C9A96E;
      margin-bottom: 0.75rem;
    }
    .form-success-inner p {
      font-size: 1.05rem;
      line-height: 1.6;
      color: #D4C9B8;
      margin-bottom: 1.5rem;
    }
    .form-success-close {
      display: inline-block;
      padding: 0.65rem 2.2rem;
      background: linear-gradient(135deg, #C9A96E, #A8894F);
      color: #1A0F0A;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-family: 'Cormorant Garamond', serif;
      font-size: 1.1rem;
      font-weight: 600;
      letter-spacing: 0.5px;
      transition: transform 0.3s, box-shadow 0.3s;
    }
    .form-success-close:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(201,169,110,0.3);
    }

    /* Cave overlay fade */
    .cave-overlay.hidden {
      opacity: 0 !important;
      pointer-events: none !important;
      transition: opacity 0.8s ease;
    }

    /* Lang toggle active */
    .lang-btn.active {
      background: #C9A96E !important;
      color: #1A0F0A !important;
    }

    /* Wine scroll arrows */
    .wines-scroll-arrow {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 10;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      border: 1px solid rgba(201,169,110,0.4);
      background: rgba(26,15,10,0.8);
      color: #C9A96E;
      font-size: 1.3rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      backdrop-filter: blur(6px);
    }
    .wines-scroll-arrow:hover {
      background: rgba(201,169,110,0.2);
      border-color: #C9A96E;
      transform: translateY(-50%) scale(1.08);
    }
    .wines-scroll-arrow.left  { left: -22px; }
    .wines-scroll-arrow.right { right: -22px; }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
})();


/* ─── 1. Scroll-Triggered Fade-In Animations ───────────────────────────── */
(function initFadeAnimations() {
  const targets = document.querySelectorAll('.fade-in');
  if (!targets.length) return;

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const siblings = Array.from(el.parentElement.querySelectorAll('.fade-in'));
      const idx = siblings.indexOf(el);
      const delay = Math.min(idx * 100, 600);
      el.style.transitionDelay = delay + 'ms';
      el.classList.add('visible');
      observer.unobserve(el);
    });
  }, {
    threshold: 0.1,
    rootMargin: '-60px 0px'
  });

  targets.forEach(function (el) { observer.observe(el); });
})();


/* ─── 2. Hero Particle Canvas ───────────────────────────────────────────── */
(function initHeroParticles() {
  var canvas = document.getElementById('hero-particles');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var particles = [];
  var PARTICLE_COUNT = 60;
  var colors = [
    'rgba(201,169,110,0.5)',   // gold
    'rgba(201,169,110,0.3)',
    'rgba(107,29,53,0.35)',    // burgundy
    'rgba(107,29,53,0.2)',
    'rgba(255,255,255,0.15)',  // white
    'rgba(255,255,255,0.08)',
    'rgba(168,137,79,0.3)',    // darker gold
    'rgba(212,201,184,0.12)'   // warm cream
  ];

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.5 + 0.8,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -(Math.random() * 0.35 + 0.08),
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.6 + 0.2,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.008 + 0.003
    };
  }

  function init() {
    resize();
    particles = [];
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += p.pulseSpeed;

      var flicker = 0.7 + Math.sin(p.pulse) * 0.3;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.globalAlpha = p.alpha * flicker;
      ctx.fillStyle = p.color;
      ctx.fill();

      // Wrap edges
      if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  init();
  draw();
})();


/* ─── 3. Marquee Animation ──────────────────────────────────────────────── */
(function initMarquee() {
  var track = document.querySelector('.marquee-track');
  if (!track) return;

  // Duplicate content for seamless loop
  var content = track.innerHTML;
  track.innerHTML = content + content;
})();


/* ─── 4. 360° Cave Viewer ──────────────────────────────────────────────── */
(function initCaveViewer() {
  var canvas = document.getElementById('cave-canvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var viewAngle = 0;
  var targetAngle = 0;
  var zoom = 1;
  var targetZoom = 1;
  var isDragging = false;
  var dragStartX = 0;
  var dragStartAngle = 0;
  var autoRotate = true;
  var hasInteracted = false;
  var animFrame;

  // Cave dimensions
  var CAVE_WIDTH = 3600;

  function resize() {
    canvas.width = canvas.offsetWidth * (window.devicePixelRatio || 1);
    canvas.height = canvas.offsetHeight * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
  }

  // Custom rounded rect fallback
  function drawRoundedRect(cx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    cx.beginPath();
    cx.moveTo(x + r, y);
    cx.lineTo(x + w - r, y);
    cx.quadraticCurveTo(x + w, y, x + w, y + r);
    cx.lineTo(x + w, y + h - r);
    cx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    cx.lineTo(x + r, y + h);
    cx.quadraticCurveTo(x, y + h, x, y + h - r);
    cx.lineTo(x, y + r);
    cx.quadraticCurveTo(x, y, x + r, y);
    cx.closePath();
  }

  // ─ Stone texture generation
  function drawStoneWall(ox, w, h) {
    // Base stone gradient
    var gradient = ctx.createLinearGradient(0, 0, 0, h);
    gradient.addColorStop(0, '#2A1A10');
    gradient.addColorStop(0.3, '#3D2B1A');
    gradient.addColorStop(0.6, '#332211');
    gradient.addColorStop(1, '#1A0F08');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);

    // Stone blocks
    var stoneH = 40;
    var seed = 12345;
    function pseudoRandom() {
      seed = (seed * 16807 + 0) % 2147483647;
      return (seed & 0x7fffffff) / 2147483647;
    }
    seed = 12345; // Reset for consistency

    for (var row = 0; row < h; row += stoneH) {
      var stoneW = 60 + pseudoRandom() * 50;
      var offsetRow = (Math.floor(row / stoneH) % 2) * 30;

      for (var col = -stoneW; col < w + stoneW; col += stoneW) {
        var sx = col + offsetRow + ((ox * 0.5) % stoneW);
        var sy = row;
        var sw = stoneW - 3;
        var sh = stoneH - 3;

        // Stone face
        var brightness = 0.12 + pseudoRandom() * 0.12;
        var warmth = pseudoRandom() * 0.04;
        ctx.fillStyle = 'rgba(' +
          Math.floor(90 + pseudoRandom() * 40) + ',' +
          Math.floor(60 + pseudoRandom() * 30) + ',' +
          Math.floor(35 + pseudoRandom() * 25) + ',' +
          (brightness + warmth) + ')';
        ctx.fillRect(sx, sy, sw, sh);

        // Mortar lines (dark gaps)
        ctx.fillStyle = 'rgba(10,5,2,0.5)';
        ctx.fillRect(sx + sw, sy, 3, sh + 3);
        ctx.fillRect(sx, sy + sh, sw + 3, 3);
      }

      stoneW = 55 + pseudoRandom() * 60;
    }
  }

  // ─ Arched ceiling
  function drawCeiling(w, h) {
    ctx.save();
    var archH = h * 0.30;

    // Dark ceiling gradient
    var ceilGrad = ctx.createLinearGradient(0, 0, 0, archH);
    ceilGrad.addColorStop(0, 'rgba(15,8,4,0.95)');
    ceilGrad.addColorStop(0.5, 'rgba(30,18,10,0.7)');
    ceilGrad.addColorStop(1, 'rgba(50,30,18,0.0)');
    ctx.fillStyle = ceilGrad;
    ctx.fillRect(0, 0, w, archH);

    // Arch ribs
    var archCount = 5;
    var spacing = w / archCount;
    ctx.strokeStyle = 'rgba(60,40,25,0.5)';
    ctx.lineWidth = 6;
    for (var i = 0; i < archCount; i++) {
      var cx = spacing * i + spacing / 2;
      ctx.beginPath();
      ctx.arc(cx, archH * 0.9, spacing * 0.45, Math.PI, 0);
      ctx.stroke();
    }
    ctx.restore();
  }

  // ─ Oak barrels
  function drawBarrel(bx, by, scale) {
    var s = scale || 1;
    var bw = 65 * s;
    var bh = 44 * s;

    ctx.save();
    ctx.translate(bx, by);

    // Barrel body
    var bGrad = ctx.createLinearGradient(0, -bh / 2, 0, bh / 2);
    bGrad.addColorStop(0, '#5C3A1E');
    bGrad.addColorStop(0.3, '#7A4E2A');
    bGrad.addColorStop(0.5, '#8B5E3C');
    bGrad.addColorStop(0.7, '#7A4E2A');
    bGrad.addColorStop(1, '#4D2E14');
    ctx.fillStyle = bGrad;

    // Barrel shape (elliptical)
    ctx.beginPath();
    ctx.ellipse(0, 0, bw / 2, bh / 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Metal bands
    ctx.strokeStyle = '#3A3A3A';
    ctx.lineWidth = 2 * s;
    var bandPositions = [-0.35, -0.12, 0.12, 0.35];
    for (var b = 0; b < bandPositions.length; b++) {
      var bandY = bandPositions[b] * bh;
      ctx.beginPath();
      ctx.ellipse(0, bandY, bw / 2 + 1, 3 * s, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Band highlights
    ctx.strokeStyle = 'rgba(120,120,110,0.35)';
    ctx.lineWidth = 1;
    for (var b2 = 0; b2 < bandPositions.length; b2++) {
      var bandY2 = bandPositions[b2] * bh - 1;
      ctx.beginPath();
      ctx.ellipse(0, bandY2, bw / 2, 2 * s, 0, 0, Math.PI);
      ctx.stroke();
    }

    // Bung hole (center circle)
    ctx.fillStyle = '#2A1A0E';
    ctx.beginPath();
    ctx.arc(0, 0, 5 * s, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#4A3A2A';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.restore();
  }

  // ─ Wine bottle racks
  function drawWineRack(rx, ry, cols, rows) {
    var cellW = 18;
    var cellH = 18;
    var rackW = cols * cellW;
    var rackH = rows * cellH;

    // Frame
    ctx.fillStyle = '#3D2410';
    ctx.fillRect(rx - 3, ry - 3, rackW + 6, rackH + 6);
    ctx.fillStyle = '#2A1808';
    ctx.fillRect(rx, ry, rackW, rackH);

    // Grid lines
    ctx.strokeStyle = '#4A3018';
    ctx.lineWidth = 1;
    for (var c = 0; c <= cols; c++) {
      ctx.beginPath();
      ctx.moveTo(rx + c * cellW, ry);
      ctx.lineTo(rx + c * cellW, ry + rackH);
      ctx.stroke();
    }
    for (var r = 0; r <= rows; r++) {
      ctx.beginPath();
      ctx.moveTo(rx, ry + r * cellH);
      ctx.lineTo(rx + rackW, ry + r * cellH);
      ctx.stroke();
    }

    // Bottles (circles = bottom view)
    for (var br = 0; br < rows; br++) {
      for (var bc = 0; bc < cols; bc++) {
        var bottleX = rx + bc * cellW + cellW / 2;
        var bottleY = ry + br * cellH + cellH / 2;
        var hasbottle = Math.sin(br * 7 + bc * 13) > -0.3;
        if (!hasbottle) continue;

        // Bottle body (dark green/brown circle)
        var hue = Math.sin(br + bc) > 0 ? '#1A2E1A' : '#2A1510';
        ctx.fillStyle = hue;
        ctx.beginPath();
        ctx.arc(bottleX, bottleY, 6, 0, Math.PI * 2);
        ctx.fill();

        // Glass highlight
        ctx.fillStyle = 'rgba(255,255,255,0.08)';
        ctx.beginPath();
        ctx.arc(bottleX - 1.5, bottleY - 1.5, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // ─ Wall torches
  var torchFlicker = 0;
  function drawTorch(tx, ty, time) {
    ctx.save();
    ctx.translate(tx, ty);

    // Bracket
    ctx.fillStyle = '#3A3A3A';
    ctx.fillRect(-3, 0, 6, 25);
    ctx.fillStyle = '#4A4A4A';
    ctx.fillRect(-8, 22, 16, 5);

    // Torch stick
    ctx.fillStyle = '#5C3A1E';
    ctx.fillRect(-4, -20, 8, 22);

    // Flame
    var flicker1 = Math.sin(time * 6 + tx) * 3;
    var flicker2 = Math.cos(time * 8 + tx * 0.5) * 2;
    var flicker3 = Math.sin(time * 12 + tx * 0.3) * 1.5;

    // Outer glow
    var glowGrad = ctx.createRadialGradient(
      flicker1, -35, 2,
      0, -25, 50
    );
    glowGrad.addColorStop(0, 'rgba(255,160,40,0.25)');
    glowGrad.addColorStop(0.5, 'rgba(255,100,20,0.08)');
    glowGrad.addColorStop(1, 'rgba(255,60,10,0)');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(-55, -80, 110, 100);

    // Main flame
    ctx.fillStyle = 'rgba(255,180,50,0.9)';
    ctx.beginPath();
    ctx.moveTo(-6 + flicker2, -20);
    ctx.quadraticCurveTo(-10 + flicker1, -40, flicker3, -55 + flicker1);
    ctx.quadraticCurveTo(10 + flicker2, -40, 6 + flicker1, -20);
    ctx.fill();

    // Inner flame
    ctx.fillStyle = 'rgba(255,220,100,0.95)';
    ctx.beginPath();
    ctx.moveTo(-3 + flicker3, -20);
    ctx.quadraticCurveTo(-5 + flicker2, -35, flicker1 * 0.5, -44 + flicker2);
    ctx.quadraticCurveTo(5 + flicker3, -35, 3 + flicker2, -20);
    ctx.fill();

    // White core
    ctx.fillStyle = 'rgba(255,255,220,0.8)';
    ctx.beginPath();
    ctx.moveTo(-1.5, -20);
    ctx.quadraticCurveTo(-2 + flicker3 * 0.3, -30, flicker1 * 0.2, -36 + flicker3);
    ctx.quadraticCurveTo(2 + flicker2 * 0.3, -30, 1.5, -20);
    ctx.fill();

    ctx.restore();
  }

  // ─ Dust motes
  var dustMotes = [];
  for (var d = 0; d < 30; d++) {
    dustMotes.push({
      x: Math.random() * 1200,
      y: Math.random() * 500,
      r: Math.random() * 1.8 + 0.5,
      speed: Math.random() * 0.15 + 0.05,
      drift: Math.random() * 0.3 - 0.15,
      phase: Math.random() * Math.PI * 2
    });
  }

  // ─ Main render
  var startTime = Date.now();

  function render() {
    var W = canvas.offsetWidth;
    var H = canvas.offsetHeight;
    var dpr = window.devicePixelRatio || 1;

    if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
      canvas.width = W * dpr;
      canvas.height = H * dpr;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var time = (Date.now() - startTime) / 1000;

    // Auto-rotate
    if (autoRotate && !isDragging) {
      targetAngle += 0.12;
    }

    // Smooth follow
    viewAngle += (targetAngle - viewAngle) * 0.08;
    zoom += (targetZoom - zoom) * 0.08;

    var offset = ((viewAngle % CAVE_WIDTH) + CAVE_WIDTH) % CAVE_WIDTH;

    ctx.clearRect(0, 0, W, H);

    // Background
    var bgGrad = ctx.createLinearGradient(0, 0, 0, H);
    bgGrad.addColorStop(0, '#0E0804');
    bgGrad.addColorStop(0.5, '#1A0F08');
    bgGrad.addColorStop(1, '#100A05');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    // Zoom transform
    var zoomScale = 0.7 + zoom * 0.3;
    var cx = W / 2;
    var cy = H / 2;
    ctx.translate(cx, cy);
    ctx.scale(zoomScale, zoomScale);
    ctx.translate(-cx, -cy);

    // ─ Draw stone walls (tiled)
    drawStoneWall(offset, W + 100, H);

    // ─ Ceiling
    drawCeiling(W, H);

    // ─ Floor
    var floorY = H * 0.78;
    var floorGrad = ctx.createLinearGradient(0, floorY, 0, H);
    floorGrad.addColorStop(0, 'rgba(40,25,15,0.0)');
    floorGrad.addColorStop(0.2, 'rgba(30,18,10,0.7)');
    floorGrad.addColorStop(1, 'rgba(15,8,4,0.95)');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, floorY, W, H - floorY);

    // Floor stone pattern
    ctx.strokeStyle = 'rgba(60,40,20,0.15)';
    ctx.lineWidth = 1;
    for (var fi = 0; fi < W; fi += 80) {
      var fx = fi - (offset * 0.3) % 80;
      ctx.beginPath();
      ctx.moveTo(fx, floorY + 20);
      ctx.lineTo(fx, H);
      ctx.stroke();
    }
    for (var fj = floorY + 20; fj < H; fj += 45) {
      ctx.beginPath();
      ctx.moveTo(0, fj);
      ctx.lineTo(W, fj);
      ctx.stroke();
    }

    // ─ Barrel rows (8 barrels in two rows)
    var barrelRow1Y = H * 0.62;
    var barrelRow2Y = H * 0.74;
    var barrelSpacing = CAVE_WIDTH / 5;

    for (var bi = 0; bi < 5; bi++) {
      var bx = (bi * barrelSpacing - offset + CAVE_WIDTH * 2) % CAVE_WIDTH - CAVE_WIDTH / 2 + W / 2;
      if (bx > -80 && bx < W + 80) {
        drawBarrel(bx, barrelRow1Y, 1.0);
      }
    }

    for (var bi2 = 0; bi2 < 4; bi2++) {
      var bx2 = ((bi2 + 0.5) * barrelSpacing - offset + CAVE_WIDTH * 2) % CAVE_WIDTH - CAVE_WIDTH / 2 + W / 2;
      if (bx2 > -80 && bx2 < W + 80) {
        drawBarrel(bx2, barrelRow2Y, 0.85);
      }
    }

    // ─ Wine racks
    var rackSpacing = CAVE_WIDTH / 3;
    for (var ri = 0; ri < 3; ri++) {
      var rx = (ri * rackSpacing + rackSpacing / 2 - offset + CAVE_WIDTH * 2) % CAVE_WIDTH - CAVE_WIDTH / 2 + W / 2;
      if (rx > -100 && rx < W + 100) {
        drawWineRack(rx, H * 0.28, 7, 5);
        drawWineRack(rx + 140, H * 0.32, 5, 4);
      }
    }

    // ─ Torches
    var torchSpacing = CAVE_WIDTH / 2;
    for (var ti = 0; ti < 2; ti++) {
      var torchX = (ti * torchSpacing + torchSpacing / 2 - offset + CAVE_WIDTH * 2) % CAVE_WIDTH - CAVE_WIDTH / 2 + W / 2;
      if (torchX > -60 && torchX < W + 60) {
        drawTorch(torchX, H * 0.28, time);
      }
    }

    // ─ Dust motes
    ctx.globalAlpha = 0.6;
    for (var di = 0; di < dustMotes.length; di++) {
      var mote = dustMotes[di];
      mote.y -= mote.speed;
      mote.x += mote.drift + Math.sin(time * 0.5 + mote.phase) * 0.2;
      mote.phase += 0.01;

      if (mote.y < -10) { mote.y = H + 10; mote.x = Math.random() * W; }

      var moteAlpha = 0.3 + Math.sin(time * 2 + mote.phase) * 0.2;
      ctx.fillStyle = 'rgba(201,169,110,' + moteAlpha + ')';
      ctx.beginPath();
      ctx.arc(
        (mote.x - offset * 0.1 + W * 2) % (W + 40) - 20,
        mote.y,
        mote.r,
        0, Math.PI * 2
      );
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    ctx.restore();

    // ─ Deep vignette
    var vigGrad = ctx.createRadialGradient(W / 2, H / 2, W * 0.15, W / 2, H / 2, W * 0.75);
    vigGrad.addColorStop(0, 'rgba(0,0,0,0)');
    vigGrad.addColorStop(0.5, 'rgba(0,0,0,0.15)');
    vigGrad.addColorStop(0.8, 'rgba(0,0,0,0.5)');
    vigGrad.addColorStop(1, 'rgba(0,0,0,0.82)');
    ctx.fillStyle = vigGrad;
    ctx.fillRect(0, 0, W, H);

    animFrame = requestAnimationFrame(render);
  }

  // ─ Interaction handlers
  function onFirstInteraction() {
    if (hasInteracted) return;
    hasInteracted = true;
    autoRotate = false;
    var overlay = document.querySelector('.cave-overlay');
    if (overlay) overlay.classList.add('hidden');
  }

  // Mouse drag
  canvas.addEventListener('mousedown', function (e) {
    isDragging = true;
    dragStartX = e.clientX;
    dragStartAngle = targetAngle;
    onFirstInteraction();
    canvas.style.cursor = 'grabbing';
  });
  window.addEventListener('mousemove', function (e) {
    if (!isDragging) return;
    var dx = e.clientX - dragStartX;
    targetAngle = dragStartAngle - dx * 1.5;
  });
  window.addEventListener('mouseup', function () {
    isDragging = false;
    canvas.style.cursor = 'grab';
  });

  // Touch drag
  canvas.addEventListener('touchstart', function (e) {
    isDragging = true;
    dragStartX = e.touches[0].clientX;
    dragStartAngle = targetAngle;
    onFirstInteraction();
  }, { passive: true });
  canvas.addEventListener('touchmove', function (e) {
    if (!isDragging) return;
    var dx = e.touches[0].clientX - dragStartX;
    targetAngle = dragStartAngle - dx * 1.5;
  }, { passive: true });
  canvas.addEventListener('touchend', function () { isDragging = false; });

  // Control buttons
  var leftBtn = document.getElementById('cave-left');
  var rightBtn = document.getElementById('cave-right');
  var zoomInBtn = document.getElementById('cave-zoom-in');
  var zoomOutBtn = document.getElementById('cave-zoom-out');

  if (leftBtn) leftBtn.addEventListener('click', function () {
    targetAngle -= 120;
    onFirstInteraction();
  });
  if (rightBtn) rightBtn.addEventListener('click', function () {
    targetAngle += 120;
    onFirstInteraction();
  });
  if (zoomInBtn) zoomInBtn.addEventListener('click', function () {
    targetZoom = Math.min(targetZoom + 0.25, 2.5);
    onFirstInteraction();
  });
  if (zoomOutBtn) zoomOutBtn.addEventListener('click', function () {
    targetZoom = Math.max(targetZoom - 0.25, 0.6);
    onFirstInteraction();
  });

  canvas.style.cursor = 'grab';
  render();
})();


/* ─── 5. Wine Cards Horizontal Scroll + Arrows ─────────────────────────── */
(function initWineScroll() {
  var track = document.querySelector('.wines-scroll-track');
  if (!track) return;

  var wrapper = track.parentElement;
  if (wrapper) wrapper.style.position = 'relative';

  // Create arrow buttons
  function createArrow(dir) {
    var btn = document.createElement('button');
    btn.className = 'wines-scroll-arrow ' + dir;
    btn.setAttribute('aria-label', 'Scroll ' + dir);
    btn.innerHTML = dir === 'left' ? '&#8249;' : '&#8250;';
    btn.addEventListener('click', function () {
      var cardWidth = track.querySelector('.wine-card, [class*="wine"]');
      var scrollAmount = cardWidth ? cardWidth.offsetWidth + 24 : 340;
      track.scrollBy({
        left: dir === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    });
    return btn;
  }

  if (wrapper) {
    wrapper.appendChild(createArrow('left'));
    wrapper.appendChild(createArrow('right'));
  }
})();


/* ─── 6. Tasting Reservation Form ──────────────────────────────────────── */
(function initTastingForm() {
  var form = document.getElementById('tasting-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var btn = form.querySelector('[type="submit"], button');
    var originalText = btn ? btn.textContent : '';
    if (btn) {
      btn.textContent = 'Reservando...';
      btn.disabled = true;
      btn.style.opacity = '0.7';
    }

    setTimeout(function () {
      // Gather form data
      var fd = new FormData(form);
      var name = fd.get('name') || fd.get('nombre') || '';
      var date = fd.get('date') || fd.get('fecha') || '';
      var guests = fd.get('guests') || fd.get('personas') || '';

      // WhatsApp link
      var msg = encodeURIComponent(
        '¡Hola! Soy ' + name + '. Quiero reservar una cata para ' +
        guests + ' personas el día ' + date + '. ¿Está disponible?'
      );
      var waLink = 'https://wa.me/34651122982?text=' + msg;

      showSuccessOverlay(
        '¡Reserva Recibida!',
        'Nos pondremos en contacto contigo pronto para confirmar tu experiencia de cata.',
        waLink
      );

      // Reset
      form.reset();
      if (btn) {
        btn.textContent = originalText;
        btn.disabled = false;
        btn.style.opacity = '1';
      }
    }, 1200);
  });
})();


/* ─── 7. Contact Form ───────────────────────────────────────────────────── */
(function initContactForm() {
  var form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var btn = form.querySelector('[type="submit"], button');
    var originalText = btn ? btn.textContent : '';
    if (btn) {
      btn.textContent = 'Enviando...';
      btn.disabled = true;
      btn.style.opacity = '0.7';
    }

    setTimeout(function () {
      showSuccessOverlay(
        '¡Mensaje Enviado!',
        'Gracias por contactarnos. Te responderemos en un plazo de 24 horas.'
      );

      form.reset();
      if (btn) {
        btn.textContent = originalText;
        btn.disabled = false;
        btn.style.opacity = '1';
      }
    }, 1200);
  });
})();


/* ─── Success Overlay Helper ────────────────────────────────────────────── */
function showSuccessOverlay(title, message, waLink) {
  // Remove existing
  var existing = document.querySelector('.form-success-overlay');
  if (existing) existing.remove();

  var overlay = document.createElement('div');
  overlay.className = 'form-success-overlay';
  overlay.innerHTML =
    '<div class="form-success-inner">' +
      '<span class="success-icon">✦</span>' +
      '<h3>' + title + '</h3>' +
      '<p>' + message + '</p>' +
      (waLink
        ? '<a href="' + waLink + '" target="_blank" rel="noopener" class="form-success-close" style="margin-right:10px;text-decoration:none;">Confirmar por WhatsApp</a>'
        : '') +
      '<button class="form-success-close">Cerrar</button>' +
    '</div>';

  document.body.appendChild(overlay);

  // Trigger animation
  requestAnimationFrame(function () {
    overlay.classList.add('show');
  });

  // Close handlers
  var closeBtns = overlay.querySelectorAll('.form-success-close');
  closeBtns.forEach(function (btn) {
    if (btn.tagName === 'BUTTON') {
      btn.addEventListener('click', function () {
        overlay.classList.remove('show');
        setTimeout(function () { overlay.remove(); }, 500);
      });
    }
  });

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) {
      overlay.classList.remove('show');
      setTimeout(function () { overlay.remove(); }, 500);
    }
  });
}


/* ─── 8. Mobile Navigation ──────────────────────────────────────────────── */
(function initMobileNav() {
  var btn = document.getElementById('mobile-menu-btn');
  var nav = document.querySelector('.site-nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', function () {
    nav.classList.toggle('active');
    btn.classList.toggle('open');
  });

  // Close on link click
  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('active');
      btn.classList.remove('open');
    });
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (!nav.contains(e.target) && !btn.contains(e.target)) {
      nav.classList.remove('active');
      btn.classList.remove('open');
    }
  });
})();

/* ─── 9. Bilingual i18n System ─────────────────────────────────────────── */
(function initI18n() {
  var i18n = {
    es: {
      // Navigation
      'nav.historia': 'Historia',
      'nav.vinos': 'Nuestros Vinos',
      'nav.cueva': 'La Cueva',
      'nav.catas': 'Catas',
      'nav.premios': 'Premios',
      'nav.reservar': 'Reservar Visita',

      // Hero
      'hero.overline': 'D.O. La Mancha · Desde 1952 · Campo de Criptana',
      'hero.title': 'Donde la vid<br>abraza la<br><em>historia.</em>',
      'hero.subtitle': 'Bajo los molinos de viento de Criptana, nuestras cuevas guardan el alma de tres generaciones dedicadas a la tierra, la uva y el tiempo lento que solo La Mancha sabe ofrecer.',
      'hero.cta1': 'Explorar Nuestros Vinos',
      'hero.cta2': 'Tour Virtual 360°',
      'hero.scroll': 'Scroll',

      // Story
      'story.overline': 'Nuestra Historia',
      'story.title': 'Tres generaciones,<br>una sola pasión.',
      'story.p1': 'En 1952, Don Rafael Martínez cavó con sus propias manos las primeras galerías bajo la tierra arcillosa de Campo de Criptana. No buscaba oro, sino las condiciones perfectas —la oscuridad constante, la humedad justa, el silencio absoluto— para que el vino madurara con la paciencia que solo esta llanura infinita enseña. Aquellas cuevas, excavadas a ocho metros de profundidad, siguen siendo hoy el corazón de nuestra bodega.',
      'story.p2': 'Hoy, la tercera generación continúa aquel legado con la misma convicción: que el mejor vino nace de un diálogo sincero entre la vid, el clima extremo de La Mancha y la mano del viticultor. Cultivamos cepas viejas de Tempranillo y Airén en suelos calcáreos que aportan mineralidad y carácter, y vinificamos con la filosofía de mínima intervención. Cada botella es un fragmento de esta tierra de gigantes.',
      'story.quote': '"El vino es la memoria líquida de esta tierra."',

      // Timeline
      'timeline.1952.title': 'Fundación',
      'timeline.1952.desc': 'Don Rafael Martínez excava las primeras cuevas y planta sus viñedos en la solana de Criptana.',
      'timeline.1978.title': 'Primera exportación',
      'timeline.1978.desc': 'Nuestros tintos cruzan fronteras por primera vez hacia Alemania y Países Bajos.',
      'timeline.2003.title': 'Bodega moderna',
      'timeline.2003.desc': 'Inauguramos la nueva sala de vinificación con depósitos de acero y barricas de roble francés.',
      'timeline.2024.title': 'Tour Virtual 360°',
      'timeline.2024.desc': 'Abrimos nuestras cuevas al mundo con una experiencia inmersiva digital.',

      // Wines header & card CTA
      'wines.overline': 'Nuestros Vinos',
      'wines.title': 'Expresión pura<br>de La Mancha.',
      'wine.cta': 'Pedir por WhatsApp',

      // Wines
      'wine1.varietal': 'Tempranillo',
      'wine1.name': 'Gigante Tempranillo Crianza',
      'wine1.desc': 'Cereza intensa, taninos nobles, recuerdos de cuero y vainilla sobre un fondo de fruta madura.',
      'wine1.price': '€12.90',

      'wine2.varietal': 'Airén',
      'wine2.name': 'Gigante Airén Joven',
      'wine2.desc': 'Fresco, floral, terroir puro. Notas de manzana verde y un final limpio y mineral.',
      'wine2.price': '€7.50',

      'wine3.varietal': 'Syrah',
      'wine3.name': 'Gigante Syrah Reserva',
      'wine3.desc': 'Especiado, profundo, elegante. Pimienta negra, mora silvestre y un toque ahumado persistente.',
      'wine3.price': '€18.90',

      'wine4.varietal': 'Verdejo',
      'wine4.name': 'Molino Blanco Verdejo',
      'wine4.desc': 'Cítrico, mineral, vibrante. Lima, hinojo silvestre y un paso de boca fresco y persistente.',
      'wine4.price': '€9.90',

      'wine5.varietal': 'Cabernet Sauvignon',
      'wine5.name': 'Gran Gigante Cabernet',
      'wine5.desc': 'Roble francés, 14 meses. Cassis, cedro y chocolate negro en un final largo y aterciopelado.',
      'wine5.price': '€24.50',

      'wine6.varietal': 'Garnacha & Tempranillo',
      'wine6.name': 'Dulcinea Rosado',
      'wine6.desc': 'Fresa, pétalos, frescura. Sutil y elegante, con un final que invita a otra copa al atardecer.',
      'wine6.price': '€8.90',

      // Cave
      'cave.overline': 'La Cueva',
      'cave.title': 'Bajo tierra,<br>nace el carácter.',
      'cave.desc': 'A ocho metros bajo la superficie, nuestras cuevas excavadas en roca caliza mantienen una temperatura constante de 14 °C y una humedad del 80 %, creando el entorno perfecto para la crianza de nuestros vinos más especiales. Explora este espacio centenario en 360°.',
      'cave.drag': 'Arrastra para explorar la cueva · Usa los controles para navegar',
      'cave.hotspot1': 'Barricas de Roble Francés',
      'cave.hotspot1.label': 'Barricas de Roble Francés',
      'cave.hotspot2': 'Galería Original de 1952',
      'cave.hotspot2.label': 'Galería Original de 1952',

      // Tasting
      'tasting.overline': 'Experiencia',
      'tasting.title': 'Reserva tu cata privada.',
      'tasting.desc': '2 horas, 5 vinos, cueva subterránea, maridaje con queso manchego artesanal. Desde €25 por persona. Una experiencia íntima donde descubrirás los secretos de nuestra tierra.',
      'tasting.form.name': 'Nombre completo',
      'tasting.form.name.placeholder': 'Tu nombre',
      'tasting.form.phone': 'Teléfono',
      'tasting.form.phone.placeholder': '+34 600 000 000',
      'tasting.form.date': 'Fecha preferida',
      'tasting.form.group': 'Tamaño del grupo',
      'tasting.form.group.placeholder': 'Selecciona',
      'tasting.form.group.small': '2 – 4 personas',
      'tasting.form.group.medium': '5 – 8 personas',
      'tasting.form.group.large': '9 – 15 personas',
      'tasting.form.notes': 'Notas o peticiones especiales',
      'tasting.form.notes.placeholder': 'Alergias, celebraciones, preferencias…',
      'tasting.form.submit': 'Solicitar Reserva',

      // Awards
      'awards.overline': 'Reconocimientos',
      'awards.title': 'Nuestros vinos<br>hablan por sí solos.',
      'award1.wine': 'Gigante Syrah Reserva',
      'award1.name': 'Bacchus Oro 2023',
      'award2.wine': 'Gran Gigante Cabernet',
      'award2.name': 'Mundus Vini Silver 2022',
      'award3.wine': 'Bodega',
      'award3.name': 'Best La Mancha Winery 2021',
      'award4.wine': 'Gigante Tempranillo Crianza',
      'award4.name': 'Decanter Bronze 2023',
      'award5.wine': 'Dulcinea Rosado',
      'award5.name': 'Berliner Wein Trophy Gold 2024',
      'award6.wine': 'Molino Blanco Verdejo',
      'award6.name': 'Gilbert & Gaillard Gold 2023',

      // Contact
      'contact.overline': 'Contacto',
      'contact.title': 'Visítanos en Criptana.',
      'contact.desc': 'Estamos en el corazón de La Mancha, rodeados de viñedos y molinos de viento. Ven a conocer nuestras cuevas, pasea entre las cepas y descubre por qué esta tierra produce vinos con alma propia.',
      'contact.address.label': 'Dirección',
      'contact.address': 'Ctra. Pedro Muñoz km 3.5<br>13610 Campo de Criptana, Ciudad Real',
      'contact.phone.label': 'Teléfono',
      'contact.phone': '+34 926 56 00 00',
      'contact.email.label': 'Email',
      'contact.email': 'info@tierradegigantes.es',
      'contact.whatsapp.label': 'WhatsApp',
      'contact.whatsapp': '+34 651 122 982',
      'social.instagram': 'Instagram',
      'social.facebook': 'Facebook',
      'social.youtube': 'YouTube',

      'contact.form.name': 'Nombre',
      'contact.form.name.placeholder': 'Tu nombre',
      'contact.form.email': 'Email',
      'contact.form.email.placeholder': 'tu@email.com',
      'contact.form.phone': 'Teléfono',
      'contact.form.phone.placeholder': '+34 600 000 000',
      'contact.form.subject': 'Asunto',
      'contact.form.subject.placeholder': 'Selecciona un motivo',
      'contact.form.subject.visit': 'Visita a la bodega',
      'contact.form.subject.buy': 'Compra de vinos',
      'contact.form.subject.collab': 'Colaboración',
      'contact.form.subject.other': 'Otro',
      'contact.form.message': 'Mensaje',
      'contact.form.message.placeholder': '¿En qué podemos ayudarte?',
      'contact.form.submit': 'Enviar Mensaje',

      // Footer
      'footer.copy': '© 2026 Bodegas Tierra de Gigantes — Elaborado en Campo de Criptana',
      'footer.legal.privacy': 'Política de Privacidad',
      'footer.legal.cookies': 'Cookies',
      'footer.legal.terms': 'Aviso Legal',
      'footer.credit': 'Sitio web creado por LUZE Media Marketing'
    },

    en: {
      // Navigation
      'nav.historia': 'Story',
      'nav.vinos': 'Our Wines',
      'nav.cueva': 'The Cave',
      'nav.catas': 'Tastings',
      'nav.premios': 'Awards',
      'nav.reservar': 'Book Visit',

      // Hero
      'hero.overline': 'D.O. La Mancha · Since 1952 · Campo de Criptana',
      'hero.title': 'Where the vine<br>embraces<br><em>history.</em>',
      'hero.subtitle': 'Under the windmills of Criptana, our caves guard the soul of three generations dedicated to the land, the grape, and the slow time that only La Mancha can offer.',
      'hero.cta1': 'Explore Our Wines',
      'hero.cta2': '360° Virtual Tour',
      'hero.scroll': 'Scroll',

      // Story
      'story.overline': 'Our Story',
      'story.title': 'Three generations,<br>one single passion.',
      'story.p1': 'In 1952, Don Rafael Martínez excavated the first galleries with his own hands under the clay earth of Campo de Criptana. He did not seek gold, but the perfect conditions —constant darkness, precise humidity, absolute silence— for wine to mature with the patience that only this infinite plain teaches. Those caves, excavated eight meters deep, remain the heart of our winery today.',
      'story.p2': 'Today, the third generation continues that legacy with the same conviction: that the best wine is born of a sincere dialogue between the vine, the extreme climate of La Mancha, and the hand of the grower. We cultivate old Tempranillo and Airén vines in calcareous soils that provide minerality and character, and we vinify with a philosophy of minimal intervention. Each bottle is a fragment of this land of giants.',
      'story.quote': '"Wine is the liquid memory of this land."',

      // Timeline
      'timeline.1952.title': 'Founding',
      'timeline.1952.desc': 'Don Rafael Martínez excavates the first caves and plants his vineyards in the sunny plains of Criptana.',
      'timeline.1978.title': 'First export',
      'timeline.1978.desc': 'Our red wines cross borders for the first time, heading to Germany and the Netherlands.',
      'timeline.2003.title': 'Modern winery',
      'timeline.2003.desc': 'We inaugurate the new vinification room with stainless steel tanks and French oak barrels.',
      'timeline.2024.title': '360° Virtual Tour',
      'timeline.2024.desc': 'We open our caves to the world with a digital immersive experience.',

      // Wines header & card CTA
      'wines.overline': 'Our Wines',
      'wines.title': 'Pure expression<br>of La Mancha.',
      'wine.cta': 'Order via WhatsApp',

      // Wines
      'wine1.varietal': 'Tempranillo',
      'wine1.name': 'Gigante Tempranillo Crianza',
      'wine1.desc': 'Intense cherry, noble tannins, hints of leather and vanilla over a background of ripe fruit.',
      'wine1.price': '€12.90',

      'wine2.varietal': 'Airén',
      'wine2.name': 'Gigante Airén Joven',
      'wine2.desc': 'Fresh, floral, pure terroir. Notes of green apple and a clean, mineral finish.',
      'wine2.price': '€7.50',

      'wine3.varietal': 'Syrah',
      'wine3.name': 'Gigante Syrah Reserva',
      'wine3.desc': 'Spicy, deep, elegant. Black pepper, wild blackberry, and a persistent smoky touch.',
      'wine3.price': '€18.90',

      'wine4.varietal': 'Verdejo',
      'wine4.name': 'Molino Blanco Verdejo',
      'wine4.desc': 'Citric, mineral, vibrant. Lime, wild fennel, and a fresh and persistent mouthfeel.',
      'wine4.price': '€9.90',

      'wine5.varietal': 'Cabernet Sauvignon',
      'wine5.name': 'Gran Gigante Cabernet',
      'wine5.desc': 'French oak, 14 months. Cassis, cedar, and dark chocolate in a long, velvety finish.',
      'wine5.price': '€24.50',

      'wine6.varietal': 'Garnacha & Tempranillo',
      'wine6.name': 'Dulcinea Rosado',
      'wine6.desc': 'Strawberry, petals, freshness. Subtle and elegant, with a finish that invites another glass at sunset.',
      'wine6.price': '€8.90',

      // Cave
      'cave.overline': 'The Cave',
      'cave.title': 'Underground,<br>character is born.',
      'cave.desc': 'Eight meters below the surface, our caves excavated in limestone rock maintain a constant temperature of 14 °C and 80% humidity, creating the perfect environment for aging our most special wines. Explore this century-old space in 360°.',
      'cave.drag': 'Drag to explore the cave · Use the controls to navigate',
      'cave.hotspot1': 'French Oak Barrels',
      'cave.hotspot1.label': 'French Oak Barrels',
      'cave.hotspot2': 'Original 1952 Gallery',
      'cave.hotspot2.label': 'Original 1952 Gallery',

      // Tasting
      'tasting.overline': 'Experience',
      'tasting.title': 'Book your private tasting.',
      'tasting.desc': '2 hours, 5 wines, underground cave, pairing with artisanal Manchego cheese. From €25 per person. An intimate experience where you will discover the secrets of our land.',
      'tasting.form.name': 'Full name',
      'tasting.form.name.placeholder': 'Your name',
      'tasting.form.phone': 'Phone',
      'tasting.form.phone.placeholder': '+34 600 000 000',
      'tasting.form.date': 'Preferred date',
      'tasting.form.group': 'Group size',
      'tasting.form.group.placeholder': 'Select size',
      'tasting.form.group.small': '2 – 4 people',
      'tasting.form.group.medium': '5 – 8 people',
      'tasting.form.group.large': '9 – 15 people',
      'tasting.form.notes': 'Special requests or notes',
      'tasting.form.notes.placeholder': 'Allergies, celebrations, preferences…',
      'tasting.form.submit': 'Request Booking',

      // Awards
      'awards.overline': 'Achievements',
      'awards.title': 'Our wines<br>speak for themselves.',
      'award1.wine': 'Gigante Syrah Reserva',
      'award1.name': 'Bacchus Gold 2023',
      'award2.wine': 'Gran Gigante Cabernet',
      'award2.name': 'Mundus Vini Silver 2022',
      'award3.wine': 'Winery',
      'award3.name': 'Best La Mancha Winery 2021',
      'award4.wine': 'Gigante Tempranillo Crianza',
      'award4.name': 'Decanter Bronze 2023',
      'award5.wine': 'Dulcinea Rosado',
      'award5.name': 'Berliner Wein Trophy Gold 2024',
      'award6.wine': 'Molino Blanco Verdejo',
      'award6.name': 'Gilbert & Gaillard Gold 2023',

      // Contact
      'contact.overline': 'Get in Touch',
      'contact.title': 'Visit us in Criptana.',
      'contact.desc': 'We are in the heart of La Mancha, surrounded by vineyards and windmills. Come and see our caves, walk among the vines, and discover why this land produces wines with a soul of their own.',
      'contact.address.label': 'Address',
      'contact.address': 'Ctra. Pedro Muñoz km 3.5<br>13610 Campo de Criptana, Ciudad Real',
      'contact.phone.label': 'Phone',
      'contact.phone': '+34 926 56 00 00',
      'contact.email.label': 'Email',
      'contact.email': 'info@tierradegigantes.es',
      'contact.whatsapp.label': 'WhatsApp',
      'contact.whatsapp': '+34 651 122 982',
      'social.instagram': 'Instagram',
      'social.facebook': 'Facebook',
      'social.youtube': 'YouTube',

      'contact.form.name': 'Name',
      'contact.form.name.placeholder': 'Your name',
      'contact.form.email': 'Email',
      'contact.form.email.placeholder': 'you@email.com',
      'contact.form.phone': 'Phone',
      'contact.form.phone.placeholder': '+34 600 000 000',
      'contact.form.subject': 'Subject',
      'contact.form.subject.placeholder': 'Select a reason',
      'contact.form.subject.visit': 'Winery visit',
      'contact.form.subject.buy': 'Wine purchase',
      'contact.form.subject.collab': 'Collaboration',
      'contact.form.subject.other': 'Other',
      'contact.form.message': 'Message',
      'contact.form.message.placeholder': 'How can we help you?',
      'contact.form.submit': 'Send Message',

      // Footer
      'footer.copy': '© 2026 Bodegas Tierra de Gigantes — Elaborated in Campo de Criptana',
      'footer.legal.privacy': 'Privacy Policy',
      'footer.legal.cookies': 'Cookies Policy',
      'footer.legal.terms': 'Legal Notice',
      'footer.credit': 'Website created by LUZE Media Marketing'
    }
  };

  var currentLang = 'es';

  function applyTranslations(lang) {
    currentLang = lang;
    var dict = i18n[lang];
    if (!dict) return;

    document.querySelectorAll('[data-key]').forEach(function (el) {
      var key = el.getAttribute('data-key');
      if (!dict[key]) return;

      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.setAttribute('placeholder', dict[key]);
      } else {
        el.innerHTML = dict[key];
      }
    });

    // Update lang buttons active state
    var btnEs = document.getElementById('btn-es');
    var btnEn = document.getElementById('btn-en');
    if (btnEs) btnEs.classList.toggle('active', lang === 'es');
    if (btnEn) btnEn.classList.toggle('active', lang === 'en');

    document.documentElement.setAttribute('lang', lang);
  }

  // Bind toggle buttons
  var btnEs = document.getElementById('btn-es');
  var btnEn = document.getElementById('btn-en');

  if (btnEs) btnEs.addEventListener('click', function () { applyTranslations('es'); });
  if (btnEn) btnEn.addEventListener('click', function () { applyTranslations('en'); });

  // Set initial language
  applyTranslations('es');
})();


/* ─── 12. Wine Card WhatsApp Links ──────────────────────────────────────── */
(function initWineWhatsApp() {
  document.querySelectorAll('.wine-buy-btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      var card = btn.closest('.wine-card') || btn.parentElement;
      var nameEl = card ? card.querySelector('.wine-name') : null;
      var wineName = nameEl ? nameEl.textContent.trim() : 'uno de vuestros vinos';

      var msg = encodeURIComponent(
        '¡Hola! Quiero pedir ' + wineName + '. ¿Está disponible?'
      );
      var url = 'https://wa.me/34651122982?text=' + msg;
      window.open(url, '_blank', 'noopener');
    });
  });
})();


/* ─── 13. Count-Up Animation ────────────────────────────────────────────── */
(function initCountUp() {
  var counters = document.querySelectorAll('.count-up');
  if (!counters.length) return;

  function animateCount(el) {
    var raw = el.getAttribute('data-target') || el.textContent;
    // Parse numeric value and suffix (e.g. "70+" → 70, "+")
    var match = raw.match(/^(\d+)(.*)$/);
    if (!match) return;

    var target = parseInt(match[1], 10);
    var suffix = match[2] || '';
    var duration = 2000;
    var startTime = null;
    var startVal = 0;

    function ease(t) {
      return t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var easedProgress = ease(progress);
      var current = Math.floor(startVal + (target - startVal) * easedProgress);
      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      animateCount(entry.target);
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.3
  });

  counters.forEach(function (el) { observer.observe(el); });
})();


/* ─── Utility: Passive Scroll Performance ───────────────────────────────── */
(function optimizeScrollListeners() {
  // Ensure any dynamically added scroll/touch listeners use passive
  var origAdd = EventTarget.prototype.addEventListener;
  var passiveEvents = { touchstart: true, touchmove: true, wheel: true };

  EventTarget.prototype.addEventListener = function (type, fn, opts) {
    if (passiveEvents[type] && typeof opts !== 'object') {
      opts = { passive: true, capture: !!opts };
    }
    return origAdd.call(this, type, fn, opts);
  };
})();


/* ─── Console Branding ──────────────────────────────────────────────────── */
(function consoleBranding() {
  var styles = [
    'color: #C9A96E',
    'font-size: 14px',
    'font-family: Georgia, serif',
    'padding: 8px 0',
    'font-weight: bold'
  ].join(';');

  console.log(
    '%c🍷 Bodegas Tierra de Gigantes — Campo de Criptana\n' +
    '%cDesarrollado con pasión por la tierra manchega.',
    styles,
    'color: #8B7355; font-size: 11px; font-family: Georgia, serif;'
  );
})();
