document.querySelector('#year').textContent = new Date().getFullYear();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.project, .about, .contact').forEach((el) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(22px)';
  el.style.transition = 'opacity .65s ease, transform .65s ease';
  observer.observe(el);
});

const style = document.createElement('style');
style.textContent = '.visible{opacity:1!important;transform:translateY(0)!important}@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;animation:none!important;transition:none!important}}';
document.head.appendChild(style);
