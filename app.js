/* ============================================================
   LUZE Media Marketing — app.js
   Full interactivity: cursor, particles, parallax, counters,
   360 viewer, calculator, language, form
   ============================================================ */

'use strict';

// ===== CUSTOM CURSOR =====
(function initCursor() {
    const dot  = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    if (!dot || !ring) return;

    let mx = -100, my = -100;
    let rx = -100, ry = -100;
    let raf;

    document.addEventListener('mousemove', e => {
        mx = e.clientX;
        my = e.clientY;
        dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    });

    function animateRing() {
        rx += (mx - rx) * 0.13;
        ry += (my - ry) * 0.13;
        ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
        raf = requestAnimationFrame(animateRing);
    }
    animateRing();

    // Stuck Cursor Edge Protection
    document.addEventListener('mouseleave', () => {
        dot.style.opacity = '0';
        ring.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        dot.style.opacity = '1';
        ring.style.opacity = '1';
    });

    // Hover states
    document.addEventListener('mouseover', e => {
        const el = e.target.closest('a, button, .magnetic, .service-card, .vision-card, .hotspot');
        if (el) {
            ring.classList.add('hover');
            dot.classList.add('hover');
        }
    });
    document.addEventListener('mouseout', e => {
        const el = e.target.closest('a, button, .magnetic, .service-card, .vision-card, .hotspot');
        if (el) {
            ring.classList.remove('hover');
            dot.classList.remove('hover');
        }
    });
})();

// Add cursor CSS dynamically
(function injectCursorCSS() {
    const style = document.createElement('style');
    style.textContent = `
        * { cursor: none !important; }
        .cursor-dot {
            position: fixed; top: 0; left: 0;
            width: 6px; height: 6px;
            background: #F5A623;
            border-radius: 50%;
            pointer-events: none;
            z-index: 99999;
            transition: width 0.3s, height 0.3s, background 0.3s, opacity 0.3s;
            will-change: transform;
        }
        .cursor-ring {
            position: fixed; top: 0; left: 0;
            width: 36px; height: 36px;
            border: 1.5px solid rgba(245,166,35,0.5);
            border-radius: 50%;
            pointer-events: none;
            z-index: 99998;
            transition: width 0.4s, height 0.4s, border-color 0.4s, opacity 0.3s;
            will-change: transform;
        }
        .cursor-dot.hover { width: 10px; height: 10px; background: #fff; }
        .cursor-ring.hover {
            width: 56px; height: 56px;
            border-color: rgba(245,166,35,0.8);
            background: rgba(245,166,35,0.06);
        }
    `;
    document.head.appendChild(style);
})();

// ===== HERO PARTICLE CANVAS =====
(function initParticles() {
    const canvas = document.getElementById('hero-particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.style.cssText = `
        position:absolute; inset:0; width:100%; height:100%;
        pointer-events:none; z-index:0; opacity:0.5;
    `;

    let W, H, particles = [];
    const COUNT = 80;

    function resize() {
        W = canvas.width  = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
    }

    function createParticle() {
        return {
            x: Math.random() * W,
            y: Math.random() * H,
            r: Math.random() * 1.8 + 0.3,
            dx: (Math.random() - 0.5) * 0.3,
            dy: -Math.random() * 0.4 - 0.1,
            alpha: Math.random() * 0.6 + 0.1,
            color: Math.random() > 0.7 ? '#F5A623' : '#7B5EA7'
        };
    }

    function init() {
        particles = Array.from({ length: COUNT }, createParticle);
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.fill();
            ctx.globalAlpha = 1;

            p.x += p.dx;
            p.y += p.dy;

            if (p.y < -5) { Object.assign(p, createParticle(), { y: H + 5 }); }
            if (p.x < 0) p.x = W;
            if (p.x > W) p.x = 0;
        });
        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => { resize(); init(); });
    resize(); init(); draw();
})();

// ===== SCROLL-TRIGGERED ANIMATIONS =====
(function initScrollAnimations() {
    const fadeEls = document.querySelectorAll('.fade-up');
    const revealLines = document.querySelectorAll('.reveal-line');

    // Prepare reveal lines
    revealLines.forEach(el => {
        el.style.cssText = `
            display:inline-block; overflow:hidden;
            clip-path: inset(0 0 100% 0);
            transition: clip-path 0.9s cubic-bezier(0.16, 1, 0.3, 1);
        `;
    });

    const obs = new IntersectionObserver(entries => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const delay = parseFloat(el.dataset.delay || 0);
                setTimeout(() => {
                    el.classList.add('visible');
                    if (el.classList.contains('reveal-line')) {
                        el.style.clipPath = 'inset(0 0 0% 0)';
                    }
                }, delay * 1000 + i * 80);
                obs.unobserve(el);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    fadeEls.forEach((el, i) => {
        el.dataset.delay = (i % 4) * 0.1;
        obs.observe(el);
    });
    revealLines.forEach((el, i) => {
        el.dataset.delay = i * 0.15;
        obs.observe(el);
    });
})();

// ===== COUNT-UP ANIMATION =====
(function initCounters() {
    const counters = document.querySelectorAll('.count-up');

    const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.dataset.target, 10);
            const duration = 1800;
            const start = performance.now();

            function step(now) {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.floor(eased * target);
                if (progress < 1) requestAnimationFrame(step);
                else el.textContent = target;
            }
            requestAnimationFrame(step);
            obs.unobserve(el);
        });
    }, { threshold: 0.5 });

    counters.forEach(c => obs.observe(c));
})();

// ===== PARALLAX HERO =====
(function initParallax() {
    const heroVisual = document.querySelector('[data-parallax]');
    if (!heroVisual) return;
    const speed = parseFloat(heroVisual.dataset.parallax || 0.08);

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        heroVisual.style.transform = `translateY(${scrollY * speed}px)`;
    }, { passive: true });
})();

// ===== HEADER SCROLL STATE =====
(function initHeaderScroll() {
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) {
            header.style.boxShadow = '0 4px 40px rgba(0,0,0,0.5)';
        } else {
            header.style.boxShadow = 'none';
        }
    }, { passive: true });
})();

// ===== LIVE CLOCK (CRIPTANA LOCAL TIME) =====
(function initClock() {
    const clockEl = document.getElementById('header-clock');
    if (!clockEl) return;

    function update() {
        const now = new Date();
        const opts = { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit' };
        clockEl.textContent = now.toLocaleTimeString('es-ES', opts);
    }
    update();
    setInterval(update, 1000);
})();

// Add clock CSS
(function injectClockCSS() {
    const style = document.createElement('style');
    style.textContent = `
        .header-clock {
            font-family: 'Space Grotesk', sans-serif;
            font-size: 0.72rem;
            font-weight: 600;
            color: var(--grey);
            letter-spacing: 0.1em;
            padding: 4px 8px;
            border: 1px solid var(--border);
        }
    `;
    document.head.appendChild(style);
})();

// ===== SCROLL INDICATOR ANIMATION =====
(function injectScrollIndicator() {
    const style = document.createElement('style');
    style.textContent = `
        .scroll-indicator {
            position: absolute;
            bottom: 2.5rem;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
            z-index: 10;
        }
        .scroll-line {
            width: 1px;
            height: 50px;
            background: linear-gradient(to bottom, var(--amber), transparent);
            animation: scroll-line-pulse 2s ease-in-out infinite;
            transform-origin: top;
        }
        @keyframes scroll-line-pulse {
            0%, 100% { transform: scaleY(1); opacity: 0.7; }
            50% { transform: scaleY(0.4); opacity: 0.3; }
        }
        .scroll-text {
            font-size: 0.55rem;
            letter-spacing: 0.2em;
            color: var(--grey);
            font-weight: 700;
            font-family: 'Outfit', sans-serif;
        }
    `;
    document.head.appendChild(style);
})();

// ===== MOBILE NAVIGATION =====
(function initMobileNav() {
    const toggle = document.getElementById('mobile-toggle');
    const menu   = document.getElementById('nav-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
        const open = menu.classList.toggle('active');
        toggle.classList.toggle('active', open);
        document.body.style.overflow = open ? 'hidden' : '';
    });

    menu.querySelectorAll('.nav-link, .nav-btn').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            toggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
})();

// ===== MAGNETIC BUTTONS =====
(function initMagnetic() {
    document.querySelectorAll('.magnetic').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const rect = btn.getBoundingClientRect();
            const cx   = rect.left + rect.width / 2;
            const cy   = rect.top  + rect.height / 2;
            const dx   = (e.clientX - cx) * 0.25;
            const dy   = (e.clientY - cy) * 0.25;
            btn.style.transform = `translate(${dx}px, ${dy}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
})();

// ===== 360° PANORAMA VIEWER =====
(function init360Viewer() {
    const canvas  = document.getElementById('pano-canvas');
    const viewer  = document.getElementById('pano-viewer');
    const overlay = document.getElementById('viewer-overlay');
    if (!canvas || !viewer) return;

    const ctx = canvas.getContext('2d');
    let W, H;

    function resize() {
        W = canvas.width  = viewer.offsetWidth;
        H = canvas.height = viewer.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // State
    let yaw = 0, fov = 90, targetYaw = 0, isDragging = false;
    let lastX = 0, autoSpeed = 0.15;
    const CAVE_WIDTH = 3600;

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

    // Stone wall texture rendering
    function drawStoneWall(ox, w, h) {
        // Base stone gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, h);
        gradient.addColorStop(0, '#100a08');
        gradient.addColorStop(0.3, '#211510');
        gradient.addColorStop(0.6, '#1a100d');
        gradient.addColorStop(1, '#0C0A09');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);

        // Stone blocks
        const stoneH = 32;
        let seed = 98765;
        function pseudoRandom() {
            seed = (seed * 16807 + 0) % 2147483647;
            return (seed & 0x7fffffff) / 2147483647;
        }

        for (let row = 0; row < h * 0.7; row += stoneH) {
            let stoneW = 50 + pseudoRandom() * 40;
            const offsetRow = (Math.floor(row / stoneH) % 2) * 25;

            for (let col = -stoneW; col < w + stoneW; col += stoneW) {
                const sx = col + offsetRow + ((ox * 0.4) % stoneW);
                const sy = row;
                const sw = stoneW - 2;
                const sh = stoneH - 2;

                const brightness = 0.08 + pseudoRandom() * 0.08;
                ctx.fillStyle = 'rgba(' +
                    Math.floor(100 + pseudoRandom() * 30) + ',' +
                    Math.floor(70 + pseudoRandom() * 20) + ',' +
                    Math.floor(45 + pseudoRandom() * 15) + ',' +
                    brightness + ')';
                ctx.fillRect(sx, sy, sw, sh);

                // Mortar joints
                ctx.fillStyle = 'rgba(8,4,2,0.4)';
                ctx.fillRect(sx + sw, sy, 2, sh + 2);
                ctx.fillRect(sx, sy + sh, sw + 2, 2);
            }
            stoneW = 45 + pseudoRandom() * 50;
        }
    }

    // Vaulted ribs ceiling
    function drawCeiling(w, h) {
        ctx.save();
        const archH = h * 0.35;
        const ceilGrad = ctx.createLinearGradient(0, 0, 0, archH);
        ceilGrad.addColorStop(0, 'rgba(10,6,4,0.95)');
        ceilGrad.addColorStop(0.6, 'rgba(26,16,10,0.6)');
        ceilGrad.addColorStop(1, 'rgba(26,16,10,0.0)');
        ctx.fillStyle = ceilGrad;
        ctx.fillRect(0, 0, w, archH);

        const archCount = 5;
        const spacing = w / archCount;
        ctx.strokeStyle = 'rgba(75,50,30,0.35)';
        ctx.lineWidth = 4;
        for (let i = 0; i < archCount; i++) {
            const cx = spacing * i + spacing / 2;
            ctx.beginPath();
            ctx.arc(cx, archH * 0.9, spacing * 0.4, Math.PI, 0);
            ctx.stroke();
        }
        ctx.restore();
    }

    // Coded wooden barrel
    function drawBarrel(bx, by, scale) {
        const s = scale || 1;
        const bw = 70 * s;
        const bh = 95 * s;

        ctx.save();
        ctx.translate(bx, by);

        // Barrel shadow
        ctx.fillStyle = 'rgba(0,0,0,0.45)';
        ctx.beginPath();
        ctx.ellipse(0, bh * 0.48, bw * 0.6, 12 * s, 0, 0, Math.PI * 2);
        ctx.fill();

        // Barrel body gradient
        const bGrad = ctx.createLinearGradient(-bw / 2, 0, bw / 2, 0);
        bGrad.addColorStop(0, '#2d1a0e');
        bGrad.addColorStop(0.3, '#5c3a1e');
        bGrad.addColorStop(0.5, '#6a4524');
        bGrad.addColorStop(0.7, '#5c3a1e');
        bGrad.addColorStop(1, '#25140a');
        ctx.fillStyle = bGrad;

        ctx.beginPath();
        ctx.ellipse(0, 0, bw / 2, bh / 2, 0, 0, Math.PI * 2);
        ctx.fill();

        // Staves / Planks lines
        ctx.strokeStyle = 'rgba(15,8,4,0.35)';
        ctx.lineWidth = 1;
        [-0.3, -0.1, 0.1, 0.3].forEach(pos => {
            ctx.beginPath();
            ctx.ellipse(0, 0, bw * 0.5 * Math.abs(pos), bh / 2, 0, -Math.PI / 2, Math.PI / 2);
            ctx.stroke();
        });

        // Metal hoops
        ctx.strokeStyle = '#2d2d2d';
        ctx.lineWidth = 3.5 * s;
        const hoopPos = [-0.35, -0.1, 0.15, 0.4];
        hoopPos.forEach(hY => {
            const bandY = hY * bh;
            ctx.beginPath();
            ctx.ellipse(0, bandY, bw / 2 * Math.cos(hY * 0.7), 4.5 * s, 0, 0, Math.PI * 2);
            ctx.stroke();

            // Band metallic highlights
            ctx.strokeStyle = 'rgba(150,150,140,0.3)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.ellipse(0, bandY - 1, bw / 2 * Math.cos(hY * 0.7), 3 * s, 0, 0, Math.PI);
            ctx.stroke();
            ctx.strokeStyle = '#2d2d2d';
            ctx.lineWidth = 3.5 * s;
        });

        // Bung hole
        ctx.fillStyle = '#170c06';
        ctx.beginPath();
        ctx.arc(0, 0, 4.5 * s, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#3a2010';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.restore();
    }

    // Coded wall torch
    function drawTorch(tx, ty, time) {
        ctx.save();
        ctx.translate(tx, ty);

        // Bracket
        ctx.fillStyle = '#262626';
        ctx.fillRect(-2, 0, 4, 20);
        ctx.fillStyle = '#333333';
        ctx.fillRect(-6, 18, 12, 4);

        // Torch handle
        ctx.fillStyle = '#4c2f18';
        ctx.fillRect(-3, -16, 6, 18);

        const flicker = 1 + Math.sin(time * 7 + tx) * 0.08;
        const flicker2 = Math.cos(time * 10 + tx * 0.5) * 2;

        // Radial glow
        const glowGrad = ctx.createRadialGradient(flicker2, -28, 2, 0, -20, 180 * flicker);
        glowGrad.addColorStop(0, 'rgba(255,160,40,0.22)');
        glowGrad.addColorStop(0.5, 'rgba(255,90,15,0.08)');
        glowGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = glowGrad;
        ctx.fillRect(-100, -110, 200, 160);

        // Outer Flame
        ctx.fillStyle = 'rgba(255,170,40,0.85)';
        ctx.beginPath();
        ctx.moveTo(-5 + flicker2, -16);
        ctx.quadraticCurveTo(-8 + flicker2, -30, flicker2 * 0.5, -45 + flicker * 3);
        ctx.quadraticCurveTo(8 + flicker2, -30, 5 + flicker2, -16);
        ctx.fill();

        // Inner Core Flame
        ctx.fillStyle = 'rgba(255,230,90,0.95)';
        ctx.beginPath();
        ctx.moveTo(-2.5, -16);
        ctx.quadraticCurveTo(-4, -28, 0, -38);
        ctx.quadraticCurveTo(4, -28, 2.5, -16);
        ctx.fill();

        ctx.restore();
    }

    // Dust motes
    const dustMotes = [];
    for (let d = 0; d < 25; d++) {
        dustMotes.push({
            x: Math.random() * 1200,
            y: Math.random() * 450,
            r: Math.random() * 1.5 + 0.4,
            speed: Math.random() * 0.12 + 0.04,
            drift: Math.random() * 0.2 - 0.1,
            phase: Math.random() * Math.PI * 2
        });
    }

    // Generate a rich cave panorama scene
    function drawScene() {
        ctx.clearRect(0, 0, W, H);
        const time = Date.now() / 1000;
        const yawRad = (yaw * Math.PI) / 180;
        const offset = ((yaw * 6) % CAVE_WIDTH + CAVE_WIDTH) % CAVE_WIDTH;

        // 1. Draw stone masonry wall
        drawStoneWall(offset, W + 100, H);

        // 2. Draw Ribbed ceiling
        drawCeiling(W, H);

        // 3. Draw Floor
        const floorY = H * 0.72;
        const floorGrad = ctx.createLinearGradient(0, floorY, 0, H);
        floorGrad.addColorStop(0, 'rgba(30,18,10,0.0)');
        floorGrad.addColorStop(0.3, 'rgba(20,12,6,0.65)');
        floorGrad.addColorStop(1, '#0a0604');
        ctx.fillStyle = floorGrad;
        ctx.fillRect(0, floorY, W, H - floorY);

        // Floor stones perspective
        ctx.strokeStyle = 'rgba(60,40,20,0.12)';
        ctx.lineWidth = 1;
        for (let fi = 0; fi < W; fi += 70) {
            const fx = fi - (offset * 0.25) % 70;
            ctx.beginPath();
            ctx.moveTo(fx, floorY + 10);
            ctx.lineTo(fx * 1.1 - W * 0.05, H);
            ctx.stroke();
        }

        // 4. Draw Oak Barrels in Two Rows
        const barrelSpacing = W * 0.35;
        // Foreground Row
        for (let i = 0; i < 4; i++) {
            const bx = ((i * barrelSpacing - offset * 0.5 + CAVE_WIDTH * 2) % (W * 1.4)) - W * 0.2;
            if (bx > -100 && bx < W + 100) {
                drawBarrel(bx, H * 0.64, 0.95);
            }
        }
        // Background Row
        for (let i = 0; i < 3; i++) {
            const bx = (((i + 0.5) * barrelSpacing - offset * 0.5 + CAVE_WIDTH * 2) % (W * 1.4)) - W * 0.2;
            if (bx > -100 && bx < W + 100) {
                drawBarrel(bx, H * 0.56, 0.78);
            }
        }

        // 5. Draw Flickering wall torches
        const torchSpacing = W * 0.8;
        for (let i = 0; i < 2; i++) {
            const tx = ((i * torchSpacing - offset * 0.3 + CAVE_WIDTH * 2) % (W * 1.6)) - W * 0.3;
            if (tx > -60 && tx < W + 60) {
                drawTorch(tx, H * 0.3, time);
            }
        }

        // 6. Draw floating dust motes
        ctx.globalAlpha = 0.55;
        dustMotes.forEach(mote => {
            mote.y -= mote.speed;
            mote.x += mote.drift + Math.sin(time * 0.4 + mote.phase) * 0.15;
            mote.phase += 0.008;

            if (mote.y < -10) {
                mote.y = H + 10;
                mote.x = Math.random() * W;
            }

            const alpha = 0.25 + Math.sin(time * 1.5 + mote.phase) * 0.18;
            ctx.fillStyle = 'rgba(245,166,35,' + alpha + ')';
            ctx.beginPath();
            ctx.arc((mote.x - offset * 0.08 + W * 2) % (W + 40) - 20, mote.y, mote.r, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;

        // 7. Vignette shadow overlay
        const vigGrad = ctx.createRadialGradient(W / 2, H / 2, W * 0.15, W / 2, H / 2, W * 0.72);
        vigGrad.addColorStop(0, 'rgba(0,0,0,0)');
        vigGrad.addColorStop(0.5, 'rgba(0,0,0,0.18)');
        vigGrad.addColorStop(0.8, 'rgba(0,0,0,0.48)');
        vigGrad.addColorStop(1, 'rgba(0,0,0,0.85)');
        ctx.fillStyle = vigGrad;
        ctx.fillRect(0, 0, W, H);
    }

    let animFrame;
    function loop() {
        if (!isDragging) {
            yaw += autoSpeed;
        }
        yaw += (targetYaw - yaw) * 0.08;
        targetYaw += 0.002;
        if (yaw > 360) yaw -= 360;
        if (targetYaw > 360) targetYaw -= 360;
        drawScene();
        animFrame = requestAnimationFrame(loop);
    }
    loop();

    // Drag controls
    viewer.addEventListener('mousedown', e => {
        isDragging = true;
        lastX = e.clientX;
        if (overlay && !overlay.classList.contains('fade-out')) {
            overlay.classList.add('fade-out');
            setTimeout(() => { overlay.style.display = 'none'; }, 600);
        }
    });
    window.addEventListener('mousemove', e => {
        if (!isDragging) return;
        const dx = e.clientX - lastX;
        yaw -= dx * 0.25;
        targetYaw = yaw;
        lastX = e.clientX;
    });
    window.addEventListener('mouseup', () => { isDragging = false; });

    // Touch
    viewer.addEventListener('touchstart', e => {
        isDragging = true;
        lastX = e.touches[0].clientX;
        if (overlay && !overlay.classList.contains('fade-out')) {
            overlay.classList.add('fade-out');
            setTimeout(() => { overlay.style.display = 'none'; }, 600);
        }
    }, { passive: true });
    viewer.addEventListener('touchmove', e => {
        if (!isDragging) return;
        const dx = e.touches[0].clientX - lastX;
        yaw -= dx * 0.25;
        targetYaw = yaw;
        lastX = e.touches[0].clientX;
    }, { passive: true });
    viewer.addEventListener('touchend', () => { isDragging = false; });

    // Buttons
    document.getElementById('ctrl-left')?.addEventListener('click',  () => { targetYaw -= 20; });
    document.getElementById('ctrl-right')?.addEventListener('click', () => { targetYaw += 20; });
    document.getElementById('ctrl-zoom-in')?.addEventListener('click',  () => { fov = Math.max(40, fov - 10); });
    document.getElementById('ctrl-zoom-out')?.addEventListener('click', () => { fov = Math.min(130, fov + 10); });

    // Scroll wheel zoom
    viewer.addEventListener('wheel', e => {
        e.preventDefault();
        fov = Math.min(130, Math.max(40, fov + (e.deltaY > 0 ? 5 : -5)));
    }, { passive: false });
})();

// ===== INTERACTIVE PRICING CALCULATOR =====
(function initCalculator() {
    const items = {
        web:      { setup: 149, monthly: 9  },
        google:   { setup: 79,  monthly: 10 },
        whatsapp: { setup: 49,  monthly: 0  },
        tour:     { setup: 349, monthly: 0  },
        social:   { setup: 0,   monthly: 99 }
    };

    const ids = ['web', 'google', 'whatsapp', 'tour', 'social'];
    const setupEl   = document.getElementById('setup-cost');
    const monthlyEl = document.getElementById('monthly-cost');

    function animateTo(el, target) {
        if (!el) return;
        const current = parseInt(el.textContent, 10) || 0;
        const delta = target - current;
        const steps = 20;
        let step = 0;
        clearInterval(el._anim);
        el._anim = setInterval(() => {
            step++;
            const ease = 1 - Math.pow(1 - step / steps, 3);
            el.textContent = Math.round(current + delta * ease);
            if (step >= steps) {
                el.textContent = target;
                clearInterval(el._anim);
            }
        }, 20);
    }

    function update() {
        let setup = 0, monthly = 0;
        ids.forEach(id => {
            const el = document.getElementById(`calc-${id}`);
            if (el && el.checked) {
                setup   += items[id].setup;
                monthly += items[id].monthly;
            }
        });
        animateTo(setupEl, setup);
        animateTo(monthlyEl, monthly);
    }

    ids.forEach(id => {
        const el = document.getElementById(`calc-${id}`);
        if (el) el.addEventListener('change', update);
    });

    update();
})();

// ===== AUDIT FORM =====
(function initForm() {
    const form = document.getElementById('audit-form');
    const success = document.getElementById('form-success');
    const closeBtn = document.getElementById('close-success-btn');
    if (!form) return;

    form.addEventListener('submit', e => {
        e.preventDefault();
        const btn = document.getElementById('form-submit-btn');
        if (btn) { btn.textContent = '⏳ Enviando...'; btn.disabled = true; }

        setTimeout(() => {
            if (success) success.classList.add('show');
            form.reset();
            if (btn) { btn.textContent = ''; btn.disabled = false; }

            // Restore button text from data-key
            const key = btn?.dataset.key;
            if (key && btn) {
                const t = i18n[currentLang]?.[key];
                if (t) btn.textContent = t;
            }
        }, 1200);
    });

    closeBtn?.addEventListener('click', () => {
        success?.classList.remove('show');
    });
})();

// ===== BILINGUAL SYSTEM =====
const i18n = {
    es: {
        'hero-badge': 'Agencia Digital · Campo de Criptana',
        'hero-title-1': 'Levantamos',
        'hero-title-2': 'Gigantes',
        'hero-title-3': 'Digitales.',
        'hero-subtitle': 'Ayudamos a los comercios locales, bodegas y alojamientos de Campo de Criptana a dominar internet — con páginas web, Google Maps, WhatsApp Business y Tours 360° de última generación.',
        'hero-btn-primary': 'Configurar Mi Plan',
        'hero-btn-secondary': 'Ver Tour 360° →',
        'stat-label-1': 'Más visibilidad local',
        'stat-label-2': 'Más reservas online',
        'stat-label-3': 'Entrega express',
        'stat-title-1': 'Google Maps',
        'stat-desc-1': 'Visibilidad Local',
        'stat-title-2': 'Reservas',
        'stat-desc-2': 'Bodegas & Alojamientos',
        'chat-bubble-1': '¡Hola! Quiero reservar una cata con visita a la cueva en 360°.',
        'chat-bubble-2': '¡Por supuesto! Reserva confirmada. ¡Nos vemos en Criptana! 🍷',
        'nav-vision': 'Nuestra Visión',
        'nav-services': 'Servicios',
        'nav-experience': 'Demo 360°',
        'nav-calculator': 'Calcular Plan',
        'nav-contact': 'Auditoría Gratis',
        'vision-label': 'Nuestra Visión',
        'vision-title': 'La Realidad de<br>Nuestro Pueblo.',
        'vision-subtitle': 'Campo de Criptana tiene una historia que muchos en España envidian. Pero digitalmente, es casi invisible. Eso es lo que vamos a cambiar.',
        'vision-accent': '"No hace falta ser Madrid para tener una presencia digital que impresione. Solo hace falta la agencia correcta."',
        'vision-card-title-1': 'Comercio de Confianza',
        'vision-card-desc-1': 'Tu panadería o bar no necesita una web carísima. Necesita Google Maps, menú digital y WhatsApp en un clic.',
        'vision-card-title-2': 'Enoturismo Internacional',
        'vision-card-desc-2': 'Las bodegas D.O. La Mancha tienen historia brutal. Mostremos el interior con 360° que deja sin aliento.',
        'vision-card-title-3': 'Casas Rurales que Enamoran',
        'vision-card-desc-3': 'Un tour interactivo en 360° convierte a un curioso de Google en un huésped confirmado.',
        'services-label': 'Lo Que Hacemos',
        'services-title': 'Tres planes.<br>Una ciudad.<br>Sin límites.',
        'services-subtitle': 'Sin jerga tecnológica. Tres soluciones directas, rápidas y con precios adaptados a la economía real de Campo de Criptana.',
        'service-title-1': 'Comercio Local Exprés',
        'service-desc-1': 'Ideal para bares, panaderías y pequeños comercios que quieren clientes directos sin complicaciones.',
        'setup-label-1': 'Desde 149€ de alta',
        'service-title-2': 'Alojamientos & Inmobiliaria 360°',
        'service-desc-2': 'Para casas rurales, casas cueva y agencias que quieren cerrar reservas desde internet.',
        'setup-label-2': 'Pago único por propiedad',
        'service-title-3': 'Enoturismo & Marca Industrial',
        'service-desc-3': 'Para bodegas D.O. La Mancha y fábricas que quieren exportar y atraer turismo premium.',
        'setup-label-3': 'Proyecto a medida',
        'showcase-label': 'Demo Interactiva',
        'showcase-title': 'Camina por una<br>cueva manchega.',
        'showcase-subtitle': 'Arrastra para explorar. Así verán tu bodega o casa rural los turistas de Madrid antes de reservar.',
        'viewer-instruction': 'Arrastra para explorar la bodega en 360°',
        'hs-title-1': 'Crianza Tradicional',
        'hs-desc-1': 'Barricas de roble americano bajo la temperatura constante de la cueva manchega.',
        'hs-title-2': 'Arquitectura Excavada',
        'hs-desc-2': 'Cueva natural excavada a mano en la roca de Campo de Criptana.',
        'calc-label': 'Sin Letra Pequeña',
        'calc-title': 'Calcula tu presupuesto.',
        'calc-subtitle': 'Transparencia total. Selecciona los servicios y ve el precio al instante.',
        'calc-options-title': 'Selecciona tus Servicios',
        'calc-item-web-title': 'Página Web / Catálogo Express',
        'calc-item-web-desc': 'Web ultrarrápida adaptada a móviles con hosting incluido.',
        'calc-item-google-title': 'Google Maps & SEO Local',
        'calc-item-google-desc': 'Ficha de Google optimizada para que te encuentren.',
        'calc-item-wa-title': 'WhatsApp Business & QR Físico',
        'calc-item-wa-desc': 'Catálogo en WhatsApp + stand QR para tu mostrador.',
        'calc-item-tour-title': 'Sesión Fotográfica & Tour 360°',
        'calc-item-tour-desc': 'Tour inmersivo para bodega, cueva o casa rural en HDR.',
        'calc-item-social-title': 'Gestión de Redes Sociales',
        'calc-item-social-desc': 'Publicaciones semanales enfocadas en Criptana y comarca.',
        'calc-result-title': 'Estimación de Inversión',
        'calc-setup-label': 'Pago Único (Alta)',
        'calc-setup-desc': 'Diseño, programación y puesta en marcha.',
        'calc-monthly-label': 'Suscripción Mensual',
        'calc-monthly-desc': 'Hosting, mantenimiento y soporte.',
        'calc-cta': 'Solicitar esta Combinación',
        'contact-badge': 'Hablemos',
        'contact-panel-title': 'Hagamos Despegar<br>tu Negocio.',
        'contact-panel-desc': 'No importa si eres una pequeña tienda, una bodega con historia o una casa cueva turística. Analizamos tu caso y proponemos soluciones reales.',
        'contact-loc-title': 'Ubicación',
        'contact-wa-title': 'WhatsApp',
        'contact-mail-title': 'Email',
        'form-title': 'Auditoría Digital Gratis',
        'form-subtitle': 'Analizamos tu visibilidad en Google Maps, fotos y redes sin coste alguno.',
        'form-label-name': 'Nombre / Negocio',
        'form-label-phone': 'Teléfono (WhatsApp)',
        'form-label-email': 'Email (Opcional)',
        'form-label-type': 'Tipo de Negocio',
        'form-label-msg': '¿En qué podemos ayudarte?',
        'form-btn': 'Solicitar Auditoría Gratuita',
        'success-title': '¡Auditoría Solicitada!',
        'success-desc': 'Nos pondremos en contacto por WhatsApp en menos de 24 horas.',
        'success-close': 'Entendido',
        'footer-privacy': 'Privacidad',
        'footer-legal': 'Aviso Legal',
        's1-f1': 'Optimización de Google Maps',
        's1-f2': 'WhatsApp Business + catálogo',
        's1-f3': 'Web Tarjeta ultrarrápida',
        's1-f4': 'Stand QR físico para escaparate',
        's2-f1': 'Fotografía HDR profesional',
        's2-f2': 'Tour Virtual 360° interactivo',
        's2-f3': 'Integración en Booking, Airbnb, Idealista',
        's2-f4': 'Optimización para turismo nacional',
        's3-f1': 'Web con motor de reservas para catas',
        's3-f2': 'Tour 360° de cuevas y barricas',
        's3-f3': 'Producción de video (Reels / TikTok)',
        's3-f4': 'Campañas en Madrid y provincia',
        'opt-1': 'Pequeño Comercio / Bar / Tienda',
        'opt-2': 'Bodega de Vino (D.O. La Mancha)',
        'opt-3': 'Casa Rural / Casa Cueva / Alojamiento',
        'opt-4': 'Agencia Inmobiliaria',
    },
    en: {
        'hero-badge': 'Digital Agency · Campo de Criptana',
        'hero-title-1': 'We Build',
        'hero-title-2': 'Digital',
        'hero-title-3': 'Giants.',
        'hero-subtitle': 'We help local businesses, wineries and rural accommodations in Campo de Criptana dominate the internet — with websites, Google Maps, WhatsApp Business and 360° Virtual Tours.',
        'hero-btn-primary': 'Build My Plan',
        'hero-btn-secondary': 'See 360° Tour →',
        'stat-label-1': 'More local visibility',
        'stat-label-2': 'More online bookings',
        'stat-label-3': 'Express delivery',
        'stat-title-1': 'Google Maps',
        'stat-desc-1': 'Local Visibility',
        'stat-title-2': 'Bookings',
        'stat-desc-2': 'Wineries & Lodgings',
        'chat-bubble-1': 'Hi! I want to book a wine tasting with 360° cave visit.',
        'chat-bubble-2': 'Of course! Reservation confirmed. See you in Criptana! 🍷',
        'nav-vision': 'Our Vision',
        'nav-services': 'Services',
        'nav-experience': '360° Demo',
        'nav-calculator': 'Pricing',
        'nav-contact': 'Free Audit',
        'vision-label': 'Our Vision',
        'vision-title': 'The Reality of<br>Our Town.',
        'vision-subtitle': 'Campo de Criptana has a history many in Spain envy. But digitally, it\'s nearly invisible. That\'s what we\'re changing.',
        'vision-accent': '"You don\'t need to be Madrid to have a stunning digital presence. You just need the right agency."',
        'vision-card-title-1': 'Trusted Local Commerce',
        'vision-card-desc-1': 'Your bakery or bar doesn\'t need an expensive website. It needs Google Maps, a digital menu and WhatsApp in one click.',
        'vision-card-title-2': 'International Winetourism',
        'vision-card-desc-2': 'D.O. La Mancha wineries have a powerful story. Let\'s show the inside of the aging caves with breathtaking 360° tech.',
        'vision-card-title-3': 'Rural Homes That Captivate',
        'vision-card-desc-3': 'An interactive 360° tour turns a Google browser into a confirmed guest.',
        'services-label': 'What We Do',
        'services-title': 'Three plans.<br>One town.<br>No limits.',
        'services-subtitle': 'No tech jargon. Three direct, fast solutions with pricing adapted to the real economy of Campo de Criptana.',
        'service-title-1': 'Local Commerce Express',
        'service-desc-1': 'Perfect for bars, bakeries and small businesses that want direct customers without complexity.',
        'setup-label-1': 'From €149 setup',
        'service-title-2': 'Lodgings & Real Estate 360°',
        'service-desc-2': 'For rural houses, cave houses and agencies wanting to close bookings online.',
        'setup-label-2': 'One-time payment per property',
        'service-title-3': 'Wine Tourism & Industrial Brand',
        'service-desc-3': 'For D.O. La Mancha wineries and agri-food factories wanting to export and attract premium tourism.',
        'setup-label-3': 'Custom project',
        'showcase-label': 'Interactive Demo',
        'showcase-title': 'Walk through a<br>La Mancha cave.',
        'showcase-subtitle': 'Drag to explore. This is how tourists from Madrid will see your winery or rural home before booking.',
        'viewer-instruction': 'Drag to explore the winery in 360°',
        'hs-title-1': 'Traditional Aging',
        'hs-desc-1': 'American oak barrels under the constant temperature of the La Mancha cave.',
        'hs-title-2': 'Excavated Architecture',
        'hs-desc-2': 'Natural cave hand-excavated from the rock of Campo de Criptana.',
        'calc-label': 'No Fine Print',
        'calc-title': 'Calculate your budget.',
        'calc-subtitle': 'Total transparency. Select services and see the price instantly.',
        'calc-options-title': 'Select Your Services',
        'calc-item-web-title': 'Website / Express Catalogue',
        'calc-item-web-desc': 'Ultra-fast mobile-ready website with hosting included.',
        'calc-item-google-title': 'Google Maps & Local SEO',
        'calc-item-google-desc': 'Optimised Google profile so customers can find you.',
        'calc-item-wa-title': 'WhatsApp Business & Physical QR',
        'calc-item-wa-desc': 'WhatsApp catalogue + QR stand for your counter.',
        'calc-item-tour-title': 'Photo Session & 360° Tour',
        'calc-item-tour-desc': 'Immersive tour for winery, cave or rural house in HDR.',
        'calc-item-social-title': 'Social Media Management',
        'calc-item-social-desc': 'Weekly posts focused on Criptana and surroundings.',
        'calc-result-title': 'Investment Estimate',
        'calc-setup-label': 'One-time Payment',
        'calc-setup-desc': 'Design, development and launch.',
        'calc-monthly-label': 'Monthly Subscription',
        'calc-monthly-desc': 'Hosting, maintenance and support.',
        'calc-cta': 'Request This Combination',
        'contact-badge': 'Let\'s Talk',
        'contact-panel-title': 'Let\'s Launch<br>Your Business.',
        'contact-panel-desc': 'Whether you\'re a small shop, a historic winery or a cave tourism home — we analyse your case and propose real solutions.',
        'contact-loc-title': 'Location',
        'contact-wa-title': 'WhatsApp',
        'contact-mail-title': 'Email',
        'form-title': 'Free Digital Audit',
        'form-subtitle': 'We analyse your Google Maps visibility, photos and social media at no cost.',
        'form-label-name': 'Name / Business',
        'form-label-phone': 'Phone (WhatsApp)',
        'form-label-email': 'Email (Optional)',
        'form-label-type': 'Business Type',
        'form-label-msg': 'How can we help?',
        'form-btn': 'Request Free Audit',
        'success-title': 'Audit Requested!',
        'success-desc': 'We\'ll contact you on WhatsApp within 24 hours with your free visibility report.',
        'success-close': 'Got it',
        'footer-privacy': 'Privacy',
        'footer-legal': 'Legal Notice',
        's1-f1': 'Google Maps optimisation',
        's1-f2': 'WhatsApp Business + catalogue',
        's1-f3': 'Ultra-fast card website',
        's1-f4': 'Physical QR stand for window',
        's2-f1': 'Professional HDR photography',
        's2-f2': 'Interactive 360° Virtual Tour',
        's2-f3': 'Integration on Booking, Airbnb, Idealista',
        's2-f4': 'Optimisation for national tourism',
        's3-f1': 'Website with tasting booking engine',
        's3-f2': '360° tour of caves and barrels',
        's3-f3': 'Video production (Reels / TikTok)',
        's3-f4': 'Campaigns in Madrid and province',
        'opt-1': 'Small Commerce / Bar / Shop',
        'opt-2': 'Winery (D.O. La Mancha)',
        'opt-3': 'Rural House / Cave House / Lodging',
        'opt-4': 'Real Estate Agency',
    }
};

let currentLang = 'es';

function applyLanguage(lang) {
    currentLang = lang;
    const dict = i18n[lang];
    document.querySelectorAll('[data-key]').forEach(el => {
        const key = el.dataset.key;
        if (!dict[key]) return;
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = dict[key];
        } else {
            el.innerHTML = dict[key];
        }
    });
    document.documentElement.lang = lang;
}

(function initLanguage() {
    const btnES = document.getElementById('lang-es');
    const btnEN = document.getElementById('lang-en');

    btnES?.addEventListener('click', () => {
        btnES.classList.add('active');
        btnEN?.classList.remove('active');
        applyLanguage('es');
    });

    btnEN?.addEventListener('click', () => {
        btnEN.classList.add('active');
        btnES?.classList.remove('active');
        applyLanguage('en');
    });

    applyLanguage('es');
})();

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        const offset = 80;
        window.scrollTo({
            top: target.getBoundingClientRect().top + window.scrollY - offset,
            behavior: 'smooth'
        });
    });
});

// ===== TYPING BUBBLE ANIMATION =====
(function initTypingBubble() {
    const bubble = document.querySelector('.typing-bubble');
    if (!bubble) return;
    const original = bubble.textContent.trim();
    bubble.textContent = '';

    let started = false;
    const obs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !started) {
            started = true;
            setTimeout(() => {
                let i = 0;
                const interval = setInterval(() => {
                    bubble.textContent = original.slice(0, i);
                    i++;
                    if (i > original.length) clearInterval(interval);
                }, 40);
            }, 1000);
            obs.disconnect();
        }
    }, { threshold: 0.5 });
    obs.observe(bubble);
})();
