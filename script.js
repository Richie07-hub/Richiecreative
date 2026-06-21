document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // CLOUDINARY CONFIGURATION
  // ==========================================
  const CLOUDINARY_CONFIG = {
    cloudName: 'demo', // Replace with your Cloudinary Cloud Name
    enabled: true,     // Switch to false to fall back to local assets
    transformations: 'f_auto,q_auto,w_800' // Auto optimization transformations
  };

  // Helper function to resolve Cloudinary URLs with local fallback
  const getImageUrl = (assetName, defaultLocalPath) => {
    if (!CLOUDINARY_CONFIG.enabled) {
      return defaultLocalPath;
    }
    
    // Cloudinary demo public IDs mapping
    const assetMap = {
      'branding': 'docs/project-collaboration',
      'ui_ux': 'smartphone',
      'packaging': 'bag',
      'marketing': 'exhibition'
    };

    const publicId = assetMap[assetName];
    if (publicId) {
      return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/${CLOUDINARY_CONFIG.transformations}/${publicId}`;
    }
    return defaultLocalPath;
  };

  // Initialize Portfolio Images on Load
  const portfolioImgs = document.querySelectorAll('.portfolio-img');
  portfolioImgs.forEach(img => {
    const assetName = img.getAttribute('data-asset');
    const fallbackSrc = img.getAttribute('src');
    img.src = getImageUrl(assetName, fallbackSrc);
  });

  // ==========================================
  // CUSTOM CURSOR LOGIC
  // ==========================================
  const cursor = document.getElementById('customCursor');
  const follower = document.getElementById('customCursorFollower');
  
  if (cursor && follower && window.innerWidth > 768) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    // Follower smooth delay
    const updateFollower = () => {
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;
      follower.style.left = followerX + 'px';
      follower.style.top = followerY + 'px';
      requestAnimationFrame(updateFollower);
    };
    updateFollower();

    // Hover states for links & interactive items
    const hoverElements = document.querySelectorAll('a, button, input, textarea, .portfolio-item, .slider-btn');
    hoverElements.forEach(elem => {
      elem.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
      });
      elem.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
      });
    });
  }

  // ==========================================
  // THEME TOGGLE (LIGHT & DARK MODE)
  // ==========================================
  const themeToggle = document.getElementById('themeToggle');
  const moonIcon = document.querySelector('.moon-icon');
  const sunIcon = document.querySelector('.sun-icon');

  if (themeToggle && moonIcon && sunIcon) {
    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

    if (savedTheme === 'light' || (!savedTheme && prefersLight)) {
      document.documentElement.classList.add('light-theme');
      moonIcon.style.display = 'none';
      sunIcon.style.display = 'block';
    } else {
      document.documentElement.classList.remove('light-theme');
      moonIcon.style.display = 'block';
      sunIcon.style.display = 'none';
    }

    themeToggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('light-theme');
      const isLight = document.documentElement.classList.contains('light-theme');
      
      if (isLight) {
        moonIcon.style.display = 'none';
        sunIcon.style.display = 'block';
        localStorage.setItem('theme', 'light');
      } else {
        moonIcon.style.display = 'block';
        sunIcon.style.display = 'none';
        localStorage.setItem('theme', 'dark');
      }
    });
  }

  // ==========================================
  // STICKY HEADER & SCROLL TRACKING
  // ==========================================
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // ==========================================
  // MOBILE MENU TOGGLE
  // ==========================================
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
        
        // Update active class
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      });
    });
  }

  // ==========================================
  // SCROLL REVEAL ANIMATION (INTERSECTION OBSERVER)
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // ==========================================
  // PORTFOLIO FILTERING
  // ==========================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Active Button Style
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        
        // Animation Out
        item.style.opacity = '0';
        item.style.transform = 'scale(0.8) translateY(20px)';
        
        setTimeout(() => {
          if (filterValue === 'all' || itemCategory === filterValue) {
            item.style.display = 'block';
            // Animation In
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'scale(1) translateY(0)';
            }, 50);
          } else {
            item.style.display = 'none';
          }
        }, 300);
      });
    });
  });

  // ==========================================
  // PORTFOLIO DETAILS MODAL LOGIC
  // ==========================================
  const projectDetails = {
    1: {
      title: "Aethera Identity System",
      category: "Branding",
      image: getImageUrl('branding', "./assets/branding_showcase.png"),
      description: "A comprehensive brand identity overhaul designed to project elegance, purity, and organic quality. We worked closely with their founders to craft a custom vector wordmark, minimalist package layout guidelines, and a sleek, unified color scheme.",
      client: "Aethera Cosmetics",
      industry: "Beauty & Wellness",
      services: "Corporate Identity, Style Guide",
      year: "2026"
    },
    2: {
      title: "Nova Crypt Dashboard",
      category: "UI/UX Design",
      image: getImageUrl('ui_ux', "./assets/ui_ux_showcase.png"),
      description: "A premium dashboard interface focused on clarity, user experience, and aesthetic precision. Designed for both desktop and mobile applications, it simplifies complex asset data streams into clean charts and beautiful, readable widgets.",
      client: "Nova Crypt Ltd.",
      industry: "Finance & Web3",
      services: "UI Design, App Layout",
      year: "2026"
    },
    3: {
      title: "Lumina Seltzer Design",
      category: "Packaging",
      image: getImageUrl('packaging', "./assets/packaging_showcase.png"),
      description: "Visual design for a lineup of organic, botanical-infused sparkling beverages. We created minimalist metallic silver accents and vibrant blue waves that convey hydration, clean ingredients, and outstanding modern taste.",
      client: "Lumina Beverages",
      industry: "Beverage",
      services: "Packaging Layout, 3D Rendering",
      year: "2025"
    },
    4: {
      title: "Futura Arts Poster",
      category: "Marketing",
      image: getImageUrl('marketing', "./assets/marketing_showcase.png"),
      description: "A series of futuristic promotional exhibition posters. Incorporating bold, clean typography alongside complex glowing 3D elements, this art direction represents the cutting edge of digital graphic styling.",
      client: "Futura Gallery",
      industry: "Art & Culture",
      services: "Exhibition Poster, Print Layout",
      year: "2026"
    }
  };

  const projectModal = document.getElementById('projectModal');
  const modalImg = document.getElementById('modalImg');
  const modalCategory = document.getElementById('modalCategory');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalClient = document.getElementById('modalClient');
  const modalIndustry = document.getElementById('modalIndustry');
  const modalServices = document.getElementById('modalServices');
  const modalYear = document.getElementById('modalYear');
  const modalClose = document.getElementById('modalClose');

  const openModal = (projectId) => {
    const data = projectDetails[projectId];
    if (!data) return;

    modalImg.src = data.image;
    modalImg.alt = data.title;
    modalCategory.textContent = data.category;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.description;
    modalClient.textContent = data.client;
    modalIndustry.textContent = data.industry;
    modalServices.textContent = data.services;
    modalYear.textContent = data.year;

    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Stop scrolling
  };

  const closeModal = () => {
    projectModal.classList.remove('active');
    document.body.style.overflow = ''; // Re-enable scrolling
  };

  // Bind Open Triggers
  document.querySelectorAll('[data-modal]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const id = trigger.getAttribute('data-modal');
      openModal(id);
    });
  });

  // Bind Close Triggers
  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) {
        closeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });

  // ==========================================
  // TESTIMONIAL SLIDER CAROUSEL
  // ==========================================
  const slider = document.getElementById('testimonialSlider');
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  
  if (slider && slides.length > 0) {
    let currentSlide = 0;
    const totalSlides = slides.length;
    let autoPlayInterval;

    const showSlide = (index) => {
      if (index >= totalSlides) currentSlide = 0;
      else if (index < 0) currentSlide = totalSlides - 1;
      else currentSlide = index;

      slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    };

    const nextSlide = () => showSlide(currentSlide + 1);
    const prevSlide = () => showSlide(currentSlide - 1);

    if (nextBtn && prevBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        resetAutoPlay();
      });
      prevBtn.addEventListener('click', () => {
        prevSlide();
        resetAutoPlay();
      });
    }

    // Auto Play
    const startAutoPlay = () => {
      autoPlayInterval = setInterval(nextSlide, 5000);
    };

    const resetAutoPlay = () => {
      clearInterval(autoPlayInterval);
      startAutoPlay();
    };

    startAutoPlay();
  }

  // ==========================================
  // CONTACT FORM LOGIC
  // ==========================================
  const contactForm = document.getElementById('contactForm');
  const responseMsg = document.getElementById('formResponse');

  if (contactForm && responseMsg) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      submitBtn.textContent = "Sending Message...";
      submitBtn.disabled = true;

      // Simulate network request
      setTimeout(() => {
        const nameInput = document.getElementById('formName').value;
        responseMsg.classList.remove('error', 'success');
        responseMsg.classList.add('success');
        responseMsg.textContent = `Thank you, ${nameInput}! Your design message has been received successfully. We will follow up in 24 hours.`;
        
        // Reset Form
        contactForm.reset();
        submitBtn.textContent = "Send Message";
        submitBtn.disabled = false;
      }, 1500);
    });
  }

  // ==========================================
  // ACTIVE NAV LINK TRACKING ON SCROLL
  // ==========================================
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= (sectionTop - 200)) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });
  });
});
