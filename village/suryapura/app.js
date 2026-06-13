/* ═══════════════════════════════════════════
   सूर्यपुरा ग्राम विकास पोर्टल — app.js
   Pure Vanilla JS · No Dependencies
═══════════════════════════════════════════ */

/* ══════════════════════════
   1. HEADER SCROLL EFFECT
══════════════════════════ */
(function () {
  const header = document.getElementById('header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
})();

/* ══════════════════════════
   2. MOBILE BURGER MENU
══════════════════════════ */
(function () {
  const burger = document.getElementById('burger');
  const nav    = document.getElementById('mainNav');
  if (!burger || !nav) return;

  burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    nav.classList.toggle('open');
  });

  // close on link click
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      nav.classList.remove('open');
    });
  });

  // close on outside click
  document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) {
      burger.classList.remove('open');
      nav.classList.remove('open');
    }
  });
})();

/* ══════════════════════════
   3. ACTIVE NAV ON SCROLL
══════════════════════════ */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');
  if (!sections.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const match = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (match) match.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => obs.observe(s));
})();

/* ══════════════════════════
   4. REVEAL ON SCROLL
══════════════════════════ */
(function () {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 90);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach(el => obs.observe(el));
})();

/* ══════════════════════════
   5. COUNTER ANIMATION
══════════════════════════ */
function animateCount(el, target, duration) {
  duration = duration || 2000;
  let startTime = null;

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const value    = Math.floor(easeOutCubic(progress) * target);
    el.textContent = value.toLocaleString('hi-IN');
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target.toLocaleString('hi-IN');
  }
  requestAnimationFrame(step);
}

// Hero stats counter
(function () {
  const statNums = document.querySelectorAll('.stat-n[data-target]');
  if (!statNums.length) return;

  let fired = false;
  const obs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !fired) {
      fired = true;
      statNums.forEach(el => animateCount(el, parseInt(el.dataset.target), 1800));
    }
  }, { threshold: 0.5 });
  obs.observe(statNums[0].closest('.hero-stats') || statNums[0]);
})();

// Impact section counter
(function () {
  const ibNums = document.querySelectorAll('.ib-num[data-target]');
  if (!ibNums.length) return;

  let fired = false;
  const obs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !fired) {
      fired = true;
      ibNums.forEach(el => animateCount(el, parseInt(el.dataset.target), 2200));
    }
  }, { threshold: 0.3 });
  obs.observe(document.getElementById('impact') || ibNums[0]);
})();

/* ══════════════════════════
   6. PROGRESS BARS
══════════════════════════ */
(function () {
  const bars = document.querySelectorAll('.pillar-fill[data-w]');
  if (!bars.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        setTimeout(() => { bar.style.width = bar.dataset.w + '%'; }, 200);
        obs.unobserve(bar);
      }
    });
  }, { threshold: 0.5 });

  bars.forEach(b => obs.observe(b));
})();

/* ══════════════════════════
   7. STORIES CAROUSEL
══════════════════════════ */
(function () {
  const slides  = document.querySelectorAll('.c-card');
  const dots    = document.querySelectorAll('.c-dot');
  const carousel = document.getElementById('storiesCarousel');
  if (!slides.length || !carousel) return;

  let current = 0;
  let timer;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function autoPlay() {
    clearInterval(timer);
    timer = setInterval(() => goTo(current + 1), 5000);
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      goTo(parseInt(dot.dataset.idx));
      autoPlay();
    });
  });

  // Swipe support (touch)
  let touchX = 0;
  carousel.addEventListener('touchstart', e => {
    touchX = e.touches[0].clientX;
  }, { passive: true });
  carousel.addEventListener('touchend', e => {
    const diff = touchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 44) {
      goTo(diff > 0 ? current + 1 : current - 1);
      autoPlay();
    }
  });

  autoPlay();
})();

/* ══════════════════════════
   8. SOCIAL LIKE BUTTONS
══════════════════════════ */
(function () {
  function setupLike(btnId, countId) {
    const btn   = document.getElementById(btnId);
    const count = document.getElementById(countId);
    if (!btn || !count) return;

    let liked = false;
    const original = count.textContent;

    btn.addEventListener('click', () => {
      liked = !liked;
      if (liked) {
        // Parse and increment
        const raw = original.replace('K','').replace(',','').trim();
        const isK = original.includes('K');
        const num = isK ? parseFloat(raw) * 1000 : parseInt(raw);
        const newNum = num + 1;
        count.textContent = newNum >= 1000 ? (newNum / 1000).toFixed(1) + 'K' : newNum;
        btn.style.color     = '#E53935';
        btn.style.transform = 'scale(1.2)';
        setTimeout(() => btn.style.transform = '', 300);
      } else {
        count.textContent   = original;
        btn.style.color     = '';
      }
    });
  }

  setupLike('l1', 'l1c');
  setupLike('l2', 'l2c');
})();

/* ══════════════════════════
   9. SHARE BUTTONS
══════════════════════════ */
(function () {
  function setupShare(btnId) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.addEventListener('click', () => {
      if (navigator.share) {
        navigator.share({
          title: 'सूर्यपुरा ग्राम विकास पोर्टल',
          text : 'गाँव का विकास — डिजिटल पंचायत से जुड़ें!',
          url  : window.location.href
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href).then(() => {
          showToast('🔗 लिंक कॉपी हो गया!', 'success');
        }).catch(() => {
          showToast('लिंक कॉपी नहीं हुआ', 'error');
        });
      }
    });
  }
  setupShare('s1');
  setupShare('s2');
})();

/* ══════════════════════════
   10. JOIN FORM
══════════════════════════ */
(function () {
  const form = document.getElementById('joinForm');
  const btn  = document.getElementById('joinSubmit');
  if (!form || !btn) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const name   = document.getElementById('jName').value.trim();
    const phone  = document.getElementById('jPhone').value.trim();
    const village= document.getElementById('jVillage').value.trim();
    const role   = document.getElementById('jRole').value;

    // Validation
    if (!name) {
      showToast('कृपया अपना नाम दर्ज करें।', 'error'); return;
    }
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      showToast('कृपया सही मोबाइल नंबर दर्ज करें।', 'error'); return;
    }
    if (!role) {
      showToast('कृपया अपनी भूमिका चुनें।', 'error'); return;
    }

    // Simulate submit
    btn.textContent = 'भेज रहे हैं…';
    btn.disabled    = true;

    setTimeout(() => {
      showToast(`🎉 ${name} जी, आप सूर्यपुरा विकास दूत परिवार में शामिल हो गए!`, 'success');
      form.reset();
      btn.textContent = 'विकास दूत बनें →';
      btn.disabled    = false;
    }, 1500);
  });
})();

/* ══════════════════════════
   11. TOAST NOTIFICATION
══════════════════════════ */
function showToast(msg, type) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.className   = 'toast show' + (type === 'error' ? ' error' : '');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3800);
}

/* ══════════════════════════
   12. SMOOTH SCROLL
══════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 72; // header height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ══════════════════════════
   13. HERO PARALLAX (subtle)
══════════════════════════ */
(function () {
  const heroLeft  = document.querySelector('.hero-left');
  const heroRight = document.querySelector('.hero-right');
  if (!heroLeft) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < window.innerHeight) {
          heroLeft.style.transform  = `translateY(${y * 0.10}px)`;
          if (heroRight) heroRight.style.transform = `translateY(${y * 0.06}px)`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

/* ══════════════════════════
   14. LOGO SUN PAUSE ON HOVER
══════════════════════════ */
(function () {
  const sun = document.querySelector('.logo-sun');
  if (!sun) return;
  sun.addEventListener('mouseenter', () => sun.style.animationPlayState = 'paused');
  sun.addEventListener('mouseleave', () => sun.style.animationPlayState = 'running');
})();

/* ══════════════════════════
   15. PILLAR CARD HOVER GLOW
══════════════════════════ */
document.querySelectorAll('.pillar').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
    const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
    card.style.setProperty('--mx', x + '%');
    card.style.setProperty('--my', y + '%');
  });
});

/* ══════════════════════════
   PAGE LOAD — fade in body
══════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.4s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
});
