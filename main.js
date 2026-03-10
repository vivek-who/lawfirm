/**
 * Advocates & Associates — main.js v2.0
 * Handles: sticky navbar, mobile menu, scroll reveal,
 *          smooth scroll, active nav links, form handling,
 *          FAQ accordion
 */

(function () {
  'use strict';

  /* ============================================================
     1. DOM REFERENCES
  ============================================================ */
  const navbar        = document.getElementById('navbar');
  const hamburger     = document.getElementById('hamburger');
  const mobileNav     = document.getElementById('mobileNav');
  const mobileLinks   = document.querySelectorAll('.mobile-nav__link, .mobile-nav__cta');
  const navLinks      = document.querySelectorAll('.navbar__link');
  const sections      = document.querySelectorAll('main section[id]');
  const contactForm   = document.getElementById('contactForm');
  const formSuccess   = document.getElementById('formSuccess');
  const revealEls     = document.querySelectorAll('.reveal-on-scroll');
  const heroRevealEls = document.querySelectorAll('.reveal-hero');
  const faqItems      = document.querySelectorAll('.faq__item');

  /* ============================================================
     2. HERO — ENTRANCE ANIMATIONS
  ============================================================ */
  function initHeroAnimations() {
    setTimeout(function () {
      heroRevealEls.forEach(function (el) {
        el.classList.add('animate');
      });
    }, 120);
  }

  /* ============================================================
     3. STICKY NAVBAR
  ============================================================ */
  function initStickyNavbar() {
    function onScroll() {
      var scrollY = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollY > 30) {
        navbar.classList.add('is-scrolled');
      } else {
        navbar.classList.remove('is-scrolled');
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ============================================================
     4. ACTIVE NAV LINK HIGHLIGHT
  ============================================================ */
  function initActiveNavHighlight() {
    var sectionMap = [];
    sections.forEach(function (section) {
      sectionMap.push({ id: section.id, el: section });
    });

    function updateActiveLink() {
      var scrollY   = window.pageYOffset || document.documentElement.scrollTop;
      var navbarH   = navbar ? navbar.offsetHeight : 72;
      var threshold = navbarH + 80;
      var currentId = '';

      sectionMap.forEach(function (entry) {
        var top = entry.el.getBoundingClientRect().top + scrollY;
        if (scrollY + threshold >= top) {
          currentId = entry.id;
        }
      });

      navLinks.forEach(function (link) {
        var href = link.getAttribute('href');
        if (href === '#' + currentId) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();
  }

  /* ============================================================
     5. MOBILE MENU
  ============================================================ */
  function initMobileMenu() {
    if (!hamburger || !mobileNav) return;

    function openMenu() {
      mobileNav.classList.add('is-open');
      hamburger.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      hamburger.setAttribute('aria-expanded', 'true');
      mobileNav.setAttribute('aria-hidden', 'false');
    }

    function closeMenu() {
      mobileNav.classList.remove('is-open');
      hamburger.classList.remove('is-open');
      document.body.style.overflow = '';
      hamburger.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden', 'true');
    }

    hamburger.addEventListener('click', function () {
      if (mobileNav.classList.contains('is-open')) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        closeMenu();
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileNav.classList.contains('is-open')) {
        closeMenu();
        hamburger.focus();
      }
    });

    mobileNav.addEventListener('click', function (e) {
      if (e.target === mobileNav) {
        closeMenu();
      }
    });
  }

  /* ============================================================
     6. SMOOTH SCROLL
  ============================================================ */
  function initSmoothScroll() {
    var anchors     = document.querySelectorAll('a[href^="#"]');
    var navbarHeight = navbar ? navbar.offsetHeight : 72;

    anchors.forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = anchor.getAttribute('href');
        if (!targetId || targetId === '#') return;

        var targetEl = document.querySelector(targetId);
        if (!targetEl) return;

        e.preventDefault();

        var targetTop =
          targetEl.getBoundingClientRect().top +
          (window.pageYOffset || document.documentElement.scrollTop) -
          navbarHeight;

        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      });
    });
  }

  /* ============================================================
     7. SCROLL REVEAL (Intersection Observer)
  ============================================================ */
  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var siblings = entry.target.parentElement
              ? entry.target.parentElement.querySelectorAll('.reveal-on-scroll')
              : null;

            if (siblings && siblings.length > 1) {
              var index = Array.from(siblings).indexOf(entry.target);
              entry.target.style.transitionDelay = index * 0.1 + 's';
            }

            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  }

  /* ============================================================
     8. FAQ ACCORDION
     Pure JS toggling of .is-open class; animation is CSS only
     (max-height transition on .faq__answer).
     Supports keyboard navigation and aria-expanded.
  ============================================================ */
  function initFaqAccordion() {
    if (!faqItems.length) return;

    faqItems.forEach(function (item) {
      var btn    = item.querySelector('.faq__question');
      var answer = item.querySelector('.faq__answer');
      if (!btn || !answer) return;

      btn.addEventListener('click', function () {
        var isOpen = item.classList.contains('is-open');

        // Close all other open items (one-at-a-time accordion behaviour)
        faqItems.forEach(function (other) {
          if (other !== item) {
            other.classList.remove('is-open');
            var otherBtn = other.querySelector('.faq__question');
            if (otherBtn) {
              otherBtn.setAttribute('aria-expanded', 'false');
            }
          }
        });

        // Toggle current
        if (isOpen) {
          item.classList.remove('is-open');
          btn.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('is-open');
          btn.setAttribute('aria-expanded', 'true');

          // Smooth scroll so opened answer is in view
          setTimeout(function () {
            var navH   = navbar ? navbar.offsetHeight : 72;
            var itemTop =
              item.getBoundingClientRect().top +
              (window.pageYOffset || document.documentElement.scrollTop) -
              navH - 20;

            // Only scroll if the item is partially above the viewport
            if (item.getBoundingClientRect().top < navH + 20) {
              window.scrollTo({ top: itemTop, behavior: 'smooth' });
            }
          }, 50);
        }
      });

      // Keyboard: Space and Enter both trigger click (button does this natively,
      // but ensure aria state is kept consistent)
      btn.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          var nextItem = item.nextElementSibling;
          if (nextItem) {
            var nextBtn = nextItem.querySelector('.faq__question');
            if (nextBtn) nextBtn.focus();
          }
        }
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          var prevItem = item.previousElementSibling;
          if (prevItem) {
            var prevBtn = prevItem.querySelector('.faq__question');
            if (prevBtn) prevBtn.focus();
          }
        }
      });
    });
  }

  /* ============================================================
     9. CONTACT FORM HANDLING
  ============================================================ */
  function initContactForm() {
    if (!contactForm) return;

    var submitBtn = contactForm.querySelector('#formSubmit');
    var successEl = document.getElementById('formSuccess');

    function setLoading(loading) {
      if (!submitBtn) return;
      submitBtn.disabled = loading;
      var btnText = submitBtn.querySelector('.btn__text');
      if (btnText) {
        btnText.textContent = loading ? 'Sending\u2026' : 'Send Consultation Request';
      }
      submitBtn.style.opacity = loading ? '0.7' : '';
    }

    function showSuccessMessage() {
      if (!successEl) return;
      successEl.innerHTML =
        '<span style="flex-shrink:0;font-size:16px;">\u2713</span>' +
        '<span>Your enquiry has been submitted successfully. We will contact you within 24 hours.</span>';
      successEl.style.cssText =
        'display:flex;align-items:center;gap:8px;' +
        'background:#F0FDF4;border:1px solid #86EFAC;color:#166534;' +
        'border-radius:var(--radius-sm, 4px);padding:var(--space-3, 12px) var(--space-4, 16px);' +
        'font-family:var(--font-body);font-size:var(--text-sm, 13px);' +
        'margin-top:var(--space-3, 12px);' +
        'opacity:0;transition:opacity 0.3s ease;';
      // Force reflow then fade in
      successEl.getBoundingClientRect();
      successEl.style.opacity = '1';

      // Reset form after 5 seconds
      setTimeout(function () {
        // Fade out
        successEl.style.opacity = '0';
        setTimeout(function () {
          successEl.innerHTML = '';
          successEl.removeAttribute('style');
          // Reset all form fields
          contactForm.querySelectorAll('input, select, textarea').forEach(function (field) {
            field.value = '';
            field.classList.remove('field--error');
            field.style.borderColor = '';
          });
          // Re-enable submit
          setLoading(false);
        }, 300);
      }, 5000);
    }

    function validateFields() {
      var fields = contactForm.querySelectorAll('[required]');
      var valid = true;
      fields.forEach(function (field) {
        var isEmpty =
          field.value.trim() === '' ||
          (field.tagName === 'SELECT' && !field.value);
        if (isEmpty) {
          field.style.borderColor = '#DC2626';
          field.style.borderWidth = '2px';
          field.style.borderStyle = 'solid';
          valid = false;
        } else {
          field.style.borderColor = '';
          field.style.borderWidth = '';
        }
      });
      return valid;
    }

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!validateFields()) {
        return;
      }

      setLoading(true);
      showSuccessMessage();
    });

    // Clear red border on input
    var requiredFields = contactForm.querySelectorAll('[required]');
    requiredFields.forEach(function (field) {
      field.addEventListener('input', function () {
        field.style.borderColor = '';
        field.style.borderWidth = '';
        field.classList.remove('field--error');
      });
      field.addEventListener('change', function () {
        field.style.borderColor = '';
        field.style.borderWidth = '';
        field.classList.remove('field--error');
      });
    });
  }

  /* ============================================================
     10. TRUST BAR — entrance animation
  ============================================================ */
  function initTrustBar() {
    var trustBar = document.getElementById('trustBar');
    if (!trustBar || !('IntersectionObserver' in window)) return;

    var items = trustBar.querySelectorAll('.trust-bar__item');
    items.forEach(function (item) {
      item.style.opacity   = '0';
      item.style.transform = 'translateY(12px)';
    });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            items.forEach(function (item, idx) {
              setTimeout(function () {
                item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                item.style.opacity    = '1';
                item.style.transform  = 'translateY(0)';
              }, idx * 100);
            });
            observer.unobserve(trustBar);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(trustBar);
  }

  /* ============================================================
     11. SERVICE CARDS — per-card stagger
  ============================================================ */
  function initServiceCards() {
    var grid = document.querySelector('.services__grid');
    if (!grid || !('IntersectionObserver' in window)) return;

    var cards = grid.querySelectorAll('.service-card');

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var idx = Array.from(cards).indexOf(entry.target);
            entry.target.style.transitionDelay = (idx % 3) * 0.1 + 's';
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    cards.forEach(function (card) {
      observer.observe(card);
    });
  }

  /* ============================================================
     12. PROCESS CARDS — per-card stagger
  ============================================================ */
  function initProcessCards() {
    var grid = document.querySelector('.process__grid');
    if (!grid || !('IntersectionObserver' in window)) return;

    var cards = grid.querySelectorAll('.process-card');

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var idx = Array.from(cards).indexOf(entry.target);
            entry.target.style.transitionDelay = idx * 0.12 + 's';
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    cards.forEach(function (card) {
      observer.observe(card);
    });
  }

  /* ============================================================
     13. RESIZE HANDLER
  ============================================================ */
  function initResizeHandler() {
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (
          window.innerWidth > 768 &&
          mobileNav.classList.contains('is-open')
        ) {
          mobileNav.classList.remove('is-open');
          hamburger.classList.remove('is-open');
          document.body.style.overflow = '';
        }
      }, 200);
    });
  }

  /* ============================================================
     14. DISCLAIMER OVERLAY (index.html only — once per session)
  ============================================================ */
  function initDisclaimerOverlay() {
    var overlay     = document.getElementById('disclaimerOverlay');
    var agreeBtn    = document.getElementById('disclaimerAgree');
    var disagreeBtn = document.getElementById('disclaimerDisagree');
    if (!overlay || !agreeBtn || !disagreeBtn) return;

    // Show only once per browser session
    if (sessionStorage.getItem('disclaimerAgreed') === 'true') {
      // Already agreed this session — keep overlay hidden (it starts as display:none)
      return;
    }

    // Show the overlay
    overlay.style.display = 'flex';

    // Lock scroll via CSS class — avoids conflict with mobile menu's
    // closeMenu() which clears body.style.overflow
    document.body.classList.add('disclaimer-active');

    var mainContent = document.querySelector('main');
    var navbarEl    = document.getElementById('navbar');
    var footerEl    = document.getElementById('footer');
    if (mainContent) mainContent.classList.add('disclaimer-blur');
    if (navbarEl)    navbarEl.classList.add('disclaimer-blur');
    if (footerEl)    footerEl.classList.add('disclaimer-blur');

    function dismissOverlay() {
      sessionStorage.setItem('disclaimerAgreed', 'true');
      overlay.classList.add('is-hiding');
      document.body.classList.remove('disclaimer-active');
      if (mainContent) mainContent.classList.remove('disclaimer-blur');
      if (navbarEl)    navbarEl.classList.remove('disclaimer-blur');
      if (footerEl)    footerEl.classList.remove('disclaimer-blur');
      setTimeout(function () {
        overlay.style.display = 'none';
      }, 520);
    }

    agreeBtn.addEventListener('click', function () {
      dismissOverlay();
    });

    disagreeBtn.addEventListener('click', function () {
      window.location.href = 'https://www.google.com';
    });
  }

  /* ============================================================
     15. TESTIMONIALS SHOW MORE / SHOW LESS (mobile only)
  ============================================================ */
  function initTestimonialsShowMore() {
    var toggleBtn = document.getElementById('testimonialsToggleBtn');
    var card3     = document.getElementById('testimonial-card-3');
    var card4     = document.getElementById('testimonial-card-4');
    if (!toggleBtn || !card3 || !card4) return;

    var expanded = false;

    toggleBtn.addEventListener('click', function () {
      expanded = !expanded;

      if (expanded) {
        // Reveal cards 3 & 4
        card3.classList.remove('testimonial-card--hidden-mobile');
        card4.classList.remove('testimonial-card--hidden-mobile');
        card3.classList.add('testimonial-card--revealed');
        card4.classList.add('testimonial-card--revealed');
        toggleBtn.textContent = 'Show Less';
        toggleBtn.setAttribute('aria-expanded', 'true');
      } else {
        // Hide cards 3 & 4 again
        card3.classList.add('testimonial-card--hidden-mobile');
        card4.classList.add('testimonial-card--hidden-mobile');
        card3.classList.remove('testimonial-card--revealed');
        card4.classList.remove('testimonial-card--revealed');
        toggleBtn.textContent = 'Show More Reviews';
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ============================================================
     16. PAGE TRANSITIONS — fade out before navigating
  ============================================================ */
  function initPageTransitions() {
    var mainEl   = document.querySelector('main');
    var navbarEl = document.getElementById('navbar');
    var footerEl = document.getElementById('footer');

    var links = document.querySelectorAll('a[href]');
    links.forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;
      // Skip hash-only, mailto, tel, external, and blank targets
      if (
        href.startsWith('#') ||
        href.startsWith('mailto') ||
        href.startsWith('tel') ||
        href.startsWith('http') ||
        href.startsWith('//') ||
        link.getAttribute('target') === '_blank'
      ) return;

      link.addEventListener('click', function (e) {
        e.preventDefault();
        // Add exit class to content elements ONLY — never touches the overlay
        if (mainEl)   mainEl.classList.add('page-exit');
        if (navbarEl) navbarEl.classList.add('page-exit');
        if (footerEl) footerEl.classList.add('page-exit');
        var dest = href;
        setTimeout(function () {
          window.location.href = dest;
        }, 260);
      });
    });
  }

  /* ============================================================
     INIT — run all modules on DOM ready
  ============================================================ */
  function init() {
    initDisclaimerOverlay();
    initPageTransitions();
    initHeroAnimations();
    initStickyNavbar();
    initActiveNavHighlight();
    initMobileMenu();
    initSmoothScroll();
    initScrollReveal();
    initFaqAccordion();
    initContactForm();
    initTrustBar();
    initServiceCards();
    initProcessCards();
    initResizeHandler();
    initTestimonialsShowMore();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
