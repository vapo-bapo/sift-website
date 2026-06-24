/* ═══════════════════════════════════════════════════════════════════════════
   SIFT — Signal System runtime
   Atmosphere · scroll engine · reveal choreography · product visualisations
   ═══════════════════════════════════════════════════════════════════════════ */

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const COARSE  = window.matchMedia('(pointer: coarse)').matches;

/* ─── NAV SCROLL ─────────────────────────────────────────── */
const nav = document.querySelector('.nav');
if (nav) {
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ─── ACTIVE NAV LINK ────────────────────────────────────── */
(function () {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });
})();

/* ─── MOBILE NAV ─────────────────────────────────────────── */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
  });
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
  }));
}

/* ─── ATMOSPHERE: grain + scroll progress + ambient field ── */
function injectAtmosphere() {
  if (!document.querySelector('.sig-progress')) {
    const bar = document.createElement('div');
    bar.className = 'sig-progress';
    document.body.appendChild(bar);
  }
  if (!REDUCED && !document.querySelector('.sig-grain')) {
    const grain = document.createElement('div');
    grain.className = 'sig-grain';
    document.body.appendChild(grain);
  }
}

const progressEl = () => document.querySelector('.sig-progress');

/* ─── AMBIENT SIGNAL FIELD ───────────────────────────────────
   Drifting nodes + proximity links in gold over the cream page.
   Reacts to scroll velocity. Perf-capped, pauses when hidden,
   disabled for reduced-motion / coarse pointers. ───────────── */
function initSignalField() {
  if (REDUCED || COARSE) return;

  const canvas = document.createElement('canvas');
  canvas.className = 'sig-field';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d', { alpha: true });

  let W = 0, H = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  let nodes = [];
  let lastScroll = window.scrollY;
  let scrollDrift = 0;
  let mouse = { x: -9999, y: -9999 };
  let running = true;

  function build() {
    W = window.innerWidth; H = window.innerHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.max(26, Math.min(64, Math.round((W * H) / 28000)));
    nodes = new Array(count).fill(0).map(() => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      r: Math.random() * 1.4 + 0.6,
    }));
  }
  build();

  const LINK = 132;
  function frame() {
    if (!running) return;
    // scroll velocity → vertical drift of the whole field
    const sy = window.scrollY;
    scrollDrift += (sy - lastScroll) * 0.06;
    lastScroll = sy;
    scrollDrift *= 0.9;               // ease back to rest

    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.x += n.vx;
      n.y += n.vy - scrollDrift * 0.04;
      // gentle pointer repulsion
      const dxm = n.x - mouse.x, dym = n.y - mouse.y;
      const dm2 = dxm * dxm + dym * dym;
      if (dm2 < 14000) {
        const f = (14000 - dm2) / 14000 * 0.6;
        const dm = Math.sqrt(dm2) || 1;
        n.x += (dxm / dm) * f; n.y += (dym / dm) * f;
      }
      // wrap
      if (n.x < -20) n.x = W + 20; else if (n.x > W + 20) n.x = -20;
      if (n.y < -20) n.y = H + 20; else if (n.y > H + 20) n.y = -20;
    }

    // links
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < LINK * LINK) {
          const alpha = (1 - Math.sqrt(d2) / LINK) * 0.16;
          ctx.strokeStyle = `rgba(176,128,46,${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    // nodes
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(176,128,46,0.34)';
      ctx.fill();
    }
    requestAnimationFrame(frame);
  }

  let resizeT;
  window.addEventListener('resize', () => {
    clearTimeout(resizeT); resizeT = setTimeout(build, 180);
  }, { passive: true });
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  window.addEventListener('mouseout', () => { mouse.x = -9999; mouse.y = -9999; }, { passive: true });
  document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running) { lastScroll = window.scrollY; requestAnimationFrame(frame); }
  });
  requestAnimationFrame(frame);
}

/* ─── SCROLL ENGINE: progress + parallax (single rAF) ────── */
function initScrollEngine() {
  const speedEls = Array.from(document.querySelectorAll('[data-speed]'));
  const cache = new Map();

  function measure() {
    const sy = window.scrollY;
    speedEls.forEach(el => {
      el.style.transform = 'none';
      const r = el.getBoundingClientRect();
      cache.set(el, { mid: sy + r.top + r.height / 2, speed: parseFloat(el.dataset.speed) || 0.08 });
    });
  }
  measure();
  window.addEventListener('load', measure);
  let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(measure, 200); }, { passive: true });

  const docH = () => document.documentElement.scrollHeight - window.innerHeight;
  let ticking = false;

  function update() {
    ticking = false;
    const sy = window.scrollY;
    const bar = progressEl();
    if (bar) {
      const p = Math.max(0, Math.min(1, sy / (docH() || 1)));
      bar.style.transform = `scaleX(${p})`;
    }
    if (!REDUCED) {
      const vmid = sy + window.innerHeight / 2;
      speedEls.forEach(el => {
        const c = cache.get(el); if (!c) return;
        const ty = (vmid - c.mid) * c.speed;
        el.style.transform = `translate3d(0, ${ty.toFixed(2)}px, 0)`;
      });
    }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  update();
}

/* ─── HEADLINE WORD SPLITTING ────────────────────────────── */
function splitWords(el, step) {
  if (el.dataset.split) return;
  el.dataset.split = '1';
  let idx = 0;
  const STEP = step || 64;
  function wrapText(text) {
    const out = document.createDocumentFragment();
    const parts = text.split(/(\s+)/);
    parts.forEach(p => {
      if (p === '') return;
      if (/^\s+$/.test(p)) { out.appendChild(document.createTextNode(p)); return; }
      const w = document.createElement('span'); w.className = 'rw-word';
      const i = document.createElement('i');
      i.textContent = p;
      i.style.setProperty('--rw-delay', (idx++ * STEP) + 'ms');
      w.appendChild(i); out.appendChild(w);
    });
    return out;
  }
  function recurse(node, target) {
    Array.from(node.childNodes).forEach(child => {
      if (child.nodeType === 3) {
        target.appendChild(wrapText(child.textContent));
      } else if (child.tagName === 'BR') {
        target.appendChild(document.createElement('br'));
      } else {
        const clone = child.cloneNode(false);
        recurse(child, clone);
        target.appendChild(clone);
      }
    });
  }
  const frag = document.createDocumentFragment();
  recurse(el, frag);
  el.innerHTML = '';
  el.appendChild(frag);
  el.classList.add('reveal-words');
}

/* ─── REVEAL CHOREOGRAPHY ────────────────────────────────── */
function initReveal() {
  // assign stagger delays to children of [data-stagger]
  document.querySelectorAll('[data-stagger]').forEach(parent => {
    const stepLegacy = +(parent.dataset.stagger || 80);
    parent.querySelectorAll(':scope > *').forEach((child, i) => {
      if ((child.matches('.sr,.sr-up,.sr-left,.sr-right')) && !child.dataset.delay) {
        child.dataset.delay = i * stepLegacy;
      }
      if (child.hasAttribute('data-reveal') && !child.dataset.delay) {
        child.dataset.delay = i * stepLegacy;
      }
    });
  });

  // split any headline marked for word reveal
  document.querySelectorAll('[data-words]').forEach(el => splitWords(el, +(el.dataset.words) || 64));

  const apply = (el) => {
    const delay = +(el.dataset.delay || 0);
    if (el.hasAttribute('data-reveal') || el.classList.contains('reveal-words')) {
      el.style.setProperty('--reveal-delay', delay + 'ms');
    }
    if (delay && (el.classList.contains('sr') || el.classList.contains('sr-up') ||
                  el.classList.contains('sr-left') || el.classList.contains('sr-right'))) {
      setTimeout(() => el.classList.add('in'), delay);
    } else {
      el.classList.add('in');
    }
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      apply(entry.target);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });

  document.querySelectorAll('.sr,.sr-up,.sr-left,.sr-right,[data-reveal],.reveal-words')
    .forEach(el => io.observe(el));
}

/* ─── MAGNETIC ELEMENTS ──────────────────────────────────── */
function initMagnetic() {
  if (COARSE) return;
  document.querySelectorAll('.magnetic').forEach(el => {
    const strength = +(el.dataset.magnetic || 0.3);
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * strength;
      const y = (e.clientY - (r.top + r.height / 2)) * strength;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = 'translate(0,0)'; });
  });
}

/* ─── MARQUEE (seamless loop) ────────────────────────────── */
function initMarquee() {
  document.querySelectorAll('.marquee-track').forEach(track => {
    if (track.dataset.cloned) return;
    track.dataset.cloned = '1';
    track.innerHTML += track.innerHTML;   // duplicate for -50% loop
  });
}

/* ─── PRICING TABS ───────────────────────────────────────── */
document.querySelectorAll('.ptab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.ptab').forEach(t => t.classList.remove('ptab--on'));
    tab.classList.add('ptab--on');
    const id = tab.dataset.tab;
    document.querySelectorAll('.ppanel').forEach(p => {
      const show = p.id === 'ppanel-' + id;
      p.style.display = show ? 'block' : 'none';
      if (show) p.querySelectorAll('.sr,.sr-up,[data-reveal]').forEach(el => {
        el.classList.remove('in');
        setTimeout(() => el.classList.add('in'), 80);
      });
    });
  });
});

/* ─── COUNTER ANIMATION ──────────────────────────────────── */
function animateCount(el) {
  const target = +el.dataset.count;
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const dur = 1500;
  const start = performance.now();
  const update = (now) => {
    const t = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = prefix + Math.round(ease * target) + suffix;
    if (t < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    animateCount(entry.target);
    counterObserver.unobserve(entry.target);
  });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

/* ─── 3D CARD TILT ───────────────────────────────────────── */
if (!COARSE) {
  document.querySelectorAll('.tilt').forEach(card => {
    const maxTilt = +(card.dataset.tilt || 8);
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * maxTilt * 2}deg) rotateX(${-y * maxTilt * 2}deg) scale(1.01)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(900px) rotateY(0) rotateX(0) scale(1)';
    });
  });
}

/* ─── HERO POINTER PARALLAX ──────────────────────────────── */
if (!COARSE) {
  const heroParallax = document.querySelectorAll('[data-parallax]');
  if (heroParallax.length) {
    document.addEventListener('mousemove', e => {
      const x = (e.clientX / window.innerWidth - 0.5);
      const y = (e.clientY / window.innerHeight - 0.5);
      heroParallax.forEach(el => {
        const depth = +(el.dataset.parallax || 10);
        el.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
      });
    }, { passive: true });
  }
}

/* ─── LOGO PATH HELPERS ──────────────────────────────────── */
function getPathLen(p) {
  if (p.tagName && p.tagName.toLowerCase() === 'circle') {
    return 2 * Math.PI * parseFloat(p.getAttribute('r') || 0);
  }
  try { return p.getTotalLength(); } catch (e) { return 200; }
}

function initHeroLogo() {
  const wrap = document.getElementById('heroLogoAnim');
  if (!wrap) return;
  const circle = wrap.querySelector('.hero-logo-circle');
  const brackets = wrap.querySelectorAll('.hero-logo-bracket');
  const allPaths = [circle, ...brackets].filter(Boolean);
  allPaths.forEach(p => {
    const len = getPathLen(p);
    p.style.strokeDasharray = len;
    p.style.strokeDashoffset = REDUCED ? 0 : len;
  });
  if (REDUCED) return;
  setTimeout(() => {
    if (circle) {
      circle.style.transition = 'stroke-dashoffset 1100ms cubic-bezier(0.16,1,0.3,1)';
      circle.style.strokeDashoffset = '0';
    }
    setTimeout(() => {
      brackets.forEach(b => {
        b.style.transition = 'stroke-dashoffset 800ms cubic-bezier(0.16,1,0.3,1)';
        b.style.strokeDashoffset = '0';
      });
    }, 440);
  }, 350);
}

function initLogoAnimation(wrap) {
  if (!wrap) return;
  const paths = wrap.querySelectorAll('.logo-anim-path');
  paths.forEach(p => {
    const len = getPathLen(p);
    p.style.strokeDasharray = len;
    p.style.strokeDashoffset = REDUCED ? 0 : len;
  });
  if (REDUCED) return;
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    const circle = wrap.querySelector('.logo-anim-circle');
    const brackets = wrap.querySelectorAll('.logo-anim-bracket');
    if (circle) {
      circle.style.transition = 'stroke-dashoffset 1400ms cubic-bezier(0.16,1,0.3,1)';
      circle.style.strokeDashoffset = '0';
    }
    setTimeout(() => {
      brackets.forEach(b => {
        b.style.transition = 'stroke-dashoffset 1000ms cubic-bezier(0.16,1,0.3,1)';
        b.style.strokeDashoffset = '0';
      });
    }, 500);
    observer.unobserve(wrap);
  }, { threshold: 0.3 });
  observer.observe(wrap);
}

/* ─── ARGUS CANVAS DEMO ──────────────────────────────────── */
function initArgusCanvas(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;

  function resize() {
    const r = canvas.getBoundingClientRect();
    canvas.width = r.width * dpr;
    canvas.height = r.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  new ResizeObserver(resize).observe(canvas);

  const leads = [
    { name: 'Arcturus GmbH',     role: 'VP of Engineering',    score: 94, trigger: 'Hiring 11 ML engineers — Q1 expansion', sector: 'AI / Data' },
    { name: 'Helix Software SE',  role: 'Head of Sales Ops',    score: 88, trigger: 'Series C raised · expanding DACH',       sector: 'HR Tech' },
    { name: 'Volta Systems AG',   role: 'Director, GTM EMEA',   score: 83, trigger: 'New VP Sales appointed 5 weeks ago',     sector: 'Enterprise SaaS' },
    { name: 'Meridian GmbH',      role: 'CRO',                  score: 79, trigger: 'Migrating CRM stack → HubSpot',          sector: 'Pricing Tech' },
    { name: 'Solaris Logistics',  role: 'VP Revenue',           score: 74, trigger: 'Outbound gap — logistics scale-up',      sector: 'Logistics' },
  ];

  let revealed = 0;
  let scoreProgress = leads.map(() => 0);
  let hovered = -1;
  let frame = 0;
  let _rowH = 72;

  const revealInterval = setInterval(() => {
    if (revealed < leads.length) revealed++;
    else clearInterval(revealInterval);
  }, 900);

  function hitRow(clientY) {
    const r = canvas.getBoundingClientRect();
    const my = clientY - r.top;
    const h = Math.floor((my - 20) / _rowH);
    return (h >= 0 && h < revealed) ? h : -1;
  }

  canvas.addEventListener('mousemove', e => { hovered = hitRow(e.clientY); });
  canvas.addEventListener('mouseleave', () => { hovered = -1; });
  canvas.addEventListener('touchstart', e => { hovered = hitRow(e.touches[0].clientY); }, { passive: true });
  canvas.addEventListener('touchend', () => { hovered = -1; });

  function scoreColor(s) {
    if (s >= 85) return '#edb458';
    if (s >= 70) return '#c9943a';
    return '#826754';
  }

  function draw() {
    const W = canvas.getBoundingClientRect().width;
    const H = canvas.getBoundingClientRect().height;
    _rowH = Math.max(44, Math.min(72, Math.floor((H - 46) / leads.length)));
    const rowH = _rowH;
    const compact = rowH < 56;
    const startY = 20;
    ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = '#0a0905';
    ctx.fillRect(0, 0, W, H);

    ctx.strokeStyle = 'rgba(255,253,245,0.02)';
    ctx.lineWidth = 1;
    for (let y = 36; y < H; y += 36) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }

    ctx.strokeStyle = 'rgba(255,253,245,0.04)';
    ctx.lineWidth = 1;
    const sepX = compact ? W - 80 : W - 110;
    ctx.beginPath(); ctx.moveTo(sepX, 20); ctx.lineTo(sepX, H - 24); ctx.stroke();

    ctx.font = '600 9px Inter, sans-serif';
    ctx.letterSpacing = '0.16em';
    ctx.fillStyle = 'rgba(245,240,232,0.20)';
    ctx.fillText('COMPANY', 20, 15);
    ctx.textAlign = 'right';
    ctx.fillText('SCORE', W - 14, 15);
    ctx.textAlign = 'left';
    ctx.letterSpacing = '0';

    if (revealed < leads.length && frame > 10) {
      const nextY = startY + revealed * rowH;
      const pulse = (Math.sin(frame * 0.12) + 1) / 2;
      const glowAlpha = 0.04 + pulse * 0.06;
      ctx.fillStyle = `rgba(237,180,88,${glowAlpha})`;
      ctx.fillRect(0, nextY, W, rowH);
      const lineAlpha = 0.3 + pulse * 0.5;
      const lineGrad = ctx.createLinearGradient(0, nextY, W, nextY);
      lineGrad.addColorStop(0, 'transparent');
      lineGrad.addColorStop(0.15, `rgba(237,180,88,${lineAlpha})`);
      lineGrad.addColorStop(0.85, `rgba(237,180,88,${lineAlpha})`);
      lineGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = lineGrad;
      ctx.fillRect(0, nextY, W, 1);
    }

    for (let i = 0; i < revealed; i++) {
      const lead = leads[i];
      const y = startY + i * rowH;
      const isHov = hovered === i;

      scoreProgress[i] = Math.min(scoreProgress[i] + 1.4, lead.score);

      if (isHov) {
        ctx.fillStyle = 'rgba(237,180,88,0.06)';
        ctx.fillRect(0, y, W, rowH);
      } else if (i % 2 === 0) {
        ctx.fillStyle = 'rgba(255,253,245,0.015)';
        ctx.fillRect(0, y, W, rowH);
      }

      ctx.fillStyle = 'rgba(255,253,245,0.04)';
      ctx.fillRect(0, y + rowH - 1, W, 1);

      const age = frame - i * 20;
      const slideX = age < 20 ? Math.max(0, (20 - age) * 5) : 0;
      const alpha = age < 20 ? Math.min(1, age / 20) : 1;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(-slideX, 0);

      const nY  = y + Math.round(rowH * 0.40);
      const rY  = y + Math.round(rowH * 0.62);
      const t3Y = y + Math.round(rowH * 0.82);
      const bY  = y + Math.round(rowH * 0.48);
      const sY  = y + Math.round(rowH * 0.44);

      ctx.font = `500 ${compact ? 11 : 13}px Inter, sans-serif`;
      ctx.fillStyle = isHov ? '#FFFDF5' : '#EDE8DC';
      ctx.fillText(lead.name, 20, nY);

      if (!compact) {
        ctx.font = '400 11px Inter, sans-serif';
        ctx.fillStyle = 'rgba(245,240,232,0.38)';
        ctx.fillText(lead.role, 20, rY);
      }

      if (!compact) {
        if (isHov) {
          ctx.font = '400 10.5px Inter, sans-serif';
          ctx.fillStyle = scoreColor(lead.score);
          ctx.fillText('↑ ' + lead.trigger, 20, t3Y);
        } else {
          ctx.font = '500 9px Inter, sans-serif';
          ctx.letterSpacing = '0.08em';
          ctx.fillStyle = 'rgba(201,148,58,0.50)';
          ctx.fillText(lead.sector, 20, t3Y);
          ctx.letterSpacing = '0';
        }
      }

      const barW = compact ? 48 : 72;
      ctx.fillStyle = 'rgba(255,253,245,0.06)';
      ctx.beginPath(); ctx.roundRect(W - barW - 14, bY, barW, 3, 2); ctx.fill();

      const pct = scoreProgress[i] / 100;
      const sc = scoreColor(lead.score);
      ctx.fillStyle = sc;
      ctx.beginPath(); ctx.roundRect(W - barW - 14, bY, barW * pct, 3, 2); ctx.fill();

      ctx.font = `600 ${compact ? 13 : 16}px Inter, sans-serif`;
      ctx.fillStyle = sc;
      ctx.textAlign = 'right';
      ctx.fillText(Math.round(scoreProgress[i]), W - 14, sY);
      ctx.textAlign = 'left';

      ctx.restore();
    }

    ctx.fillStyle = 'rgba(255,253,245,0.04)';
    ctx.fillRect(0, H - 26, W, 1);
    if (revealed < leads.length) {
      const pulse = (Math.sin(frame * 0.07) + 1) / 2;
      ctx.fillStyle = `rgba(237,180,88,${0.35 + pulse * 0.45})`;
      ctx.font = '600 8.5px Inter, sans-serif';
      ctx.letterSpacing = '0.14em';
      ctx.fillText('● SCANNING', 20, H - 9);
      const pBar = (revealed / leads.length);
      ctx.fillStyle = 'rgba(255,253,245,0.06)';
      ctx.beginPath(); ctx.roundRect(W - (compact ? 80 : 110), H - 14, compact ? 60 : 90, 2, 1); ctx.fill();
      ctx.fillStyle = `rgba(237,180,88,${0.4 + pulse * 0.3})`;
      ctx.beginPath(); ctx.roundRect(W - (compact ? 80 : 110), H - 14, (compact ? 60 : 90) * pBar, 2, 1); ctx.fill();
    } else {
      ctx.fillStyle = 'rgba(237,180,88,0.55)';
      ctx.font = '600 8.5px Inter, sans-serif';
      ctx.letterSpacing = '0.14em';
      ctx.fillText('✓  SCAN COMPLETE — 20 LEADS IDENTIFIED', 20, H - 9);
    }

    frame++;
    requestAnimationFrame(draw);
  }
  draw();
}

/* ─── LYNX NETWORK ───────────────────────────────────────── */
function initLynxNetwork(svg) {
  if (!svg) return;
  let initialized = false;
  const ro = new ResizeObserver(() => {
    if (initialized) return;
    const { width, height } = svg.getBoundingClientRect();
    if (!width || !height) return;
    initialized = true;
    ro.disconnect();
    renderLynxNetwork(svg, width, height);
  });
  ro.observe(svg);
  const { width: w0, height: h0 } = svg.getBoundingClientRect();
  if (w0 && h0) { initialized = true; ro.disconnect(); renderLynxNetwork(svg, w0, h0); }
}

function renderLynxNetwork(svg, W, H) {
  const ns = 'http://www.w3.org/2000/svg';
  svg.innerHTML = '';
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

  const cx = W / 2, cy = H / 2;
  const nodes = [
    { id: 0, label: 'Arcturus GmbH', role: 'Target Company',    r: 38, x: cx,        y: cy,        color: '#edb458', isCenter: true },
    { id: 1, label: 'J. Hartmann',   role: 'CRO',               r: 24, x: cx - 160,  y: cy - 80 },
    { id: 2, label: 'S. Vogel',      role: 'VP Revenue Ops',    r: 22, x: cx + 170,  y: cy - 70 },
    { id: 3, label: 'M. Fischer',    role: 'Head of Sales',     r: 22, x: cx - 170,  y: cy + 80 },
    { id: 4, label: 'K. Brandt',     role: 'Dir. Partnerships', r: 20, x: cx + 155,  y: cy + 90 },
    { id: 5, label: 'T. Schäfer',   role: 'CFO',               r: 20, x: cx,        y: cy - 140 },
    { id: 6, label: 'L. Meier',      role: 'CISO',              r: 18, x: cx,        y: cy + 150 },
  ];
  const edges = [[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[1,3],[2,4]];

  const defs = document.createElementNS(ns, 'defs');
  defs.innerHTML = `
    <filter id="glow"><feGaussianBlur stdDeviation="3" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <radialGradient id="centerGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#f5c97a" stop-opacity="0.20"/>
      <stop offset="100%" stop-color="#edb458" stop-opacity="0"/>
    </radialGradient>
  `;
  svg.appendChild(defs);

  const edgeGroup = document.createElementNS(ns, 'g');
  const edgeEls = edges.map(([a, b]) => {
    const line = document.createElementNS(ns, 'line');
    const na = nodes[a], nb = nodes[b];
    line.setAttribute('x1', na.x); line.setAttribute('y1', na.y);
    line.setAttribute('x2', nb.x); line.setAttribute('y2', nb.y);
    line.setAttribute('stroke', 'rgba(237,180,88,0.13)');
    line.setAttribute('stroke-width', '1.5');
    const len = Math.hypot(nb.x - na.x, nb.y - na.y);
    line.style.strokeDasharray = len;
    line.style.strokeDashoffset = REDUCED ? 0 : len;
    line.style.transition = `stroke-dashoffset 600ms var(--ease-spring)`;
    edgeGroup.appendChild(line);
    return line;
  });
  svg.appendChild(edgeGroup);

  const nodeGroup = document.createElementNS(ns, 'g');
  const nodeEls = nodes.map((n) => {
    const g = document.createElementNS(ns, 'g');
    g.setAttribute('transform', `translate(${n.x},${n.y})`);
    g.style.cursor = 'pointer';
    g.style.transition = 'transform 300ms var(--ease-spring)';

    const circle = document.createElementNS(ns, 'circle');
    circle.setAttribute('r', n.r);
    circle.setAttribute('fill', n.isCenter ? 'rgba(237,180,88,0.10)' : 'rgba(255,253,245,0.04)');
    circle.setAttribute('stroke', n.color || 'rgba(237,180,88,0.32)');
    circle.setAttribute('stroke-width', n.isCenter ? '2' : '1.5');
    if (n.isCenter) circle.setAttribute('filter', 'url(#glow)');

    const label = document.createElementNS(ns, 'text');
    label.setAttribute('y', n.isCenter ? 5 : 4);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('fill', n.isCenter ? '#edb458' : 'rgba(245,240,232,0.78)');
    label.setAttribute('font-size', n.isCenter ? '10' : '9');
    label.setAttribute('font-family', 'Inter,sans-serif');
    label.setAttribute('font-weight', '500');
    label.textContent = n.isCenter ? n.label.split(' ')[0] : n.label;

    const roleEl = document.createElementNS(ns, 'text');
    roleEl.setAttribute('y', n.isCenter ? 18 : 16);
    roleEl.setAttribute('text-anchor', 'middle');
    roleEl.setAttribute('fill', 'rgba(245,240,232,0.28)');
    roleEl.setAttribute('font-size', '7.5');
    roleEl.setAttribute('font-family', 'Inter,sans-serif');
    roleEl.textContent = n.role.split(' ').slice(0, 2).join(' ');

    g.appendChild(circle); g.appendChild(label); g.appendChild(roleEl);

    g.addEventListener('mouseenter', () => {
      circle.setAttribute('stroke', '#edb458');
      circle.setAttribute('fill', 'rgba(237,180,88,0.14)');
      g.style.transform = `translate(${n.x}px,${n.y}px) scale(1.12)`;
    });
    g.addEventListener('mouseleave', () => {
      circle.setAttribute('stroke', n.color || 'rgba(237,180,88,0.32)');
      circle.setAttribute('fill', n.isCenter ? 'rgba(237,180,88,0.10)' : 'rgba(255,253,245,0.04)');
      g.style.transform = `translate(${n.x}px,${n.y}px) scale(1)`;
    });

    nodeGroup.appendChild(g);
    return { el: g, circle };
  });
  svg.appendChild(nodeGroup);

  if (!COARSE) {
    svg.addEventListener('mousemove', e => {
      const r = svg.getBoundingClientRect();
      const mx = (e.clientX - r.left) * (W / r.width);
      const my = (e.clientY - r.top) * (H / r.height);
      nodes.forEach((n, i) => {
        if (n.isCenter) return;
        const dx = n.x - mx, dy = n.y - my;
        const dist = Math.hypot(dx, dy) || 1;
        const force = Math.min(28 / (dist * 0.05 + 1), 14);
        const ox = (dx / dist) * force;
        const oy = (dy / dist) * force;
        nodeEls[i].el.style.transform = `translate(${n.x + ox}px,${n.y + oy}px)`;
      });
    });
    svg.addEventListener('mouseleave', () => {
      nodes.forEach((n, i) => { nodeEls[i].el.style.transform = `translate(${n.x}px,${n.y}px)`; });
    });
  }

  if (REDUCED) return;
  const observer = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    edgeEls.forEach((el, i) => setTimeout(() => { el.style.strokeDashoffset = 0; }, i * 120 + 200));
    observer.unobserve(svg);
  }, { threshold: 0.3 });
  observer.observe(svg);
}

/* ─── INTELLIGENCE TABS ──────────────────────────────────── */
function initIntelTabs(wrap) {
  if (!wrap) return;
  const tabs = wrap.querySelectorAll('.intel-tab');
  const panes = wrap.querySelectorAll('.intel-pane');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const id = tab.dataset.pane;
      panes.forEach(p => p.classList.toggle('active', p.dataset.pane === id));
    });
  });
}

/* ─── SMOOTH ANCHOR SCROLL ───────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
  });
});

/* ─── INIT ───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  injectAtmosphere();
  initSignalField();
  initScrollEngine();
  initReveal();
  initMagnetic();
  initMarquee();
  initHeroLogo();
  initArgusCanvas(document.getElementById('argusCanvas'));
  initLynxNetwork(document.getElementById('lynxSvg'));
  initIntelTabs(document.getElementById('intelTabs'));
  initLogoAnimation(document.getElementById('logoAnim'));
});
