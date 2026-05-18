// Nav scroll state
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);
}, { passive: true });

// Mobile nav
const hamburger = document.getElementById('hamburger');
const navMobile = document.getElementById('navMobile');
hamburger.addEventListener('click', () => {
  navMobile.classList.toggle('open');
});
navMobile.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navMobile.classList.remove('open'));
});

// Pricing tabs
const tabs = document.querySelectorAll('.pricing-tab');
const panels = document.querySelectorAll('.pricing-panel');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('pricing-tab--active'));
    tab.classList.add('pricing-tab--active');
    const target = tab.dataset.tab;
    panels.forEach(p => {
      p.classList.toggle('pricing-panel--hidden', p.id !== `panel-${target}`);
    });
  });
});

// Reveal on scroll
const revealEls = document.querySelectorAll(
  '.product-card, .pricing-card, .case-card, .step, .hero-proof, .contact-form, .contact-text'
);
revealEls.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => observer.observe(el));

// Hero elements instant visible
document.querySelectorAll('.hero-badge, .hero-title, .hero-sub, .hero-actions')
  .forEach(el => { el.style.opacity = 1; el.style.transform = 'none'; });

// Contact form
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type=submit]');
  btn.textContent = 'REQUEST SENT ✓';
  btn.style.background = '#2a6644';
  btn.disabled = true;
});

// Smooth anchor with nav offset
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
