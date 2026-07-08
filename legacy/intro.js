// ─── SIFT HOMEPAGE INTRO ANIMATION ───────────────────────
(function() {
  // Skip if seen this session
  if (sessionStorage.getItem('sift-intro-seen')) {
    document.getElementById('intro-overlay').style.display = 'none';
    document.body.classList.add('intro-done');
    return;
  }

  const overlay = document.getElementById('intro-overlay');
  const circle  = document.getElementById('ic');
  const leftBr  = document.getElementById('il');
  const rightBr = document.getElementById('ir');
  const wordmark = document.getElementById('intro-wordmark');
  const sub      = document.getElementById('intro-sub');

  if (!overlay || !circle) return;

  // ── Measure path lengths
  const circleLen = circle.getTotalLength();   // ~239
  const leftLen   = leftBr.getTotalLength();   // ~122
  const rightLen  = rightBr.getTotalLength();  // ~122

  // ── Set draw-ready state (invisible)
  [circle, leftBr, rightBr].forEach(el => {
    el.style.transition = 'none';
    el.style.opacity = '1';
  });
  circle.style.strokeDasharray  = circleLen;
  circle.style.strokeDashoffset = circleLen;
  leftBr.style.strokeDasharray  = leftLen;
  leftBr.style.strokeDashoffset = leftLen;
  rightBr.style.strokeDasharray = rightLen;
  rightBr.style.strokeDashoffset = rightLen;
  wordmark.style.opacity = '0';
  wordmark.style.letterSpacing = '0.6em';
  if (sub) { sub.style.opacity = '0'; }

  // ── Timeline
  let raf;
  function lerp(a, b, t) { return a + (b - a) * t; }
  function ease(t) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; } // ease in-out quad

  const timeline = [
    // [start_ms, duration_ms, fn(progress)]
    [400,  1400, p => { circle.style.strokeDashoffset = circleLen * (1 - p); }],
    [600,   900, p => { leftBr.style.strokeDashoffset = leftLen * (1 - p); }],
    [700,   900, p => { rightBr.style.strokeDashoffset = rightLen * (1 - p); }],
    [1800,  600, p => {
      wordmark.style.opacity = p;
      const spacing = lerp(0.6, 0.36, p);
      wordmark.style.letterSpacing = spacing + 'em';
    }],
    [2200,  400, p => { if (sub) sub.style.opacity = p * 0.5; }],
  ];

  const startTime = performance.now();
  const totalDuration = 3600;

  function tick(now) {
    const elapsed = now - startTime;
    timeline.forEach(([start, dur, fn]) => {
      if (elapsed >= start && elapsed <= start + dur) {
        fn(ease((elapsed - start) / dur));
      } else if (elapsed > start + dur) {
        fn(1);
      }
    });

    if (elapsed < totalDuration) {
      raf = requestAnimationFrame(tick);
    } else {
      finishIntro();
    }
  }
  requestAnimationFrame(tick);

  function finishIntro() {
    overlay.style.transition = 'opacity 900ms cubic-bezier(0.4,0,0.2,1)';
    overlay.style.opacity = '0';
    setTimeout(() => {
      overlay.style.display = 'none';
      document.body.classList.add('intro-done');
    }, 900);
    sessionStorage.setItem('sift-intro-seen', '1');
  }

  // Click to skip
  overlay.addEventListener('click', () => {
    cancelAnimationFrame(raf);
    finishIntro();
  });
})();
