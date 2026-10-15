/* Smooth trailing cursor: dot + two easing circles + interactive pulse. */
(() => {
  'use strict';

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!finePointer.matches || reducedMotion.matches) return;

  const layer = document.createElement('div');
  layer.className = 'cursor-follower-layer';
  layer.setAttribute('aria-hidden', 'true');
  layer.innerHTML = [
    '<span class="cursor-follow-echo"></span>',
    '<span class="cursor-follow-ring"></span>',
    '<span class="cursor-follow-dot"></span>'
  ].join('');
  document.body.appendChild(layer);

  const echo = layer.querySelector('.cursor-follow-echo');
  const ring = layer.querySelector('.cursor-follow-ring');
  const dot = layer.querySelector('.cursor-follow-dot');
  const interactiveSelector = 'a, button, [role="button"], [role="link"], input, textarea, select, label, summary, .leaflet-interactive';
  const textSelector = 'input, textarea, select, [contenteditable="true"]';
  let targetX = -100;
  let targetY = -100;
  let ringX = targetX;
  let ringY = targetY;
  let echoX = targetX;
  let echoY = targetY;
  let frameId = 0;
  let pressTimer;
  let started = false;

  const place = (element, x, y) => {
    element.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
  };

  const animate = () => {
    ringX += (targetX - ringX) * 0.2;
    ringY += (targetY - ringY) * 0.2;
    echoX += (targetX - echoX) * 0.11;
    echoY += (targetY - echoY) * 0.11;
    place(ring, ringX, ringY);
    place(echo, echoX, echoY);

    if (Math.abs(targetX - ringX) > 0.1 || Math.abs(targetY - ringY) > 0.1 ||
        Math.abs(targetX - echoX) > 0.1 || Math.abs(targetY - echoY) > 0.1) {
      frameId = window.requestAnimationFrame(animate);
    } else {
      frameId = 0;
    }
  };

  const hideCursor = () => {
    dot.classList.remove('is-visible', 'is-pressing', 'is-text-input');
    ring.classList.remove('is-visible', 'is-hovering', 'is-pressing', 'is-text-input');
    echo.classList.remove('is-visible', 'is-pressing', 'is-text-input');
    document.body.classList.remove('has-cursor-trail');
    window.cancelAnimationFrame(frameId);
    frameId = 0;
    started = false;
  };

  window.addEventListener('mousemove', (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    place(dot, targetX, targetY);

    if (!started) {
      started = true;
      ringX = echoX = targetX;
      ringY = echoY = targetY;
      place(ring, ringX, ringY);
      place(echo, echoX, echoY);
      document.body.classList.add('has-cursor-trail');
      dot.classList.add('is-visible');
      ring.classList.add('is-visible');
      echo.classList.add('is-visible');
    }

    const target = event.target instanceof Element ? event.target : null;
    ring.classList.toggle('is-hovering', Boolean(target && target.closest(interactiveSelector)));
    const isTextField = Boolean(target && target.closest(textSelector));
    dot.classList.toggle('is-text-input', isTextField);
    ring.classList.toggle('is-text-input', isTextField);
    echo.classList.toggle('is-text-input', isTextField);

    if (!frameId) frameId = window.requestAnimationFrame(animate);
  }, { passive: true });

  window.addEventListener('mousedown', () => {
    dot.classList.add('is-pressing');
    ring.classList.add('is-pressing');
    echo.classList.remove('is-pressing');
    // Restart the ripple on every click.
    void echo.offsetWidth;
    echo.classList.add('is-pressing');
    window.clearTimeout(pressTimer);
    pressTimer = window.setTimeout(() => {
      dot.classList.remove('is-pressing');
      ring.classList.remove('is-pressing');
      echo.classList.remove('is-pressing');
    }, 440);
  });

  window.addEventListener('blur', hideCursor);
  window.addEventListener('mouseout', (event) => {
    if (!event.relatedTarget) hideCursor();
  });
})();
