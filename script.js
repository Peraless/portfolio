const sections = document.querySelectorAll('.project, .about-grid, .tool-row');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

sections.forEach((section) => observer.observe(section));
