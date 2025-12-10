function adjustVideoHeight() {
  var video = document.getElementById('drivestudio-video');
  var container = document.getElementById('video-container');
  var contentCell = document.getElementById('content-cell');
  
  video.onloadedmetadata = function() {
    var videoAspectRatio = video.videoWidth / video.videoHeight;
    var newHeight = container.offsetWidth / videoAspectRatio;
    container.style.height = newHeight + 'px';
    contentCell.style.height = newHeight + 'px';
  };

  if (video.readyState >= 1) {
    video.onloadedmetadata();
  }
}

function toggleblock(blockId) {
  const block = document.getElementById(blockId);
  block.style.display = block.style.display === 'none' ? 'block' : 'none';
}

function hideallabs() {
    var abs = document.querySelectorAll('[id$="_abs"]');
    abs.forEach(function(el) {
        el.style.display = 'none';
    });
}

window.onload = function() {
    hideallabs();
    adjustVideoHeight();
};

window.onresize = adjustVideoHeight;

// Theme handling
document.addEventListener('DOMContentLoaded', function() {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  const themeToggle = document.getElementById('theme-toggle');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
  const THEME_KEY = 'theme';
  const THEME_SOURCE_KEY = 'theme-source';

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      const isOpen = navMenu.classList.toggle('is-open');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navMenu.querySelectorAll('.nav-link').forEach(function(link) {
      link.addEventListener('click', function() {
        if (navMenu.classList.contains('is-open')) {
          navMenu.classList.remove('is-open');
          navToggle.classList.remove('active');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && navMenu.classList.contains('is-open')) {
        navMenu.classList.remove('is-open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (!themeToggle) {
    return;
  }

  function updateTheme(theme) {
    document.body.classList.remove('light-mode', 'dark-mode');
    document.documentElement.style.colorScheme = theme === 'dark' ? 'dark' : 'light';

    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
      document.body.classList.add('light-mode');
      themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
  }

  function applyTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const themeSource = localStorage.getItem(THEME_SOURCE_KEY);
    const systemTheme = prefersDarkScheme.matches ? 'dark' : 'light';

    if (themeSource === 'manual' && (savedTheme === 'light' || savedTheme === 'dark')) {
      updateTheme(savedTheme);
    } else {
      localStorage.removeItem(THEME_KEY);
      localStorage.removeItem(THEME_SOURCE_KEY);
      updateTheme(systemTheme);
    }
  }

  applyTheme();

  themeToggle.addEventListener('click', function() {
    const isDark = document.body.classList.contains('dark-mode');
    const nextTheme = isDark ? 'light' : 'dark';
    const systemTheme = prefersDarkScheme.matches ? 'dark' : 'light';

    if (nextTheme === systemTheme) {
      localStorage.removeItem(THEME_KEY);
      localStorage.removeItem(THEME_SOURCE_KEY);
    } else {
      localStorage.setItem(THEME_KEY, nextTheme);
      localStorage.setItem(THEME_SOURCE_KEY, 'manual');
    }

    updateTheme(nextTheme);
  });

  prefersDarkScheme.addEventListener('change', function(event) {
    if (localStorage.getItem(THEME_SOURCE_KEY) !== 'manual') {
      localStorage.removeItem(THEME_KEY);
      localStorage.removeItem(THEME_SOURCE_KEY);
      updateTheme(event.matches ? 'dark' : 'light');
    }
  });
});
