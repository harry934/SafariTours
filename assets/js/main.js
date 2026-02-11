document.addEventListener('DOMContentLoaded', () => {
  initScrollAnimations();
  initStickyNav();
  initMobileMenu();
  initSmoothScroll();
  initDarkMode();
  initScrollToTop();
});

/* --- Scroll Animations (Fade In Up) --- */
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  const animatedElements = document.querySelectorAll('.fade-in-up');
  animatedElements.forEach(el => observer.observe(el));
}

/* --- Sticky Navigation --- */
function initStickyNav() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('bg-white/95', 'dark:bg-gray-900/95', 'shadow-md', 'py-2');
      nav.classList.remove('py-4', 'bg-transparent');
    } else {
      nav.classList.remove('bg-white/95', 'dark:bg-gray-900/95', 'shadow-md', 'py-2');
      nav.classList.add('py-4', 'bg-transparent'); // Assuming transparent at top
    }
  });
}

/* --- Mobile Menu --- */
function initMobileMenu() {
  const btn = document.getElementById('mobile-menu-btn');
  const menu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('mobile-menu-overlay');
  const openIcon = btn?.querySelector('.menu-open-icon');
  const closeIcon = btn?.querySelector('.menu-close-icon');

  function toggleMenu() {
    const isOpen = !menu.classList.contains('closed');
    
    if (isOpen) {
      menu.classList.add('closed');
      menu.classList.remove('open');
      overlay?.classList.add('hidden');
      document.body.style.overflow = '';
      openIcon?.classList.remove('hidden');
      closeIcon?.classList.add('hidden');
    } else {
      menu.classList.remove('closed');
      menu.classList.add('open');
      overlay?.classList.remove('hidden');
      document.body.style.overflow = 'hidden'; // Prevent background scroll
      openIcon?.classList.add('hidden');
      closeIcon?.classList.remove('hidden');
    }
  }

  btn?.addEventListener('click', toggleMenu);
  overlay?.addEventListener('click', toggleMenu);
  
  // Close menu when clicking a link
  menu?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', toggleMenu);
  });
}

/* --- Smooth Scrolling --- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

/* --- Dark Mode Toggle --- */
function initDarkMode() {
  const toggleBtn = document.getElementById('theme-toggle');
  const html = document.documentElement;
  
  // Check preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    html.classList.add('dark');
    html.setAttribute('data-theme', 'dark');
  } else {
    html.classList.remove('dark');
    html.setAttribute('data-theme', 'light');
  }

  toggleBtn?.addEventListener('click', () => {
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      html.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    } else {
      html.classList.add('dark');
      html.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  });
}

/* --- Scroll To Top --- */
function initScrollToTop() {
  const btn = document.getElementById('scroll-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.remove('opacity-0', 'invisible');
      btn.classList.add('opacity-100', 'visible');
    } else {
      btn.classList.add('opacity-0', 'invisible');
      btn.classList.remove('opacity-100', 'visible');
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
