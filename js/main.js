/* PPM Online Projects — Main JS */

// Nav scroll behaviour
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  nav?.classList.toggle('scrolled', window.scrollY > 60);
});

// Ken-burns: hero + page-hero
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.hero')?.classList.add('loaded');
  document.querySelector('.page-hero')?.classList.add('loaded');
});

// Mobile nav
const hamburger = document.querySelector('.nav__hamburger');
const mobileNav = document.querySelector('.nav__mobile');
const closeBtn  = document.querySelector('.nav__mobile__close');
hamburger?.addEventListener('click', () => mobileNav?.classList.add('open'));
closeBtn?.addEventListener('click',  () => mobileNav?.classList.remove('open'));
mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileNav.classList.remove('open')));

// Fade-in on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Contact form submit (placeholder)
document.querySelector('.js-contact-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type=submit]');
  btn.textContent = 'Message sent — we\'ll be in touch shortly.';
  btn.disabled = true;
});
