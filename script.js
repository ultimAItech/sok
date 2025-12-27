/**
 * Houthandel Jan Sok - Premium JavaScript
 * Scroll animations, interactive effects, and smooth transitions
 */

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all premium features
    initScrollAnimations();
    initHeaderScroll();
    initSmoothScrollLinks();
    initCartSidebar();
    initProductCardEffects();
    initMobileMenu();
    initSearchModal();
});

/**
 * Scroll Animations - Fade in elements on scroll using data-attributes
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add fade-in class and observe all elements with data-animate attribute
    const elementsToAnimate = document.querySelectorAll('[data-animate]');
    elementsToAnimate.forEach((el, index) => {
        const animationClass = el.dataset.animate;
        if (animationClass) {
            el.classList.add(animationClass);
        }
        el.style.transitionDelay = `${index * 0.05}s`;
        observer.observe(el);
    });
}

/**
 * Header scroll effect - Add shadow and compact style on scroll
 */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScrollY = 0;
    let ticking = false;

    function updateHeader() {
        const scrollY = window.scrollY;

        if (scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }, { passive: true });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScrollLinks() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Cart Sidebar toggle functionality
 */
function initCartSidebar() {
    const cartBtn = document.querySelector('.cart-btn');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const closeCartBtn = document.querySelector('.close-cart');

    if (!cartBtn || !cartSidebar) return;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'cart-overlay';
    overlay.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        z-index: 1999;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    `;
    document.body.appendChild(overlay);

    function openCart() {
        cartSidebar.classList.add('open');
        overlay.style.opacity = '1';
        overlay.style.visibility = 'visible';
        document.body.style.overflow = 'hidden';
    }

    function closeCart() {
        cartSidebar.classList.remove('open');
        overlay.style.opacity = '0';
        overlay.style.visibility = 'hidden';
        document.body.style.overflow = '';
    }

    cartBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openCart();
    });

    closeCartBtn?.addEventListener('click', closeCart);
    overlay.addEventListener('click', closeCart);

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && cartSidebar.classList.contains('open')) {
            closeCart();
        }
    });
}

/**
 * Product card hover effects with 3D tilt using event delegation
 */
function initProductCardEffects() {
    const cardContainers = document.querySelectorAll('.products-grid, .cta-grid');

    cardContainers.forEach(container => {
        container.addEventListener('mousemove', (e) => {
            const card = e.target.closest('.product-card, .cta-card');
            if (!card) return;

            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            card.style.transform = `perspective(1000px) translateY(-8px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        container.addEventListener('mouseleave', (e) => {
            const card = e.target.closest('.product-card, .cta-card');
            if (card) {
                card.style.transform = '';
            }
        });
    });
}

/**
 * Search bar focus animation
 */
const searchBar = document.querySelector('.search-bar');
const searchInput = searchBar?.querySelector('input');

if (searchInput) {
    searchInput.addEventListener('focus', () => {
        searchBar.style.transform = 'scale(1.02)';
    });

    searchInput.addEventListener('blur', () => {
        searchBar.style.transform = '';
    });
}

/**
 * Add parallax effect to hero section - Smooth & Mobile Optimized
 */
const hero = document.querySelector('.hero-image');
if (hero) {
    const heroImg = hero.querySelector('img');
    let currentTranslateY = 0;
    let targetTranslateY = 0;
    let rafId = null;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Disable parallax on mobile or if user prefers reduced motion
    if (!isMobile && !isReducedMotion && heroImg) {
        // Smooth lerp function for buttery animations
        function lerp(start, end, factor) {
            return start + (end - start) * factor;
        }

        function updateParallax() {
            // Smoothly interpolate towards target (lower = smoother, higher = snappier)
            currentTranslateY = lerp(currentTranslateY, targetTranslateY, 0.08);

            // Apply transform with GPU acceleration
            heroImg.style.transform = `translate3d(0, ${currentTranslateY}px, 0) scale(1.1)`;

            // Continue animation loop if there's still movement
            if (Math.abs(targetTranslateY - currentTranslateY) > 0.1) {
                rafId = requestAnimationFrame(updateParallax);
            } else {
                rafId = null;
            }
        }

        function onScroll() {
            const scrolled = window.scrollY;
            if (scrolled < 800) {
                targetTranslateY = scrolled * 0.25;

                // Start animation loop if not already running
                if (!rafId) {
                    rafId = requestAnimationFrame(updateParallax);
                }
            }
        }

        window.addEventListener('scroll', onScroll, { passive: true });

        // Initial call
        onScroll();
    } else if (heroImg) {
        // On mobile, just set a static scale without parallax
        heroImg.style.transform = 'scale(1.02)';
    }
}

/**
 * Number counter animation for stats (if present)
 */
function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');

    counters.forEach(counter => {
        const target = parseInt(counter.dataset.count);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        // Start animation when element is visible
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                updateCounter();
                observer.unobserve(counter);
            }
        });

        observer.observe(counter);
    });
}

// Initialize counters if present
animateCounters();

/**
 * Add ripple effect to buttons
 */
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;

        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});


console.log('✨ Houthandel Jan Sok Premium JS Loaded');

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelectorAll('.main-nav a');

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            document.body.classList.toggle('nav-open');

            // Transform hamburger to X
            const isOpen = document.body.classList.contains('nav-open');
            if (isOpen) {
                menuBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                `;
            } else {
                menuBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                `;
            }
        });
    }

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            document.body.classList.remove('nav-open');
            if (menuBtn) {
                menuBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                `;
            }
        });
    });
}


/**
 * Search Modal Toggle
 */
function initSearchModal() {
    const searchBtn = document.querySelector(".search-btn");
    const searchModal = document.querySelector(".search-modal");
    const closeSearchBtn = document.querySelector(".close-search");
    const searchInput = document.querySelector(".search-modal input");
    
    if (searchBtn && searchModal) {
        // Open search modal
        searchBtn.addEventListener("click", () => {
            searchModal.classList.add("open");
            document.body.style.overflow = "hidden";
            // Focus input after animation
            setTimeout(() => searchInput?.focus(), 100);
        });
        
        // Close search modal
        function closeSearch() {
            searchModal.classList.remove("open");
            document.body.style.overflow = "";
        }
        
        closeSearchBtn?.addEventListener("click", closeSearch);
        
        // Close on background click
        searchModal.addEventListener("click", (e) => {
            if (e.target === searchModal) {
                closeSearch();
            }
        });
        
        // Close on Escape key
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && searchModal.classList.contains("open")) {
                closeSearch();
            }
        });
    }
}
