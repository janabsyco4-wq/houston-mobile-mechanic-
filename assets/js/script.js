/* ============================================================
   Houston Mobile Mechanic & Diesel Repair LLC — interactions
   ============================================================ */
(function () {
  'use strict';

  var PHONE_TEL = 'tel:+18322491533';

  // TODO: Replace with the business's real Google Business Profile review URL.
  var GOOGLE_REVIEWS_URL = 'https://www.google.com/search?q=Houston+Mobile+Mechanic+%26+Diesel+Repair+LLC+reviews';
  document.querySelectorAll('a[data-reviews-link]').forEach(function (a) {
    a.setAttribute('href', GOOGLE_REVIEWS_URL);
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener');
  });

  /* ---------- Sticky header state ---------- */
  var header = document.querySelector('.header');
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 24) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile navigation ---------- */
  var hamburger = document.querySelector('.hamburger');
  var mobileNav = document.querySelector('.mobile-nav');
  function setNav(open) {
    if (!hamburger || !mobileNav) return;
    hamburger.classList.toggle('open', open);
    mobileNav.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  if (hamburger) {
    hamburger.addEventListener('click', function () {
      setNav(!mobileNav.classList.contains('open'));
    });
  }
  document.addEventListener('click', function (e) {
    if (!mobileNav || !mobileNav.classList.contains('open')) return;
    if (mobileNav.contains(e.target) || (hamburger && hamburger.contains(e.target))) return;
    setNav(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setNav(false);
  });
  if (mobileNav) {
    mobileNav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setNav(false); });
    });
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var btn = item.querySelector('.faq-q');
    var panel = item.querySelector('.faq-a');
    if (!btn || !panel) return;
    btn.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      // close others in same list
      var list = item.closest('.faq-list');
      if (list) {
        list.querySelectorAll('.faq-item.open').forEach(function (o) {
          if (o !== item) {
            o.classList.remove('open');
            var op = o.querySelector('.faq-a');
            var ob = o.querySelector('.faq-q');
            if (op) op.style.maxHeight = null;
            if (ob) ob.setAttribute('aria-expanded', 'false');
          }
        });
      }
      item.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
      panel.style.maxHeight = !isOpen ? panel.scrollHeight + 'px' : null;
    });
  });

  /* ---------- Scroll reveal ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in-view'); });
  }

  /* ---------- Service area interactive map ---------- */
  var areaTags = document.querySelectorAll('.area-tag[data-area]');
  var mapDots = document.querySelectorAll('.map-dot[data-area]');
  function highlightArea(name, on) {
    mapDots.forEach(function (d) {
      if (d.getAttribute('data-area') === name) d.classList.toggle('active', on);
    });
    areaTags.forEach(function (t) {
      if (t.getAttribute('data-area') === name) t.classList.toggle('active', on);
    });
  }
  areaTags.forEach(function (tag) {
    var name = tag.getAttribute('data-area');
    tag.addEventListener('mouseenter', function () { highlightArea(name, true); });
    tag.addEventListener('mouseleave', function () { highlightArea(name, false); });
    tag.addEventListener('focus', function () { highlightArea(name, true); });
    tag.addEventListener('blur', function () { highlightArea(name, false); });
  });
  mapDots.forEach(function (dot) {
    var name = dot.getAttribute('data-area');
    dot.addEventListener('mouseenter', function () { highlightArea(name, true); });
    dot.addEventListener('mouseleave', function () { highlightArea(name, false); });
  });

  /* ---------- Quote / contact form ---------- */
  var form = document.getElementById('quote-form');
  if (form) {
    var status = form.querySelector('.form-status');

    function setError(field, msg) {
      var wrap = field.closest('.form-field');
      if (wrap) wrap.classList.add('error');
      var errEl = wrap && wrap.querySelector('.field-error');
      if (errEl && msg) errEl.textContent = msg;
    }
    function clearError(field) {
      var wrap = field.closest('.form-field');
      if (wrap) wrap.classList.remove('error');
    }
    function showStatus(type, message) {
      if (!status) return;
      status.className = 'form-status show ' + type;
      status.innerHTML = (type === 'success'
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></svg>')
        + '<span>' + message + '</span>';
      status.setAttribute('role', type === 'success' ? 'status' : 'alert');
    }

    var validators = {
      name: function (v) { return v.trim().length >= 2 ? '' : 'Please enter your name.'; },
      phone: function (v) {
        var digits = v.replace(/\D/g, '');
        return digits.length >= 10 ? '' : 'Please enter a valid phone number.';
      },
      email: function (v) {
        if (!v.trim()) return '';
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Please enter a valid email address.';
      },
      location: function (v) { return v.trim().length >= 2 ? '' : 'Please tell us where the vehicle is located.'; },
      service: function (v) { return v ? '' : 'Please select a service.'; }
    };

    Object.keys(validators).forEach(function (name) {
      var field = form.elements[name];
      if (!field) return;
      field.addEventListener('blur', function () {
        var msg = validators[name](field.value);
        if (msg) setError(field, msg); else clearError(field);
      });
      field.addEventListener('input', function () { clearError(field); });
      field.addEventListener('change', function () { clearError(field); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var firstBad = null;
      Object.keys(validators).forEach(function (name) {
        var field = form.elements[name];
        if (!field) return;
        var msg = validators[name](field.value);
        if (msg) { setError(field, msg); if (!firstBad) firstBad = field; }
        else clearError(field);
      });

      if (firstBad) {
        showStatus('error', 'Please fix the highlighted fields and try again.');
        firstBad.focus();
        return;
      }

      // Simulate async submit. Replace this block with a real endpoint
      // (e.g. fetch('/api/quote', {method:'POST', body:new FormData(form)}))
      // when a backend / form service is connected.
      var submitBtn = form.querySelector('button[type="submit"]');
      var original = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) { submitBtn.disabled = true; submitBtn.innerHTML = 'Sending…'; }

      window.setTimeout(function () {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.innerHTML = original; }
        showStatus('success', 'Thanks! Your request was received. For fastest service, call us now at (832) 249-1533 — we answer 24/7.');
        form.reset();
      }, 900);
    });
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Ensure all call links are click-to-call ---------- */
  document.querySelectorAll('a[data-call]').forEach(function (a) {
    if (!a.getAttribute('href') || a.getAttribute('href') === '#') a.setAttribute('href', PHONE_TEL);
  });
})();
