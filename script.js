const root = document.documentElement;
const themeButton = document.querySelector('#themeToggle');
const themeMeta = document.querySelector('meta[name="theme-color"]');
const savedTheme = localStorage.getItem('portfolio-theme');

if (savedTheme === 'light') {
  root.dataset.theme = 'light';
  themeMeta.content = '#f3f1ed';
}

themeButton.addEventListener('click', () => {
  const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  localStorage.setItem('portfolio-theme', next);
  themeMeta.content = next === 'dark' ? '#07070a' : '#f3f1ed';
  themeButton.setAttribute('aria-label', next === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro');
});

document.querySelector('#year').textContent = new Date().getFullYear();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const finePointer = window.matchMedia('(pointer: fine)').matches;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (finePointer && !reduceMotion) {
  const glow = document.querySelector('.cursor-glow');
  window.addEventListener('pointermove', (event) => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }, { passive: true });

  document.querySelectorAll('.tilt-card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${-y * 3}deg) rotateY(${x * 4}deg) translateY(-2px)`;
    });
    card.addEventListener('pointerleave', () => {
      card.style.transform = '';
    });
  });
}

const languageColors = {
  HTML: '#e34c26', CSS: '#563d7c', JavaScript: '#f1e05a', TypeScript: '#3178c6'
};

function escapeText(value) {
  const element = document.createElement('span');
  element.textContent = value;
  return element.innerHTML;
}

async function loadRepositories() {
  const feed = document.querySelector('#repoFeed');
  try {
    const response = await fetch('https://api.github.com/users/Peraless/repos?sort=updated&per_page=20');
    if (!response.ok) throw new Error('GitHub API unavailable');
    const allRepos = await response.json();
    const repos = allRepos.filter((repo) => !repo.fork && repo.name !== 'Peraless').slice(0, 3);
    document.querySelector('#repoCount').textContent = `${allRepos.length}+`;
    feed.innerHTML = repos.map((repo) => {
      const language = repo.language || 'Web';
      const color = languageColors[language] || '#9b87f5';
      return `<a class="repo-item" href="${repo.html_url}" target="_blank" rel="noreferrer">
        <div class="repo-item-head"><span>${escapeText(repo.name)}</span><i>↗</i></div>
        <p>${escapeText(repo.description || 'Proyecto web creado por Emiliano Perales.')}</p>
        <div class="repo-meta"><span><i class="language-dot" style="background:${color}"></i>${escapeText(language)}</span><span>☆ ${repo.stargazers_count}</span></div>
      </a>`;
    }).join('');
  } catch {
    feed.innerHTML = `<a class="repo-item" href="https://github.com/Peraless/portfolio" target="_blank" rel="noreferrer"><div class="repo-item-head"><span>portfolio</span><i>↗</i></div><p>Portafolio personal Full Stack.</p><div class="repo-meta"><span><i class="language-dot"></i>HTML</span></div></a><a class="repo-item" href="https://github.com/Peraless/taskflow" target="_blank" rel="noreferrer"><div class="repo-item-head"><span>taskflow</span><i>↗</i></div><p>Tablero Kanban con persistencia local.</p><div class="repo-meta"><span><i class="language-dot"></i>JavaScript</span></div></a><a class="repo-item" href="https://github.com/Peraless/fintrack" target="_blank" rel="noreferrer"><div class="repo-item-head"><span>fintrack</span><i>↗</i></div><p>Dashboard de finanzas personales.</p><div class="repo-meta"><span><i class="language-dot"></i>JavaScript</span></div></a>`;
  }
}

loadRepositories();
