/* Scroll-driven envelope. The original DC component owns copy, hover and stamps. */
(() => {
  window.mountProovitInvitation = (section) => {
    if (!section) return () => {};
    const stage = section.querySelector('.invitation-stage');
    const track = section.querySelector('.invite-scroll');
    const letter = section.querySelector('.invitation-letter');
    const motion = matchMedia('(prefers-reduced-motion: reduce)');
    const abort = new AbortController();
    let frame = 0, current = 0, target = 0, last = 0, visible = false;
    const clamp = x => Math.max(0, Math.min(1, x));
    const ease = x => { x = clamp(x); return x * x * x * (x * (x * 6 - 15) + 10); };
    function paint(value) {
      const flap = ease(value / .43);
      const rise = ease((value - .24) / .76);
      stage.style.setProperty('--flap-angle', `${-180 * flap}deg`);
      stage.style.setProperty('--flap-height', `${39 + 4 * flap}%`);
      stage.style.setProperty('--open-material', String(flap));
      stage.style.setProperty('--letter-shift', `${(1 - rise) * 91}%`);
      stage.style.setProperty('--letter-opacity', String(ease((value - .24) / .16)));
      stage.style.setProperty('--energy', String(.25 + .75 * rise));
      stage.classList.toggle('flap-behind', flap > .5);
      // Start the ink stroke only after the number has risen into view.
      stage.classList.toggle('number-revealed', motion.matches || rise > .88);
      // Keep a hidden invitation out of keyboard and assistive-technology navigation.
      const hidden = rise < .94;
      letter.toggleAttribute('inert', hidden);
      letter.setAttribute('aria-hidden', String(hidden));
      stage.dataset.state = value > .995 ? 'open' : value < .005 ? 'closed' : 'opening';
    }
    function tick(now) {
      frame = 0;
      const dt = Math.min(50, now - (last || now)); last = now;
      current += (target - current) * (1 - Math.exp(-dt / 135));
      if (Math.abs(target - current) < .0005) current = target;
      paint(current);
      if (current !== target) frame = requestAnimationFrame(tick);
    }
    function measure() {
      const rect = track.getBoundingClientRect();
      target = motion.matches ? 1 : clamp(-rect.top / Math.max(1, track.offsetHeight - innerHeight));
      if (motion.matches) { cancelAnimationFrame(frame); frame = 0; current = 1; paint(1); }
      else if (!frame && !document.hidden) { last = performance.now(); frame = requestAnimationFrame(tick); }
    }
    function activity() {
      stage.classList.toggle('energy-running', visible && !document.hidden && !motion.matches);
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; }
      else measure();
    }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; activity(); });
    observer.observe(track);
    const resize = new ResizeObserver(measure); resize.observe(track);
    window.addEventListener('scroll', measure, { passive: true, signal: abort.signal });
    window.addEventListener('resize', measure, { passive: true, signal: abort.signal });
    motion.addEventListener('change', () => { measure(); activity(); }, { signal: abort.signal });
    document.addEventListener('visibilitychange', activity, { signal: abort.signal });
    // A keyboard user can reveal the letter without having to perform a scroll gesture.
    section.querySelector('.invite-open').addEventListener('click', () => {
      const top = scrollY + track.getBoundingClientRect().top + track.offsetHeight - innerHeight;
      window.scrollTo({ top, behavior: motion.matches ? 'instant' : 'smooth' });
    }, { signal: abort.signal });
    paint(motion.matches ? 1 : 0); measure();
    return () => { abort.abort(); observer.disconnect(); resize.disconnect(); cancelAnimationFrame(frame); };
  };
})();
