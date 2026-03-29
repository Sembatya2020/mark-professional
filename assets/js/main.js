document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // PAGE TRANSITION — Fade in on load
    // ==========================================
    const pageTransition = document.querySelector('.page-transition');
    if (pageTransition) {
        requestAnimationFrame(() => pageTransition.classList.add('loaded'));
        setTimeout(() => { pageTransition.style.display = 'none'; }, 600);
    }

    // ==========================================
    // NAVBAR SCROLL EFFECT
    // ==========================================
    const navbar = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
        if (navbar && window.scrollY > 50) navbar.classList.add('scrolled');
        else if (navbar) navbar.classList.remove('scrolled');
    });

    // ==========================================
    // MOBILE MENU TOGGLE
    // ==========================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.setAttribute('data-lucide', navLinks.classList.contains('active') ? 'x' : 'menu');
            lucide.createIcons();
        });
    }

    // ==========================================
    // SCROLL REVEAL (+ staggered variants)
    // ==========================================
    const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    revealEls.forEach(el => revealObserver.observe(el));

    // ==========================================
    // TYPEWRITER EFFECT (Homepage hero only)
    // ==========================================
    const typewriterEl = document.querySelector('.typewriter-target');
    if (typewriterEl) {
        const fullText = typewriterEl.textContent;
        typewriterEl.textContent = '';
        typewriterEl.style.visibility = 'visible';
        const cursor = document.createElement('span');
        cursor.classList.add('typewriter-cursor');
        cursor.innerHTML = '&nbsp;';
        typewriterEl.appendChild(cursor);

        let i = 0;
        function typeChar() {
            if (i < fullText.length) {
                typewriterEl.insertBefore(document.createTextNode(fullText[i]), cursor);
                i++;
                setTimeout(typeChar, 50);
            } else {
                setTimeout(() => {
                    cursor.style.animation = 'none';
                    cursor.style.opacity = '0';
                    cursor.style.transition = 'opacity 0.5s';
                }, 2000);
            }
        }
        setTimeout(typeChar, 800);
    }

    // ==========================================
    // SCROLL-DOWN INDICATOR
    // ==========================================
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(scrollIndicator.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        });
        window.addEventListener('scroll', () => {
            scrollIndicator.style.opacity = Math.max(0, 1 - window.scrollY / 400);
        });
    }

    // ==========================================
    // BACK-TO-TOP BUTTON
    // ==========================================
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 500);
        });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ==========================================
    // PARALLAX HERO EFFECT
    // ==========================================
    const heroSection = document.querySelector('.section-hero.full-screen');
    if (heroSection) {
        const initialBgPosY = getComputedStyle(heroSection).backgroundPositionY || 'center';
        window.addEventListener('scroll', () => {
            if (window.scrollY < window.innerHeight) {
                const shift = window.scrollY * 0.15;
                heroSection.style.backgroundPositionY = `calc(${initialBgPosY} + ${shift}px)`;
            }
        });
    }

    // ==========================================
    // ANIMATED COUNTERS
    // ==========================================
    const counters = document.querySelectorAll('.stat-number[data-target]');
    if (counters.length) {
        const countObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const el = entry.target;
                    const target = parseInt(el.dataset.target);
                    const suffix = el.dataset.suffix || '';
                    const duration = 2000;
                    const start = performance.now();
                    function tick(now) {
                        const progress = Math.min((now - start) / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        el.textContent = Math.floor(eased * target) + suffix;
                        if (progress < 1) requestAnimationFrame(tick);
                        else el.textContent = target + suffix;
                    }
                    requestAnimationFrame(tick);
                    countObserver.unobserve(el);
                }
            });
        }, { threshold: 0.5 });
        counters.forEach(c => countObserver.observe(c));
    }

    // ==========================================
    // DARK MODE TOGGLE
    // ==========================================
    const darkToggle = document.getElementById('dark-mode-toggle');
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        setDarkIcon(true);
    }
    if (darkToggle) {
        darkToggle.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            setDarkIcon(isDark);
        });
    }
    function setDarkIcon(isDark) {
        const btn = document.getElementById('dark-mode-toggle');
        if (!btn) return;
        const icon = btn.querySelector('i');
        if (icon) {
            icon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
            if (typeof lucide !== 'undefined') lucide.createIcons();
        }
    }

    // ==========================================
    // PAGE TRANSITIONS — Intercept internal links
    // ==========================================
    document.querySelectorAll('a[href]').forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('http') && !href.startsWith('mailto') && !href.startsWith('#') && !href.startsWith('tel')) {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const t = document.querySelector('.page-transition');
                if (t) {
                    t.style.display = 'block';
                    t.classList.remove('loaded');
                    t.classList.add('navigating');
                    setTimeout(() => { window.location.href = href; }, 400);
                } else {
                    window.location.href = href;
                }
            });
        }
    });

    // ==========================================
    // CONTACT FORM — Formspree Integration
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Basic validation
            let valid = true;
            contactForm.querySelectorAll('input[required], textarea[required]').forEach(input => {
                if (!input.value.trim()) {
                    valid = false;
                    input.style.borderColor = '#e74c3c';
                    input.addEventListener('input', () => { input.style.borderColor = ''; }, { once: true });
                }
            });
            if (!valid) return;

            const btn = document.getElementById('submit-btn');
            const original = btn.innerHTML;

            // Loading state
            btn.innerHTML = '<span style="display:inline-flex;align-items:center;gap:8px"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> Sending...</span>';
            btn.disabled = true;

            try {
                const formData = new FormData(contactForm);
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    // ✅ Success
                    btn.innerHTML = '<span style="display:inline-flex;align-items:center;gap:8px">✓ Message Sent!</span>';
                    btn.style.backgroundColor = '#5a8a5a';
                    contactForm.reset();
                    setTimeout(() => {
                        btn.innerHTML = original;
                        btn.style.backgroundColor = '';
                        btn.disabled = false;
                    }, 4000);
                } else {
                    // ❌ Formspree error (e.g. ID not set yet)
                    throw new Error('Form not configured');
                }
            } catch (err) {
                btn.innerHTML = '<span style="display:inline-flex;align-items:center;gap:8px">⚠ Please email directly</span>';
                btn.style.backgroundColor = '#c0392b';
                setTimeout(() => {
                    btn.innerHTML = original;
                    btn.style.backgroundColor = '';
                    btn.disabled = false;
                }, 4000);
            }
        });
    }

    // ==========================================
    // DYNAMIC FOOTER YEAR
    // ==========================================
    document.querySelectorAll('.footer-year').forEach(el => {
        el.textContent = new Date().getFullYear();
    });

    // ==========================================
    // INITIALIZE LUCIDE ICONS
    // ==========================================
    if (typeof lucide !== 'undefined') lucide.createIcons();
});
