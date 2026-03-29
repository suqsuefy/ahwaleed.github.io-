/* ============================================================
   MAIN.JS — Video Editor Portfolio
   ============================================================ */

'use strict';

/* ---- Navbar scroll effect ---- */
(function () {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function updateNavbar() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();
})();

/* ---- Active nav link on scroll ---- */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');

  function updateActiveLink() {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
      const top    = section.offsetTop;
      const height = section.offsetHeight;
      const id     = section.getAttribute('id');
      if (scrollY >= top && scrollY < top + height) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
})();

/* ---- Mobile nav toggle ---- */
(function () {
  const toggle   = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const isOpen = navLinks.classList.contains('open');
    toggle.setAttribute('aria-label', isOpen ? 'إغلاق القائمة' : 'فتح القائمة');
  });

  // Close on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });
})();

/* ---- AOS (Animate On Scroll) — lightweight custom implementation ---- */
(function () {
  const elements = document.querySelectorAll('[data-aos]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.getAttribute('data-aos-delay') || '0', 10);
        setTimeout(() => {
          entry.target.classList.add('aos-animate');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
})();

/* ---- Counting stat numbers ---- */
(function () {
  const numbers = document.querySelectorAll('.stat-number[data-target]');
  if (!numbers.length) return;

  function animateCount(el) {
    const target   = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1800;
    const fps      = 60;
    const totalFrames = Math.round((duration / 1000) * fps);
    const increment   = Math.max(1, Math.ceil(target / totalFrames));
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + increment, target);
      el.textContent = current;
      if (current >= target) {
        clearInterval(timer);
      }
    }, Math.round(1000 / fps));
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  numbers.forEach(el => observer.observe(el));
})();

/* ---- Skill bars animation ---- */
(function () {
  const fills = document.querySelectorAll('.skill-fill[data-width]');
  if (!fills.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const width = entry.target.getAttribute('data-width');
        entry.target.style.width = width + '%';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  fills.forEach(el => observer.observe(el));
})();

/* ---- Circle skill progress ---- */
(function () {
  const circles = document.querySelectorAll('.circle-progress[data-percent]');
  if (!circles.length) return;

  const CIRCUMFERENCE = 2 * Math.PI * 32; // r=32

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const percent = parseInt(entry.target.getAttribute('data-percent'), 10);
        const filled  = (percent / 100) * CIRCUMFERENCE;
        entry.target.style.strokeDasharray = `${filled} ${CIRCUMFERENCE}`;
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  circles.forEach(el => observer.observe(el));
})();

/* ---- Works filter ---- */
(function () {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workCards  = document.querySelectorAll('.work-card[data-category]');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      workCards.forEach(card => {
        const show = filter === 'all' || card.getAttribute('data-category') === filter;
        if (show) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
})();

/* ---- Testimonials auto-slider ---- */
(function () {
  const track = document.getElementById('testimonialsTrack');
  const dots  = document.querySelectorAll('.t-dot');
  if (!track || !dots.length) return;

  let current  = 0;
  const total  = dots.length;
  let autoTimer;

  function goTo(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(autoTimer);
      goTo(parseInt(dot.getAttribute('data-index'), 10));
      startAuto();
    });
  });

  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }

  // RTL fix: translate in positive direction for RTL
  function goToRTL(index) {
    current = (index + total) % total;
    track.style.transform = `translateX(${current * -100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  // Override goTo with RTL-aware version
  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(autoTimer);
      goToRTL(parseInt(dot.getAttribute('data-index'), 10));
      autoTimer = setInterval(() => goToRTL(current + 1), 5000);
    });
  });

  autoTimer = setInterval(() => goToRTL(current + 1), 5000);
})();

/* ---- Contact form ---- */
(function () {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name    = form.querySelector('#name').value.trim();
    const email   = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();

    if (!name || !email || !message) {
      // Simple shake animation on missing fields
      [form.querySelector('#name'), form.querySelector('#email'), form.querySelector('#message')].forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = '#e63946';
          field.addEventListener('input', () => { field.style.borderColor = ''; }, { once: true });
        }
      });
      return;
    }

    // Simulate successful send (replace with real backend/EmailJS as needed)
    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> جارٍ الإرسال...';

    setTimeout(() => {
      form.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> إرسال الرسالة';
      if (success) {
        success.classList.add('show');
        setTimeout(() => success.classList.remove('show'), 5000);
      }
    }, 1200);
  });
})();

/* ---- Back to top ---- */
(function () {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ---- Smooth anchor scrolling offset for fixed navbar ---- */
(function () {
  const OFFSET = 80;
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href   = this.getAttribute('href');
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - OFFSET;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();
