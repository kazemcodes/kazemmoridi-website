// Mobile menu
const mobileMenu = document.getElementById('mobileMenu');
const mobileNav = document.getElementById('mobileNav');

if (mobileMenu && mobileNav) {
  mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });

  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// Nav scroll effect
const nav = document.getElementById('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

// Scroll animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.project-card, .service-card, .pipeline-card, .process-step, .timeline-item, .skill-category, .contact-card, .ecosystem-card, .template-item, .activity-card, .spotlight-stat-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// Active nav link
const sections = document.querySelectorAll('[id]');
const navLinks = document.querySelectorAll('.nav-links a, .mobile-nav a');
const sectionObserver2 = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href.includes(id)) {
          link.style.color = 'var(--accent)';
        } else {
          link.style.color = '';
        }
      });
    }
  });
}, { threshold: 0.3 });
sections.forEach(s => sectionObserver2.observe(s));

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

// Category Filter for Showcase
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.projects-grid .project-card');

if (filterButtons.length > 0 && projectCards.length > 0) {
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-filter');
      
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        const match = filter === 'all' || categories.split(' ').includes(filter);

        card.classList.remove('filter-fade-in');
        
        if (match) {
          card.classList.remove('filter-hidden');
          // Force layout reflow for animation restart
          void card.offsetWidth;
          card.classList.add('filter-fade-in');
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        } else {
          card.classList.add('filter-hidden');
        }
      });
    });
  });
}

