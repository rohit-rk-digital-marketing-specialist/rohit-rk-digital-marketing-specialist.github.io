document.getElementById('year').textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.documentElement.classList.add('motion-ready');

const revealItems = document.querySelectorAll('.section, .contact');
revealItems.forEach((item) => item.classList.add('reveal'));

if (reduceMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });

  revealItems.forEach((item) => revealObserver.observe(item));
}

const counters = document.querySelectorAll('[data-count]');

function setCounterValue(element, value) {
  const decimals = Number(element.dataset.decimals || 0);
  const suffix = element.dataset.suffix || '';
  element.textContent = `${value.toFixed(decimals)}${suffix}`;
}

function animateCounter(element) {
  const target = Number(element.dataset.count);
  const duration = 1100;
  const started = performance.now();

  function update(now) {
    const progress = Math.min((now - started) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    setCounterValue(element, target * eased);
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

if (reduceMotion || !('IntersectionObserver' in window)) {
  counters.forEach((counter) => setCounterValue(counter, Number(counter.dataset.count)));
} else {
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.6 });

  counters.forEach((counter) => counterObserver.observe(counter));
}
