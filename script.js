// ─── NAV SCROLL ───────────────────────────────────────────
const nav = document.querySelector('.nav');
if (nav) {
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ─── ACTIVE NAV LINK ──────────────────────────────────────
(function() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
})();

// ─── MOBILE NAV ───────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobilePanel = document.getElementById('mobilePanel');
if (hamburger && mobilePanel) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobilePanel.classList.toggle('open');
  });
  mobilePanel.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobilePanel.classList.remove('open');
    });
  });
}

// ─── SCROLL REVEAL ────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const delay = entry.target.dataset.delay || 0;
      setTimeout(() => entry.target.classList.add('in'), +delay);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.07, rootMargin: '0px 0px -32px 0px' });

document.querySelectorAll('.reveal, .reveal-fast').forEach((el, i) => {
  revealObserver.observe(el);
});

// ─── STAGGER CHILDREN ─────────────────────────────────────
document.querySelectorAll('[data-stagger]').forEach(parent => {
  const delay = +parent.dataset.stagger || 80;
  parent.querySelectorAll(':scope > *').forEach((child, i) => {
    child.dataset.delay = i * delay;
  });
});

// ─── SMOOTH ANCHOR ────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ─── PRICING TABS ─────────────────────────────────────────
const pricingTabs = document.querySelectorAll('.ptab');
const pricingPanels = document.querySelectorAll('.ppanel');
if (pricingTabs.length) {
  pricingTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      pricingTabs.forEach(t => t.classList.remove('ptab--active'));
      tab.classList.add('ptab--active');
      const target = tab.dataset.tab;
      pricingPanels.forEach(p => {
        const visible = p.id === `ppanel-${target}`;
        p.style.display = visible ? 'block' : 'none';
        if (visible) {
          // re-trigger reveals in newly visible panel
          p.querySelectorAll('.reveal, .reveal-fast').forEach(el => {
            el.classList.remove('in');
            setTimeout(() => el.classList.add('in'), 80);
          });
        }
      });
    });
  });
}

// ─── CONTACT FORM ─────────────────────────────────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('[type=submit]');
    btn.textContent = 'REQUEST SENT';
    btn.style.background = 'rgba(40, 120, 80, 0.8)';
    btn.disabled = true;
  });
}

// ─── CURSOR GLOW (desktop only) ───────────────────────────
if (window.matchMedia('(pointer: fine)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position:fixed;pointer-events:none;z-index:999;
    width:320px;height:320px;border-radius:50%;
    background:radial-gradient(circle,rgba(192,83,42,0.06) 0%,transparent 70%);
    transform:translate(-50%,-50%);
    transition:opacity 600ms;
    opacity:0;
  `;
  document.body.appendChild(glow);
  let mouseActive = false;
  document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
    if (!mouseActive) { glow.style.opacity = '1'; mouseActive = true; }
  });
  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; mouseActive = false; });
}
