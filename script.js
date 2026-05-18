// ─── NAV SCROLL ───────────────────────────────────────────
const nav = document.querySelector('.nav');
if (nav) {
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ─── ACTIVE NAV LINK ──────────────────────────────────────
(function() {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(a => {
    if (a.getAttribute('href') === path) a.classList.add('active');
  });
})();

// ─── MOBILE NAV ───────────────────────────────────────────
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

// ─── SCROLL REVEAL ────────────────────────────────────────
const srObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const delay = +(el.dataset.delay || 0);
    setTimeout(() => el.classList.add('in'), delay);
    srObserver.unobserve(el);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.sr,.sr-up,.sr-left,.sr-right').forEach(el => {
  srObserver.observe(el);
});

document.querySelectorAll('[data-stagger]').forEach(parent => {
  const step = +(parent.dataset.stagger || 80);
  parent.querySelectorAll(':scope > *').forEach((child, i) => {
    if (!child.dataset.delay) child.dataset.delay = i * step;
  });
});

// ─── PRICING TABS ─────────────────────────────────────────
document.querySelectorAll('.ptab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.ptab').forEach(t => t.classList.remove('ptab--on'));
    tab.classList.add('ptab--on');
    const id = tab.dataset.tab;
    document.querySelectorAll('.ppanel').forEach(p => {
      const show = p.id === 'ppanel-' + id;
      p.style.display = show ? 'block' : 'none';
      if (show) p.querySelectorAll('.sr,.sr-up').forEach(el => {
        el.classList.remove('in');
        setTimeout(() => el.classList.add('in'), 80);
      });
    });
  });
});

// ─── COUNTER ANIMATION ────────────────────────────────────
function animateCount(el) {
  const target = +el.dataset.count;
  const suffix = el.dataset.suffix || '';
  const dur = 1400;
  const start = performance.now();
  const update = (now) => {
    const t = Math.min((now - start) / dur, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(ease * target) + suffix;
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

// ─── 3D CARD TILT ─────────────────────────────────────────
const isMobile = window.matchMedia('(pointer: coarse)').matches;
if (!isMobile) {
  document.querySelectorAll('.tilt').forEach(card => {
    const maxTilt = +(card.dataset.tilt || 8);
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x*maxTilt*2}deg) rotateX(${-y*maxTilt*2}deg) scale(1.01)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(900px) rotateY(0) rotateX(0) scale(1)';
    });
  });
}

// ─── HERO PARALLAX ────────────────────────────────────────
if (!isMobile) {
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

// ─── SCROLL LOGO ANIMATION ────────────────────────────────
function initLogoAnimation(wrap) {
  if (!wrap) return;
  const paths = wrap.querySelectorAll('.logo-anim-path');
  paths.forEach(p => {
    let len;
    try { len = p.getTotalLength(); } catch(e) { len = 200; }
    p.style.strokeDasharray = len;
    p.style.strokeDashoffset = len;
  });

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

// ─── ARGUS CANVAS DEMO ────────────────────────────────────
function initArgusCanvas(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;

  function resize() {
    const r = canvas.getBoundingClientRect();
    canvas.width = r.width * dpr;
    canvas.height = r.height * dpr;
    ctx.scale(dpr, dpr);
  }
  resize();
  new ResizeObserver(resize).observe(canvas);

  const leads = [
    { name: 'Arcturus GmbH',    role: 'VP of Engineering',    score: 94, trigger: 'Hiring 11 ML engineers — Q1 expansion', sector: 'AI / Data' },
    { name: 'Helix Software SE', role: 'Head of Sales Ops',   score: 88, trigger: 'Series C raised · expanding DACH',        sector: 'HR Tech' },
    { name: 'Volta Systems AG',  role: 'Director, GTM EMEA',  score: 83, trigger: 'New VP Sales appointed 5 weeks ago',      sector: 'Enterprise SaaS' },
    { name: 'Meridian GmbH',    role: 'CRO',                   score: 79, trigger: 'Migrating CRM stack → HubSpot',          sector: 'Pricing Tech' },
    { name: 'Solaris Logistics', role: 'VP Revenue',           score: 74, trigger: 'Outbound gap — logistics scale-up',       sector: 'Logistics' },
  ];

  let revealed = 0;
  let scoreProgress = leads.map(() => 0);
  let hovered = -1;
  let frame = 0;

  const revealInterval = setInterval(() => {
    if (revealed < leads.length) revealed++;
    else clearInterval(revealInterval);
  }, 900);

  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    const my = e.clientY - r.top;
    const rowH = 72;
    const startY = 20;
    hovered = Math.floor((my - startY) / rowH);
    if (hovered < 0 || hovered >= revealed) hovered = -1;
  });
  canvas.addEventListener('mouseleave', () => { hovered = -1; });

  function scoreColor(s) {
    if (s >= 85) return '#edb458';
    if (s >= 70) return '#c9943a';
    return '#826754';
  }

  function draw() {
    const W = canvas.getBoundingClientRect().width;
    const H = canvas.getBoundingClientRect().height;
    ctx.clearRect(0, 0, W, H);

    ctx.fillStyle = '#0d0c07';
    ctx.fillRect(0, 0, W, H);

    ctx.font = '500 9px Inter, sans-serif';
    ctx.letterSpacing = '0.14em';
    ctx.fillStyle = 'rgba(245,240,232,0.25)';
    ctx.fillText('COMPANY', 20, 16);
    ctx.fillText('SCORE', W - 100, 16);

    const rowH = 72;
    const startY = 20;

    for (let i = 0; i < revealed; i++) {
      const lead = leads[i];
      const y = startY + i * rowH;
      const isHov = hovered === i;

      scoreProgress[i] = Math.min(scoreProgress[i] + 1.2, lead.score);

      if (isHov) {
        ctx.fillStyle = 'rgba(237,180,88,0.07)';
        ctx.fillRect(0, y, W, rowH);
      } else {
        ctx.fillStyle = i % 2 === 0 ? 'rgba(255,253,245,0.02)' : 'transparent';
        ctx.fillRect(0, y, W, rowH);
      }

      ctx.fillStyle = 'rgba(255,253,245,0.06)';
      ctx.fillRect(0, y + rowH - 1, W, 1);

      const age = frame - i * 18;
      const slideX = age < 24 ? Math.max(0, (24 - age) * 4) : 0;
      const alpha = age < 24 ? Math.min(1, age / 24) : 1;

      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(-slideX, 0);

      ctx.font = '500 13px Inter, sans-serif';
      ctx.fillStyle = '#F5F0E8';
      ctx.fillText(lead.name, 20, y + 24);

      ctx.font = '400 11px Inter, sans-serif';
      ctx.fillStyle = 'rgba(245,240,232,0.40)';
      ctx.fillText(lead.role, 20, y + 40);

      if (isHov) {
        ctx.font = '400 11px Inter, sans-serif';
        ctx.fillStyle = scoreColor(lead.score);
        ctx.fillText('↑ ' + lead.trigger, 20, y + 57);
      }

      ctx.font = '500 9px Inter, sans-serif';
      ctx.fillStyle = 'rgba(237,180,88,0.55)';
      ctx.fillText(lead.sector, 20, y + (isHov ? 57 : 57));

      const barX = W - 96;
      const barW = 72;
      const barY = y + 28;
      ctx.fillStyle = 'rgba(255,253,245,0.07)';
      ctx.beginPath();
      ctx.roundRect(barX, barY, barW, 4, 2);
      ctx.fill();

      const pct = scoreProgress[i] / 100;
      const sc = scoreColor(lead.score);
      ctx.fillStyle = sc;
      ctx.beginPath();
      ctx.roundRect(barX, barY, barW * pct, 4, 2);
      ctx.fill();

      ctx.font = '600 14px Inter, sans-serif';
      ctx.fillStyle = sc;
      ctx.textAlign = 'right';
      ctx.fillText(Math.round(scoreProgress[i]), W - 16, y + 28);
      ctx.textAlign = 'left';

      ctx.restore();
    }

    if (revealed < leads.length) {
      const pulse = Math.abs(Math.sin(frame * 0.05));
      ctx.fillStyle = `rgba(237,180,88,${0.3 + pulse * 0.4})`;
      ctx.font = '500 9px Inter, sans-serif';
      ctx.letterSpacing = '0.12em';
      ctx.fillText('● SCANNING', 20, H - 14);
    } else {
      ctx.fillStyle = 'rgba(237,180,88,0.6)';
      ctx.font = '500 9px Inter, sans-serif';
      ctx.letterSpacing = '0.12em';
      ctx.fillText('✓ SCAN COMPLETE — 20 LEADS FOUND', 20, H - 14);
    }

    frame++;
    requestAnimationFrame(draw);
  }
  draw();
}

// ─── LYNX NETWORK ─────────────────────────────────────────
function initLynxNetwork(svg) {
  if (!svg) return;
  const ns = 'http://www.w3.org/2000/svg';
  svg.innerHTML = '';

  const W = svg.clientWidth || 480;
  const H = svg.clientHeight || 380;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

  const cx = W / 2, cy = H / 2;
  const nodes = [
    { id: 0, label: 'Arcturus GmbH', role: 'Target Company',  r: 38, x: cx,        y: cy,        color: '#edb458', isCenter: true },
    { id: 1, label: 'J. Hartmann',   role: 'CRO',             r: 24, x: cx - 160,  y: cy - 80 },
    { id: 2, label: 'S. Vogel',      role: 'VP Revenue Ops',  r: 22, x: cx + 170,  y: cy - 70 },
    { id: 3, label: 'M. Fischer',    role: 'Head of Sales',   r: 22, x: cx - 170,  y: cy + 80 },
    { id: 4, label: 'K. Brandt',     role: 'Dir. Partnerships', r: 20, x: cx + 155, y: cy + 90 },
    { id: 5, label: 'T. Schäfer',   role: 'CFO',             r: 20, x: cx,        y: cy - 140 },
    { id: 6, label: 'L. Meier',      role: 'CISO',            r: 18, x: cx,        y: cy + 150 },
  ];
  const edges = [[0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[1,3],[2,4]];

  const defs = document.createElementNS(ns, 'defs');
  defs.innerHTML = `
    <filter id="glow"><feGaussianBlur stdDeviation="3" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <radialGradient id="centerGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#f5c97a" stop-opacity="0.25"/>
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
    line.setAttribute('stroke', 'rgba(237,180,88,0.15)');
    line.setAttribute('stroke-width', '1.5');
    const len = Math.hypot(nb.x - na.x, nb.y - na.y);
    line.style.strokeDasharray = len;
    line.style.strokeDashoffset = len;
    line.style.transition = `stroke-dashoffset 600ms var(--ease-spring)`;
    edgeGroup.appendChild(line);
    return line;
  });
  svg.appendChild(edgeGroup);

  const nodeGroup = document.createElementNS(ns, 'g');
  const nodeEls = nodes.map((n, i) => {
    const g = document.createElementNS(ns, 'g');
    g.setAttribute('transform', `translate(${n.x},${n.y})`);
    g.style.cursor = 'pointer';
    g.style.transition = 'transform 300ms var(--ease-spring)';

    const circle = document.createElementNS(ns, 'circle');
    circle.setAttribute('r', n.r);
    circle.setAttribute('fill', n.isCenter ? 'rgba(237,180,88,0.12)' : 'rgba(255,253,245,0.05)');
    circle.setAttribute('stroke', n.color || 'rgba(237,180,88,0.35)');
    circle.setAttribute('stroke-width', n.isCenter ? '2' : '1.5');
    if (n.isCenter) circle.setAttribute('filter', 'url(#glow)');

    const label = document.createElementNS(ns, 'text');
    label.setAttribute('y', n.isCenter ? 5 : 4);
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('fill', n.isCenter ? '#edb458' : 'rgba(245,240,232,0.80)');
    label.setAttribute('font-size', n.isCenter ? '10' : '9');
    label.setAttribute('font-family', 'Inter,sans-serif');
    label.setAttribute('font-weight', '500');
    label.textContent = n.isCenter ? n.label.split(' ')[0] : n.label;

    const roleEl = document.createElementNS(ns, 'text');
    roleEl.setAttribute('y', n.isCenter ? 18 : 16);
    roleEl.setAttribute('text-anchor', 'middle');
    roleEl.setAttribute('fill', 'rgba(245,240,232,0.30)');
    roleEl.setAttribute('font-size', '7.5');
    roleEl.setAttribute('font-family', 'Inter,sans-serif');
    roleEl.textContent = n.role.split(' ').slice(0,2).join(' ');

    g.appendChild(circle);
    g.appendChild(label);
    g.appendChild(roleEl);

    g.addEventListener('mouseenter', () => {
      circle.setAttribute('stroke', '#edb458');
      circle.setAttribute('fill', 'rgba(237,180,88,0.15)');
      g.style.transform = `translate(${n.x}px,${n.y}px) scale(1.12)`;
    });
    g.addEventListener('mouseleave', () => {
      circle.setAttribute('stroke', n.color || 'rgba(237,180,88,0.35)');
      circle.setAttribute('fill', n.isCenter ? 'rgba(237,180,88,0.12)' : 'rgba(255,253,245,0.05)');
      g.style.transform = `translate(${n.x}px,${n.y}px) scale(1)`;
    });

    nodeGroup.appendChild(g);
    return { el: g, circle };
  });
  svg.appendChild(nodeGroup);

  svg.addEventListener('mousemove', e => {
    const r = svg.getBoundingClientRect();
    const mx = (e.clientX - r.left) * (W / r.width);
    const my = (e.clientY - r.top) * (H / r.height);
    nodes.forEach((n, i) => {
      if (n.isCenter) return;
      const dx = n.x - mx, dy = n.y - my;
      const dist = Math.hypot(dx, dy);
      const force = Math.min(28 / (dist * 0.05 + 1), 14);
      const ox = (dx / dist) * force;
      const oy = (dy / dist) * force;
      nodeEls[i].el.style.transform = `translate(${n.x + ox}px,${n.y + oy}px)`;
    });
  });
  svg.addEventListener('mouseleave', () => {
    nodes.forEach((n, i) => {
      nodeEls[i].el.style.transform = `translate(${n.x}px,${n.y}px)`;
    });
  });

  const observer = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return;
    edgeEls.forEach((el, i) => setTimeout(() => { el.style.strokeDashoffset = 0; }, i * 120 + 200));
    observer.unobserve(svg);
  }, { threshold: 0.3 });
  observer.observe(svg);
}

// ─── INTELLIGENCE TABS ────────────────────────────────────
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

// ─── SMOOTH ANCHOR SCROLL ─────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const el = document.getElementById(a.getAttribute('href').slice(1));
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ─── INIT ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initArgusCanvas(document.getElementById('argusCanvas'));
  initLynxNetwork(document.getElementById('lynxSvg'));
  initIntelTabs(document.getElementById('intelTabs'));
  initLogoAnimation(document.getElementById('logoAnim'));
});
