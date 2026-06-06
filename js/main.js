// ─── js/main.js ─────────────────────────────────────────────────────────────

// ─── Custom Cursor ───────────────────────────────────────────────────────────
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

(function animateRing() {
  rx += (mx - rx) * 0.1;
  ry += (my - ry) * 0.1;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animateRing);
})();

document.querySelectorAll('a, button, .project-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width  = '18px';
    cursor.style.height = '18px';
    ring.style.width    = '52px';
    ring.style.height   = '52px';
    ring.style.borderColor = 'rgba(181,242,61,0.8)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width  = '8px';
    cursor.style.height = '8px';
    ring.style.width    = '32px';
    ring.style.height   = '32px';
    ring.style.borderColor = 'rgba(181,242,61,0.5)';
  });
});

// ─── Scroll Reveal ───────────────────────────────────────────────────────────
const revealOb = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 90);
      revealOb.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
  .forEach(el => revealOb.observe(el));

// ─── Header Scroll ───────────────────────────────────────────────────────────
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// ─── Active Nav on Scroll ─────────────────────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionOb = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(a => {
        const href = a.getAttribute('href');
        a.classList.toggle('active', href === `#${id}` || href === `${id}`);
      });
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => sectionOb.observe(s));

// ─── Mobile Nav Toggle ───────────────────────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navLinks');

if (navToggle) {
  navToggle.addEventListener('click', () => {
    const open = navToggle.classList.toggle('open');
    navMenu.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', open);
  });
  navMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navToggle.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });
}

// ─── Contact Form ─────────────────────────────────────────────────────────────
const form    = document.getElementById('contactForm');
const success = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    const required = form.querySelectorAll('[required]');
    let valid = true;
    required.forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = '#ff4444';
        valid = false;
      } else {
        field.style.borderColor = '';
      }
    });
    if (!valid) return;

    const btn = form.querySelector('[type="submit"]');
    btn.textContent = 'Sending…';
    btn.disabled = true;

    setTimeout(() => {
      form.style.display = 'none';
      success.classList.add('visible');
    }, 1200);
  });
}

// ─── Smooth Anchor Scroll ─────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = header.offsetHeight + 24;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});

// ─── Marquee duplicate ────────────────────────────────────────────────────────
const track = document.querySelector('.marquee-track');
if (track) {
  track.innerHTML += track.innerHTML;
}

// ─── Parallax on photo ───────────────────────────────────────────────────────
const photoFrame = document.querySelector('.photo-frame img');
if (photoFrame) {
  window.addEventListener('scroll', () => {
    const rect = photoFrame.closest('.about-visual').getBoundingClientRect();
    const center = rect.top + rect.height / 2 - window.innerHeight / 2;
    const shift = center * 0.04;
    photoFrame.style.transform = `scale(1.06) translateY(${shift}px)`;
  }, { passive: true });
}

// ─── Tilt on project cards ────────────────────────────────────────────────────
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - 0.5;
    const y = (e.clientY - r.top)  / r.height - 0.5;
    card.style.transform = `translateY(-5px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
    card.style.transition = 'transform 0.1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform var(--t), border-color var(--t), box-shadow var(--t)';
  });
});
