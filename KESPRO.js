// JavaScript Document

// Mobile menu toggle
const menuIcon = document.querySelector('.menu-icon');
const mobileNav = document.querySelector('.mobile-nav');
const mobileNavClose = document.querySelector('.mobile-nav-close');

function closeMobileMenu() {
   mobileNav.classList.remove('active');
}

function openMobileMenu() {
   mobileNav.classList.add('active');
}

if (menuIcon && mobileNav) {
   menuIcon.addEventListener('click', () => {
      if (mobileNav.classList.contains('active')) {
         closeMobileMenu();
      } else {
         openMobileMenu();
      }
   });

   // Close button
   if (mobileNavClose) {
      mobileNavClose.addEventListener('click', closeMobileMenu);
   }

   // Close mobile menu when clicking a link
   document.querySelectorAll('.mobile-nav a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
   });
}

let currentProject = 0;
const totalProjects = 5;

const imageContainers = document.querySelectorAll('.image-container');
const projectDetails = document.querySelectorAll('.project-details');
const progressDots = document.querySelectorAll('.progress-dot');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

function updateProject(index) {
   // Update images
   imageContainers.forEach((container, i) => {
      container.classList.toggle('active', i === index);
   });

   // Update details
   projectDetails.forEach((detail, i) => {
      detail.classList.toggle('active', i === index);
   });

   // Update progress dots
   progressDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
   });

   currentProject = index;
}

// Navigation arrows - continuous loop
prevBtn.addEventListener('click', () => {
   const newIndex = currentProject > 0 ? currentProject - 1 : totalProjects - 1;
   updateProject(newIndex);
});

nextBtn.addEventListener('click', () => {
   const newIndex = currentProject < totalProjects - 1 ? currentProject + 1 : 0;
   updateProject(newIndex);
});

// Progress dots navigation
progressDots.forEach((dot, index) => {
   dot.addEventListener('click', () => {
      updateProject(index);
   });
});

// Keyboard navigation - continuous loop
document.addEventListener('keydown', (e) => {
   if (e.key === 'ArrowLeft') {
      const newIndex = currentProject > 0 ? currentProject - 1 : totalProjects - 1;
      updateProject(newIndex);
   } else if (e.key === 'ArrowRight') {
      const newIndex = currentProject < totalProjects - 1 ? currentProject + 1 : 0;
      updateProject(newIndex);
   }
});

// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
   touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
   touchEndX = e.changedTouches[0].screenX;
   handleSwipe();
});

function handleSwipe() {
   if (touchEndX < touchStartX - 50) {
      // Swipe left - next project (loop)
      const newIndex = currentProject < totalProjects - 1 ? currentProject + 1 : 0;
      updateProject(newIndex);
   }
   if (touchEndX > touchStartX + 50) {
      // Swipe right - previous project (loop)
      const newIndex = currentProject > 0 ? currentProject - 1 : totalProjects - 1;
      updateProject(newIndex);
   }
}

// Initialize
updateProject(0);

// Hide project controls when scrolling past work section
const projectControls = document.querySelector('.project-controls');
const workSection = document.querySelector('#work');

function updateControlsVisibility() {
   const workBottom = workSection.offsetTop + workSection.offsetHeight;
   const scrollY = window.pageYOffset;

   if (scrollY > workBottom - 200) {
      projectControls.classList.add('hidden');
   } else {
      projectControls.classList.remove('hidden');
   }
}

window.addEventListener('scroll', updateControlsVisibility);
updateControlsVisibility();

// Contact form submission
document.querySelector('.contact-form').addEventListener('submit', (e) => {
   e.preventDefault();
   alert('Thank you for your message! I will get back to you soon.');
   e.target.reset();
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
   anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
         target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
         });
      }
   });
});

// Active menu highlighting on scroll
const sections = document.querySelectorAll('section[id], #work');
const navLinks = document.querySelectorAll('.desktop-nav a, .mobile-nav a');

function highlightActiveSection() {
   const scrollY = window.pageYOffset;

   sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 150;
      const sectionId = section.getAttribute('id');

      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
         navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + sectionId) {
               link.classList.add('active');
            }
         });
      }
   });
}

window.addEventListener('scroll', highlightActiveSection);
highlightActiveSection();

(function () {
    'use strict';

    // --- Elements ---
    var nav = document.getElementById('templatemo-nav');
    var navToggle = document.getElementById('navToggle');
    var navLinks = document.getElementById('navLinks');
    var navItems = document.querySelectorAll('.nav-links a');
    var sections = document.querySelectorAll('.parallax-section');
    var parallaxBgs = document.querySelectorAll('.parallax-bg');
    var revealElements = document.querySelectorAll('.section-content');

    // --- Detect mobile ---
    var isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
                   || window.innerWidth <= 768;

    // =============================================
    // Smooth 
    // =============================================
    // How it works:
    // - Each .parallax-bg is 200% the height of the viewport
    //   and offset by -50% so there's plenty of image above
    //   and below to translate into.
    // - As the user scrolls, we calculate how far the section
    //   midpoint is from the viewport center (a value from -1 to +1).
    // - We multiply that by a large pixel range (half the viewport height)
    //   so the background shifts dramatically relative to the content.
    // - data-speed controls intensity: 0.5 = half viewport travel range.

    var ticking = false;

    function updateParallax() {
        if (isMobile) return;

        var scrollTop = window.pageYOffset;
        var windowHeight = window.innerHeight;

        parallaxBgs.forEach(function (bg) {
            var section = bg.parentElement;
            var rect = section.getBoundingClientRect();

            // Skip sections far outside viewport
            if (rect.bottom < -300 || rect.top > windowHeight + 300) {
                return;
            }

            var speed = parseFloat(bg.getAttribute('data-speed')) || 0.5;

            // How far is the section center from the viewport center?
            // sectionCenterY: vertical center of the section in viewport coords
            var sectionCenterY = rect.top + rect.height / 2;
            var viewportCenterY = windowHeight / 2;

            // offset: negative when section center is above viewport center (scrolled past)
            //         positive when section center is below viewport center (not yet reached)
            var offset = sectionCenterY - viewportCenterY;

            // Normalize to a -1 to +1 range based on how far through the viewport
            // the section has traveled. Using windowHeight + section height as the
            // total travel distance ensures full range coverage.
            var totalTravel = windowHeight + rect.height;
            var normalized = offset / (totalTravel / 2); // -1 to +1

            // Clamp
            normalized = Math.max(-1, Math.min(1, normalized));

            // The maximum pixel displacement — large value for visible effect
            // speed=0.5 means the bg can travel up to 50% of the viewport height
            var maxShift = windowHeight * speed;

            // Apply translation — bg moves in the SAME direction as the offset
            // which means it moves SLOWER than the scroll (parallax lag)
            var translateY = normalized * maxShift;

            bg.style.transform = 'translate3d(0,' + translateY.toFixed(1) + 'px,0)';
        });

        ticking = false;
    }

    function onScroll() {
        if (!ticking) {
            window.requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    if (!isMobile) {
        window.addEventListener('scroll', onScroll, { passive: true });
        updateParallax();
    }

    // Recalculate on resize
    window.addEventListener('resize', function () {
        isMobile = window.innerWidth <= 768;
        if (!isMobile) {
            updateParallax();
        } else {
            parallaxBgs.forEach(function (bg) {
                bg.style.transform = 'translate3d(0,0,0)';
            });
        }
    });

    // --- Navigation Scroll Effect ---
    function handleNavScroll() {
        if (window.scrollY > 80) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavScroll, { passive: true });
    handleNavScroll();

    // --- Mobile Toggle ---
    navToggle.addEventListener('click', function () {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    navItems.forEach(function (link) {
        link.addEventListener('click', function () {
            navToggle.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    // --- Active Link on Scroll ---
    function updateActiveLink() {
        var scrollPos = window.scrollY + window.innerHeight / 3;

        sections.forEach(function (section) {
            var top = section.offsetTop;
            var height = section.offsetHeight;
            var id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navItems.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();

    // --- Scroll Reveal ---
    revealElements.forEach(function (el) {
        el.classList.add('reveal');
    });

    function checkReveal() {
        var windowHeight = window.innerHeight;
        var revealPoint = 120;

        revealElements.forEach(function (el) {
            var elementTop = el.getBoundingClientRect().top;
            if (elementTop < windowHeight - revealPoint) {
                el.classList.add('visible');
            }
        });
    }

    window.addEventListener('scroll', checkReveal, { passive: true });
    checkReveal();

    // --- Contact Form ---
    var contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        });
    }

})();
