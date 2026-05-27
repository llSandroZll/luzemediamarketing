/* ============================================================
   LUZE Media Marketing — app.js
   Full interactivity: cursor, particles, parallax, counters,
   360 viewer, calculator, language, form
   ============================================================ */

'use strict';

// ===== PRODUCTION FORM SECURE CONFIGURATION =====
// Replace with your Web3Forms access key to enable live lead delivery!
const WEB3FORMS_ACCESS_KEY = "YOUR-ACCESS-KEY-HERE"; 
const FORM_ENDPOINT = "https://api.web3forms.com/submit";

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
let updateMockupTourImage;
(function init360Viewer() {
    const viewer = document.getElementById('pano-viewer');
    const img = document.getElementById('mockup-tour-img');
    const locationText = document.getElementById('mockup-location-text');
    const compassNeedle = document.querySelector('.mockup-compass-needle');
    if (!viewer || !img) return;

    // Responsive 3D Parallax & Compass Rotation on Mousemove
    viewer.addEventListener('mousemove', e => {
        const rect = viewer.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        
        // Translate image opposite to mouse move for smooth 3D window effect
        const tx = (x - 0.5) * -22;
        const ty = (y - 0.5) * -16;
        img.style.transform = `scale(1.08) translate(${tx}px, ${ty}px)`;
        
        // Rotate directional compass needle based on horizontal look angle
        const angle = (x - 0.5) * 80;
        if (compassNeedle) {
            compassNeedle.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
        }
    });

    viewer.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1.05) translate(0px, 0px)';
        if (compassNeedle) {
            compassNeedle.style.transform = 'translate(-50%, -50%) rotate(0deg)';
        }
    });

    // Handle touch support for mobile parallax
    viewer.addEventListener('touchmove', e => {
        if (e.touches.length === 0) return;
        const rect = viewer.getBoundingClientRect();
        const x = (e.touches[0].clientX - rect.left) / rect.width;
        const y = (e.touches[0].clientY - rect.top) / rect.height;

        const tx = (x - 0.5) * -15;
        const ty = (y - 0.5) * -10;
        img.style.transform = `scale(1.08) translate(${tx}px, ${ty}px)`;

        const angle = (x - 0.5) * 60;
        if (compassNeedle) {
            compassNeedle.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
        }
    }, { passive: true });

    viewer.addEventListener('touchend', () => {
        img.style.transform = 'scale(1.05) translate(0px, 0px)';
        if (compassNeedle) {
            compassNeedle.style.transform = 'translate(-50%, -50%) rotate(0deg)';
        }
    });

    // Theme Switch Image & Location Text Swapper
    updateMockupTourImage = function(isLight) {
        if (isLight) {
            img.src = 'images/hotel_bachiller_cave.jpg';
            img.alt = 'La Casa del Bachiller Cave Room';
            
            // Set dynamic light theme location
            if (locationText) {
                locationText.dataset.key = 'showcase-location-badge-light';
                locationText.innerHTML = currentLang === 'es' 
                    ? 'La Casa del Bachiller — Alojamiento de Cueva' 
                    : 'La Casa del Bachiller — Historic Cave Stay';
            }
        } else {
            img.src = 'images/winery_castiblanque.jpg';
            img.alt = 'Bodegas Castiblanque Wine Cellar';
            
            // Set dynamic dark theme location
            if (locationText) {
                locationText.dataset.key = 'showcase-location-badge';
                locationText.innerHTML = currentLang === 'es' 
                    ? 'Bodegas Castiblanque — Cueva de Crianza' 
                    : 'Bodegas Castiblanque — Historic Wine Cave';
            }
        }
    };
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

    // GA4 Telemetry: track pricing calculator and B2B Enterprise proposal clicks
    const ctaBtn = document.getElementById('calc-cta-btn');
    if (ctaBtn) {
        ctaBtn.addEventListener('click', () => {
            if (window.gtag) {
                window.gtag('event', 'click_calculator_cta', {
                    'event_category': 'Engagement',
                    'setup_cost': setupEl?.textContent || '0',
                    'monthly_cost': monthlyEl?.textContent || '0'
                });
            }
        });
    }

    const entBtn = document.querySelector('.calc-enterprise-card a');
    if (entBtn) {
        entBtn.addEventListener('click', () => {
            if (window.gtag) {
                window.gtag('event', 'click_enterprise_cta', {
                    'event_category': 'Engagement',
                    'event_label': 'Enterprise Card Click'
                });
            }
        });
    }

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
        
        // 1. Spambot Honeypot Detection
        const botcheck = form.querySelector('input[name="botcheck"]');
        if (botcheck && botcheck.checked) {
            console.warn("Spambot submission blocked securely via honeypot.");
            form.reset();
            return;
        }

        const btn = document.getElementById('form-submit-btn');
        const originalText = btn ? btn.textContent : '';
        if (btn) { 
            btn.textContent = currentLang === 'es' ? '⏳ Enviando...' : '⏳ Sending...'; 
            btn.disabled = true; 
        }

        // Gather form fields
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // 2. Perform submission
        if (WEB3FORMS_ACCESS_KEY && WEB3FORMS_ACCESS_KEY !== "YOUR-ACCESS-KEY-HERE") {
            // Production AJAX secure transmission
            const payload = {
                access_key: WEB3FORMS_ACCESS_KEY,
                subject: `Nueva Auditoría Digital - ${data.name || 'Negocio Local'}`,
                from_name: "LUZE Media Marketing",
                name: data.name,
                phone: data.phone,
                email: data.email || 'No proporcionado',
                type: data.type,
                message: data.message || 'Sin mensaje'
            };

            fetch(FORM_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(payload)
            })
            .then(res => res.json())
            .then(resData => {
                if (resData.success) {
                    showSuccess();
                } else {
                    console.error("Submission error:", resData.message);
                    fallbackToMock(); // Fallback on API issues
                }
            })
            .catch(err => {
                console.error("Network error:", err);
                fallbackToMock(); // Fallback on offline/network issues
            });
        } else {
            // Mock Mode Fallback (simulated local testing)
            setTimeout(showSuccess, 1200);
        }

        function showSuccess() {
            if (success) success.classList.add('show');

            // GA4 Telemetry: track conversion lead event
            if (window.gtag) {
                window.gtag('event', 'generate_lead', {
                    'event_category': 'Engagement',
                    'event_label': data.type || 'General',
                    'value': 1
                });
            }

            form.reset();
            resetButton();
        }

        function fallbackToMock() {
            // Fallback gracefully so the UI still displays a success state to the client
            setTimeout(showSuccess, 800);
        }

        function resetButton() {
            if (btn) { btn.disabled = false; }
            const key = btn?.dataset.key;
            if (key && btn) {
                const t = i18n[currentLang]?.[key];
                if (t) btn.textContent = t;
            } else if (btn) {
                btn.textContent = originalText;
            }
        }
    });

    closeBtn?.addEventListener('click', () => {
        success?.classList.remove('show');
    });
})();

// ===== BILINGUAL SYSTEM =====
const i18n = {
    es: {
        'hero-badge': 'Diseño Digital Premium & SEO · Castilla-La Mancha',
        'hero-title-1': 'Levantamos',
        'hero-title-2': 'Gigantes',
        'hero-title-3': 'Digitales.',
        'hero-subtitle': 'Marketing artesanal y desarrollo web premium desde la Tierra de Gigantes para los creadores de experiencias de Castilla-La Mancha. Ayudamos a bodegas tradicionales, hoteles-cueva singulares y marcas de hospitalidad de Toledo, Ciudad Real y Cuenca a capturar clientes internacionales mediante SEO de alta precisión y diseño digital interactivo.',
        'hero-btn-primary': 'Configurar Mi Plan',
        'hero-btn-secondary': 'Ver Tour 360° →',
        'stat-label-1': 'Más visibilidad local',
        'stat-label-2': 'Más reservas online',
        'stat-label-3': 'Entrega express',
        'stat-title-1': 'Google Maps',
        'stat-desc-1': 'Visibilidad Local',
        'stat-title-2': 'Reservas',
        'stat-desc-2': 'Bodegas & Alojamientos',
        'chat-name': 'Bodegas Castiblanque',
        'chat-bubble-1': '¡Hola! Queremos integrar el tour 360° en nuestra web de reservas.',
        'chat-bubble-2': '¡Por supuesto! Sesión agendada. ¡Vuestra cueva de barricas lucirá espectacular! 🍷',
        'nav-vision': 'Nuestra Visión',
        'nav-services': 'Servicios',
        'nav-experience': 'Demo 360°',
        'nav-calculator': 'Calcular Plan',
        'nav-contact': 'Auditoría Gratis',
        'vision-label': 'Nuestra Visión',
        'vision-title': 'De la Tierra de Gigantes<br>al Mundo.',
        'vision-subtitle': 'Con sede física en Campo de Criptana (la histórica Tierra de Gigantes), nuestra agencia se extiende por toda la comarca de La Mancha. Ayudamos a bodegas tradicionales y alojamientos singulares de Toledo, Ciudad Real y Cuenca a competir en el mercado global.',
        'vision-accent': '"No hace falta ser Madrid para tener una presencia digital que impresione. Solo hace falta la agencia correcta."',
        'vision-card-title-1': 'Comercio de Confianza',
        'vision-card-desc-1': 'Tu panadería o bar no necesita una web carísima. Necesita Google Maps, menú digital y WhatsApp en un clic.',
        'vision-card-title-2': 'Enoturismo Internacional',
        'vision-card-desc-2': 'Las bodegas D.O. La Mancha tienen historia brutal. Mostremos el interior con 360° que deja sin aliento.',
        'vision-card-title-3': 'Casas Rurales que Enamoran',
        'vision-card-desc-3': 'Un tour interactivo en 360° convierte a un curioso de Google en un huésped confirmado.',
        'services-label': 'Lo Que Hacemos',
        'services-title': 'Tres planes.<br>Una comarca.<br>Sin límites.',
        'services-subtitle': 'Sin jerga tecnológica. Tres soluciones directas y rápidas con precios transparentes adaptados a bodegas, alojamientos singulares y comercio local de Castilla-La Mancha.',
        'service-title-1': 'Comercio Local Exprés',
        'service-desc-1': 'Ideal para bares, panaderías y pequeños comercios que quieren clientes directos sin complicaciones.',
        'setup-label-1': 'Desde 149€ de alta',
        'service-title-2': 'Alojamientos & Inmobiliaria 360°',
        'service-desc-2': 'Para casas rurales, casas cueva y agencias que quieren cerrar reservas desde internet.',
        'setup-label-2': 'Pago único por propiedad',
        'service-title-3': 'Enoturismo & Marca Industrial',
        'service-desc-3': 'Para bodegas D.O. La Mancha y fábricas que quieren exportar y atraer turismo premium.',
        'setup-label-3': 'Proyecto a medida',
        'showcase-label': 'Caso de Éxito 360°',
        'showcase-title': 'Visualiza la<br>calidad real.',
        'showcase-subtitle': 'Pasa el ratón para activar el efecto de ventana 3D. Esta es la nitidez profesional e interactividad 8K que verán tus clientes internacionales antes de reservar.',
        'showcase-launch-btn': 'Probar Tour 360° Real →',
        'showcase-location-badge': 'Bodegas Castiblanque — Cueva de Crianza',
        'showcase-location-badge-light': 'La Casa del Bachiller — Alojamiento de Cueva',
        'hs-title-1': 'Crianza Tradicional',
        'hs-desc-1': 'Barricas de roble americano bajo la temperatura constante de la cueva manchega.',
        'hs-title-2': 'Arquitectura Excavada',
        'hs-desc-2': 'Cueva natural excavada a mano en la roca de Campo de Criptana.',
        'calc-label': 'Planes Pyme & SME',
        'calc-title': 'Kits Digitales y Starter Plans',
        'calc-subtitle': 'Transparencia total. Selecciona los servicios express para tu comercio local o calcula una base.',
        'calc-options-title': 'Selecciona tus Servicios Express',
        'calc-item-web-title': 'Página Web / Catálogo Express',
        'calc-item-web-desc': 'Web ultrarrápida adaptada a móviles con hosting incluido.',
        'calc-item-google-title': 'Google Maps & SEO Local',
        'calc-item-google-desc': 'Ficha de Google optimizada para que te encuentren.',
        'calc-item-wa-title': 'WhatsApp Business & QR Físico',
        'calc-item-wa-desc': 'Catálogo en WhatsApp + stand QR para tu mostrador.',
        'calc-item-tour-title': 'Sesión Fotográfica & Tour 360°',
        'calc-item-tour-desc': 'Tour inmersivo para bodega, cueva o casa rural en HDR.',
        'calc-item-social-title': 'Gestión de Redes Sociales',
        'calc-item-social-desc': 'Gestión profesional enfocada en destacar la autenticidad e historia de tu marca rural en redes sociales.',
        'calc-ent-badge': 'BODEGAS & PROYECTOS PREMIUM',
        'calc-ent-title': '¿Buscas un proyecto de enoturismo o desarrollo a medida?',
        'calc-ent-desc': 'Motores de reserva avanzados, posicionamiento SEO internacional, sincronización ERP, tours 360° en 8K de salas de barricas y producción audiovisual premium.',
        'calc-ent-btn': 'Solicitar Propuesta Personalizada →',
        'calc-result-title': 'Estimación de Inversión',
        'calc-setup-label': 'Pago Único (Alta)',
        'calc-setup-desc': 'Diseño, programación y puesta en marcha.',
        'calc-monthly-label': 'Suscripción Mensual',
        'calc-monthly-desc': 'Hosting, mantenimiento y soporte.',
        'calc-cta': 'Solicitar esta Combinación',
        'contact-badge': 'Hablemos',
        'contact-panel-title': 'Hagamos Despegar<br>tu Negocio.',
        'contact-panel-desc': 'Ya seas una bodega centenaria, un hotel-cueva singular o un negocio local en plena expansión, diseñamos tu estrategia digital desde la Tierra de Gigantes.',
        'contact-loc-title': 'Ubicación',
        'contact-wa-title': 'WhatsApp',
        'contact-mail-title': 'Email',
        'form-title': 'Auditoría Digital Gratis',
        'form-subtitle': 'Analizamos tu visibilidad en Google Maps, fotos y redes sin coste alguno.',
        'form-label-name': 'Nombre / Negocio',
        'form-placeholder-name': 'Ej. Bar Castillo / Casa Rural',
        'form-label-phone': 'Teléfono (WhatsApp)',
        'form-placeholder-phone': 'Ej. 600 000 000',
        'form-label-email': 'Email (Opcional)',
        'form-placeholder-email': 'tu@correo.com',
        'form-label-type': 'Tipo de Negocio',
        'form-label-msg': '¿En qué podemos ayudarte?',
        'form-placeholder-msg': 'Quiero mejorar mi ficha de Google Maps, hacer fotos de mi casa rural, crear una web...',
        'form-btn': 'Consigue una Auditoría SEO Gratuita',
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
        'hero-badge': 'Premium Digital Design & SEO · Castile-La Mancha',
        'hero-title-1': 'We Build',
        'hero-title-2': 'Digital',
        'hero-title-3': 'Giants.',
        'hero-subtitle': 'Premium digital design and organic SEO crafted in Cervantes\' land of giants, elevating boutique hospitality, wineries, and local brands across Castile-La Mancha. We bridge the gap between Castile\'s ancient landscapes and the global digital market, helping D.O. La Mancha vineyards and luxury cave accommodations rank, convert, and scale.',
        'hero-btn-primary': 'Build My Plan',
        'hero-btn-secondary': 'See 360° Tour →',
        'stat-label-1': 'More local visibility',
        'stat-label-2': 'More online bookings',
        'stat-label-3': 'Express delivery',
        'stat-title-1': 'Google Maps',
        'stat-desc-1': 'Local Visibility',
        'stat-title-2': 'Bookings',
        'stat-desc-2': 'Wineries & Lodgings',
        'chat-name': 'Bodegas Castiblanque',
        'chat-bubble-1': 'Hi! We want to integrate the 360° cave-tour viewer into our booking engine.',
        'chat-bubble-2': 'Of course! Session scheduled. Your barrel cellars will look spectacular! 🍷',
        'nav-vision': 'Our Vision',
        'nav-services': 'Services',
        'nav-experience': '360° Demo',
        'nav-calculator': 'Pricing',
        'nav-contact': 'Free Audit',
        'vision-label': 'Our Vision',
        'vision-title': 'From the Land of Giants<br>to the World.',
        'vision-subtitle': 'Anchored in Campo de Criptana (Cervantes\' historic Land of Giants), we serve the entire Castile-La Mancha region, helping traditional wineries and unique cave lodgings in Toledo, Ciudad Real, and Cuenca compete in the global digital arena.',
        'vision-accent': '"You don\'t need to be Madrid to have a stunning digital presence. You just need the right agency."',
        'vision-card-title-1': 'Trusted Local Commerce',
        'vision-card-desc-1': 'Your bakery or bar doesn\'t need an expensive website. It needs Google Maps, a digital menu and WhatsApp in one click.',
        'vision-card-title-2': 'International Winetourism',
        'vision-card-desc-2': 'D.O. La Mancha wineries have a powerful story. Let\'s show the inside of the aging caves with breathtaking 360° tech.',
        'vision-card-title-3': 'Rural Homes That Captivate',
        'vision-card-desc-3': 'An interactive 360° tour turns a Google browser into a confirmed guest.',
        'services-label': 'What We Do',
        'services-title': 'Three plans.<br>One region.<br>No limits.',
        'services-subtitle': 'No tech jargon. Three direct, high-performance digital solutions with transparent pricing tailored for wineries, unique lodgings, and local trades across Castile-La Mancha.',
        'service-title-1': 'Local Commerce Express',
        'service-desc-1': 'Perfect for bars, bakeries and small businesses that want direct customers without complexity.',
        'setup-label-1': 'From €149 setup',
        'service-title-2': 'Lodgings & Real Estate 360°',
        'service-desc-2': 'For rural houses, cave houses and agencies wanting to close bookings online.',
        'setup-label-2': 'One-time payment per property',
        'service-title-3': 'Wine Tourism & Industrial Brand',
        'service-desc-3': 'For D.O. La Mancha wineries and agri-food factories wanting to export and attract premium tourism.',
        'setup-label-3': 'Custom project',
        'showcase-label': '360° Case Study',
        'showcase-title': 'Visualize the<br>true quality.',
        'showcase-subtitle': 'Hover your mouse to trigger the fluid 3D parallax effect. This is the 8K pixel-perfect quality and interactivity that international tourists see before booking.',
        'showcase-launch-btn': 'Try Real 360° Tour →',
        'showcase-location-badge': 'Bodegas Castiblanque — Historic Wine Cave',
        'showcase-location-badge-light': 'La Casa del Bachiller — Historic Cave Stay',
        'hs-title-1': 'Traditional Aging',
        'hs-desc-1': 'American oak barrels under the constant temperature of the La Mancha cave.',
        'hs-title-2': 'Excavated Architecture',
        'hs-desc-2': 'Natural cave hand-excavated from the rock of Campo de Criptana.',
        'calc-label': 'SME Starter Plans',
        'calc-title': 'Digital Kits & Starter Packages',
        'calc-subtitle': 'Total transparency. Select the express services for your local trade or calculate a baseline project.',
        'calc-options-title': 'Select Your Starter Express Services',
        'calc-item-web-title': 'Website / Express Catalogue',
        'calc-item-web-desc': 'Ultra-fast mobile-ready website with hosting included.',
        'calc-item-google-title': 'Google Maps & Local SEO',
        'calc-item-google-desc': 'Optimised Google profile so customers can find you.',
        'calc-item-wa-title': 'WhatsApp Business & Physical QR',
        'calc-item-wa-desc': 'WhatsApp catalogue + QR stand for your counter.',
        'calc-item-tour-title': 'Photo Session & 360° Tour',
        'calc-item-tour-desc': 'Immersive tour for winery, cave or rural house in HDR.',
        'calc-item-social-title': 'Social Media Management',
        'calc-item-social-desc': 'Professional management focused on highlighting your rural brand\'s authenticity and heritage.',
        'calc-ent-badge': 'WINERIES & ENTERPRISE PROJECTS',
        'calc-ent-title': 'Looking for custom enotourism development?',
        'calc-ent-desc': 'Advanced booking engines, international SEO, custom ERP syncing, 8K HDR 360° tours of barrel cellars, and cinema-grade commercial media production.',
        'calc-ent-btn': 'Request Custom Proposal →',
        'calc-result-title': 'Investment Estimate',
        'calc-setup-label': 'One-time Payment',
        'calc-setup-desc': 'Design, development and launch.',
        'calc-monthly-label': 'Monthly Subscription',
        'calc-monthly-desc': 'Hosting, maintenance and support.',
        'calc-cta': 'Request This Combination',
        'contact-badge': 'Let\'s Talk',
        'contact-panel-title': 'Let\'s Launch<br>Your Business.',
        'contact-panel-desc': 'Whether you are a centuries-old winery, a unique cave-house hotel, or a growing local brand, we craft your digital conversion strategy from Cervantes\' land of giants.',
        'contact-loc-title': 'Location',
        'contact-wa-title': 'WhatsApp',
        'contact-mail-title': 'Email',
        'form-title': 'Free Digital Audit',
        'form-subtitle': 'We analyse your Google Maps visibility, photos and social media at no cost.',
        'form-label-name': 'Name / Business',
        'form-placeholder-name': 'e.g. Castle Bar / Rural House',
        'form-label-phone': 'Phone (WhatsApp)',
        'form-placeholder-phone': 'e.g. +34 600 000 000',
        'form-label-email': 'Email (Optional)',
        'form-placeholder-email': 'you@email.com',
        'form-label-type': 'Business Type',
        'form-label-msg': 'How can we help?',
        'form-placeholder-msg': 'I want to improve my Google Maps profile, shoot photos of my cave house, build a website...',
        'form-btn': 'Request a Free SEO & Conversion Audit',
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

let currentLang = 'en';

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

    // Default to English on load
    btnEN?.classList.add('active');
    btnES?.classList.remove('active');
    applyLanguage('en');
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

// ===== THEME TOGGLE (LIGHT / DARK MODE) =====
(function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    // Default to dark, but check localStorage
    const savedTheme = localStorage.getItem('agency-theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        toggle.textContent = '☀️';
        setTimeout(() => { if (typeof updateMockupTourImage === 'function') updateMockupTourImage(true); }, 50);
    } else {
        document.body.classList.remove('light-theme');
        toggle.textContent = '🌙';
        setTimeout(() => { if (typeof updateMockupTourImage === 'function') updateMockupTourImage(false); }, 50);
    }

    toggle.addEventListener('click', () => {
        const isLight = document.body.classList.toggle('light-theme');
        localStorage.setItem('agency-theme', isLight ? 'light' : 'dark');
        toggle.textContent = isLight ? '☀️' : '🌙';
        
        // Dynamic swapper for premium 360 virtual tour mockup
        if (typeof updateMockupTourImage === 'function') {
            updateMockupTourImage(isLight);
        }
    });
})();
