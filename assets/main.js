/* ============================================================
   GERHARD MACHENS · BAUELEMENTE MONTAGEN
   Hörmann Hannover · Shared JavaScript (alle Seiten)
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     1) Sticky Nav: Schatten + Verkleinerung beim Scrollen
     ---------------------------------------------------------- */
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 30) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ----------------------------------------------------------
     2) Mobile Menu (Drawer)
     ---------------------------------------------------------- */
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      mobileMenu.setAttribute('aria-hidden', open ? 'false' : 'true');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        burger.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ----------------------------------------------------------
     3) Scroll Reveal mit IntersectionObserver
     ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ----------------------------------------------------------
     4) Stat Counter (sanftes Hochzählen)
     ---------------------------------------------------------- */
  const statEls = document.querySelectorAll('.stat-num[data-count]');
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.textContent.replace(/[\d]/g, '').trim();
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const ease = 1 - Math.pow(1 - p, 3);
      const value = Math.round(target * ease);
      el.textContent = value + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window && statEls.length) {
    const sio = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          sio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statEls.forEach(el => sio.observe(el));
  }

  /* ----------------------------------------------------------
     5) Smooth Anchor Scrolling (Offset für Sticky Nav)
     ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const targetId = a.getAttribute('href');
      if (targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ----------------------------------------------------------
     6) Footer-Jahreszahl
     ---------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----------------------------------------------------------
     7) ANFRAGE-FORMULAR — Netlify Forms Integration

     Das Formular wird per fetch() an Netlify gesendet
     (URL-encoded body, wie Netlify es erwartet).
     Bei Erfolg zeigen wir die Bestätigung inline,
     ohne Page-Reload.

     Für reine No-JS-Browser greift der HTML-Fallback:
     action="/danke.html" leitet dann direkt weiter.
     ---------------------------------------------------------- */
  const form = document.getElementById('contactForm');
  const msg  = document.getElementById('formMsg');

  if (form && msg) {
    // Helper: codiert Daten als x-www-form-urlencoded String
    const encode = (data) => {
      return Object.keys(data)
        .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
        .join('&');
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      msg.className = 'form-msg';
      msg.textContent = '';

      // Pflichtfelder prüfen
      const required = form.querySelectorAll('[required]');
      let allValid = true;
      required.forEach(field => {
        if (field.type === 'checkbox') {
          if (!field.checked) allValid = false;
        } else if (!field.value.trim()) {
          allValid = false;
        }
      });

      // E-Mail-Format prüfen
      const email = form.querySelector('#email');
      if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        allValid = false;
      }

      // Mind. ein Produktinteresse muss angekreuzt sein
      const checked = form.querySelectorAll('input[name="interests"]:checked');
      if (checked.length === 0) allValid = false;

      if (!allValid) {
        msg.classList.add('error');
        msg.textContent = 'Bitte füllen Sie alle Pflichtfelder aus, wählen Sie mindestens ein Produktinteresse und akzeptieren Sie die Datenschutzerklärung.';
        return;
      }

      // Submit-Button während des Sendens deaktivieren
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.innerHTML : '';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.6';
        submitBtn.style.cursor = 'wait';
        submitBtn.innerHTML = 'Wird gesendet…';
      }

      // FormData → flaches Objekt; Mehrfach-Checkboxen werden komma-separiert
      const fd = new FormData(form);
      const data = {};
      fd.forEach((value, key) => {
        if (data[key]) {
          data[key] = data[key] + ', ' + value;
        } else {
          data[key] = value;
        }
      });

      try {
        const response = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: encode(data)
        });

        if (response.ok) {
          msg.classList.add('success');
          msg.textContent = 'Vielen Dank! Ihre Anfrage wurde erfolgreich übermittelt. Wir melden uns kurzfristig bei Ihnen unter der angegebenen Telefonnummer oder E-Mail-Adresse.';
          form.reset();
          msg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          throw new Error('Server-Antwort: ' + response.status);
        }
      } catch (err) {
        console.error('Form-Fehler:', err);
        msg.classList.add('error');
        msg.textContent = 'Es gab leider ein Problem beim Senden. Bitte versuchen Sie es erneut oder rufen Sie uns direkt an: 05131 / 463233.';
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.style.opacity = '';
          submitBtn.style.cursor = '';
          submitBtn.innerHTML = originalText;
        }
      }
    });
  }

  /* ----------------------------------------------------------
     8) Sanfter Parallax-Effekt für Hero-Visual (nur Desktop)
     ---------------------------------------------------------- */
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual && window.matchMedia('(min-width: 1080px)').matches) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < 800) {
        heroVisual.style.transform = `translateY(${y * 0.06}px)`;
      }
    }, { passive: true });
  }
})();
