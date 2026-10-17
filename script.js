const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const themeToggle = document.getElementById('themeToggle');
const progressBar = document.getElementById('progressBar');

menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.textContent = isOpen ? '✕' : '☰';
});

document.querySelectorAll('.nav-link, .nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.textContent = '☰';
  });
});

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  const lightMode = document.body.classList.contains('light');
  themeToggle.textContent = lightMode ? '☾' : '☼';
  themeToggle.setAttribute('aria-label', lightMode ? 'Switch to dark mode' : 'Switch to light mode');
});

window.addEventListener('scroll', () => {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`;
});

const words = ['Web Experts', 'Digital ideas'];
const typedText = document.getElementById('typedText');
let wordIndex = 0, charIndex = 0, deleting = false;
function typeLoop() {
  const word = words[wordIndex];
  typedText.textContent = word.slice(0, charIndex);
  if (!deleting && charIndex < word.length) {
    charIndex++;
    setTimeout(typeLoop, 90);
  } else if (deleting && charIndex > 0) {
    charIndex--;
    setTimeout(typeLoop, 45);
  } else {
    deleting = !deleting;
    if (!deleting) wordIndex = (wordIndex + 1) % words.length;
    setTimeout(typeLoop, deleting ? 1200 : 250);
  }
}
typeLoop();

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const sections = document.querySelectorAll('main section[id]');
const navItems = document.querySelectorAll('.nav-link');
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
    }
  });
}, { rootMargin: '-35% 0px -55% 0px' });
sections.forEach(section => sectionObserver.observe(section));

document.getElementById('year').textContent = new Date().getFullYear();

document.getElementById('contactForm').addEventListener('submit', event => {
  event.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  // Replace this address with your real email address.
  const recipient = 'hello@example.com';
  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
  document.getElementById('formHint').textContent = 'Opening your email app. Change hello@example.com in script.js to your own email first.';
  window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
});


// Lightweight 3D-inspired particle field and perspective grid background.
(() => {
  const canvas = document.getElementById('threeDBackground');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width = 0, height = 0, dpr = 1, frame = 0;
  let particles = [];
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const particleCount = () => Math.min(95, Math.max(36, Math.floor(width / 14)));

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 1.6);
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    particles = Array.from({ length: particleCount() }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * .9 + .1,
      r: Math.random() * 1.8 + .45,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * .22 + .06
    }));
    if (reducedMotion) draw(0, true);
  }

  function draw(time = 0, staticFrame = false) {
    ctx.clearRect(0, 0, width, height);
    const isLight = document.body.classList.contains('light');
    const rgb = isLight ? '17,155,97' : '83,224,160';
    const t = staticFrame ? 0 : time * 0.00025;
    pointer.x += (pointer.tx - pointer.x) * .025;
    pointer.y += (pointer.ty - pointer.y) * .025;

    // Perspective wireframe floor that subtly moves toward the horizon.
    const horizon = height * .58;
    ctx.save();
    ctx.translate(pointer.x * .012, pointer.y * .012);
    ctx.strokeStyle = `rgba(${rgb},${isLight ? .10 : .13})`;
    ctx.lineWidth = 1;
    for (let i = 0; i < 13; i++) {
      const f = i / 12;
      const y = horizon + Math.pow(f, 1.75) * height * .58;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
    }
    for (let i = -12; i <= 12; i++) {
      ctx.beginPath(); ctx.moveTo(width / 2 + i * 8, horizon);
      ctx.lineTo(width / 2 + i * width * .075, height); ctx.stroke();
    }
    ctx.restore();

    // Floating points with gentle depth movement and nearby connecting lines.
    const projected = particles.map(p => {
      if (!staticFrame) {
        p.y -= p.speed * (1.2 + p.z * 2.2);
        p.x += Math.sin(t * 2 + p.phase) * .22;
        if (p.y < -10) { p.y = height + 10; p.x = Math.random() * width; }
      }
      return { x: p.x + pointer.x * p.z * .018, y: p.y + Math.cos(t + p.phase) * (staticFrame ? 0 : 4), z: p.z, r: p.r };
    });
    for (let i = 0; i < projected.length; i++) {
      for (let j = i + 1; j < projected.length; j++) {
        const a = projected[i], b = projected[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const distance = Math.hypot(dx, dy);
        if (distance < 105) {
          ctx.strokeStyle = `rgba(${rgb},${(1 - distance / 105) * .18 * Math.min(a.z + .3, b.z + .3)})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    projected.forEach(p => {
      ctx.beginPath();
      ctx.fillStyle = `rgba(${rgb},${.24 + p.z * .55})`;
      ctx.shadowBlur = p.r * 5;
      ctx.shadowColor = `rgba(${rgb},.55)`;
      ctx.arc(p.x, p.y, p.r * (.65 + p.z), 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.shadowBlur = 0;
    if (!reducedMotion && !document.hidden) frame = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pointermove', event => {
    pointer.tx = event.clientX - width / 2;
    pointer.ty = event.clientY - height / 2;
  }, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(frame);
    else if (!reducedMotion) frame = requestAnimationFrame(draw);
  });
  // Redraw after theme changes so the canvas matches the selected theme.
  const themeButton = document.getElementById('themeToggle');
  themeButton?.addEventListener('click', () => {
    if (reducedMotion) draw(0, true);
  });
  resize();
  if (!reducedMotion) frame = requestAnimationFrame(draw);
})();
