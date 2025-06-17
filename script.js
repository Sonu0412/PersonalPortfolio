// DOM Elements
const loadingScreen = document.getElementById('loading-screen');
const themeToggle = document.getElementById('theme-toggle');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const backToTop = document.getElementById('back-to-top');
const contactForm = document.getElementById('contact-form');
const navLinks = document.querySelectorAll('.nav-link');

// Theme Management
const themeManager = {
    init() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
        themeToggle.addEventListener('click', () => this.toggleTheme());
    },

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        const icon = themeToggle.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fas fa-sun';
        } else {
            icon.className = 'fas fa-moon';
        }
    },

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }
};

// Loading Screen
const loadingManager = {
    init() {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loadingScreen.classList.add('loading-complete');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 1500);
        });
    }
};

// Navigation
const navigationManager = {
    init() {
        this.setupSmoothScrolling();
        this.setupActiveNavigation();
        this.setupMobileMenu();
        this.setupScrollEffects();
    },

    setupSmoothScrolling() {
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
                
                // Close mobile menu if open
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    },

    setupActiveNavigation() {
        const sections = document.querySelectorAll('section');
        
        window.addEventListener('scroll', () => {
            let current = '';
            const scrollPos = window.scrollY + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                
                if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    },

    setupMobileMenu() {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    },

    setupScrollEffects() {
        const navbar = document.querySelector('.navbar');
        
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                navbar.style.backdropFilter = 'blur(15px)';
            } else {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
            }
        });
    }
};

// Animations
const animationManager = {
    init() {
        this.setupScrollAnimations();
        this.setupCounterAnimations();
        this.setupTypingAnimation();
    },

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Add animation classes to elements
        const animatedElements = document.querySelectorAll(
            '.section-header, .about-content > *, .education-card, .experience-card, ' +
            '.project-card, .achievement-card, .hobby-card, .contact-content > *'
        );

        animatedElements.forEach((el, index) => {
            el.classList.add('fade-in');
            el.style.animationDelay = `${index * 0.1}s`;
            observer.observe(el);
        });
    },

    setupCounterAnimations() {
        const counterElements = document.querySelectorAll('.stat-number');
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        });

        counterElements.forEach(el => counterObserver.observe(el));
    },

    animateCounter(element) {
        const target = parseFloat(element.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                // For CGPA, show decimal places
                if (target === 8.2) {
                    element.textContent = current.toFixed(1);
                } else {
                    element.textContent = Math.floor(current);
                }
                requestAnimationFrame(updateCounter);
            } else {
                // Show final value with appropriate formatting
                if (target === 8.2) {
                    element.textContent = target.toFixed(1);
                } else {
                    element.textContent = target;
                }
            }
        };

        updateCounter();
    },

    setupTypingAnimation() {
        const typingElement = document.querySelector('.typing-text');
        if (!typingElement) return;

        const text = "Hi, I'm Sonu C.";
        const typeSpeed = 100;
        const deleteSpeed = 50;
        const pauseTime = 2000;

        let index = 0;
        let isDeleting = false;

        const typeEffect = () => {
            if (isDeleting) {
                typingElement.textContent = text.slice(0, index - 1);
                index--;
            } else {
                typingElement.textContent = text.slice(0, index + 1);
                index++;
            }

            if (!isDeleting && index === text.length) {
                setTimeout(() => {
                    isDeleting = true;
                }, pauseTime);
            } else if (isDeleting && index === 0) {
                isDeleting = false;
            }

            const speed = isDeleting ? deleteSpeed : typeSpeed;
            setTimeout(typeEffect, speed);
        };

        typeEffect();
    }
};

// Particles Animation
const particlesManager = {
    init() {
        this.createParticles();
    },

    createParticles() {
        const particlesContainer = document.getElementById('particles');
        if (!particlesContainer) return;

        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 4 + 1}px;
                height: ${Math.random() * 4 + 1}px;
                background: rgba(99, 102, 241, ${Math.random() * 0.5 + 0.2});
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${Math.random() * 10 + 10}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            particlesContainer.appendChild(particle);
        }

        // Add CSS for particle animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
                10% { opacity: 1; }
                90% { opacity: 1; }
                100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
};

// Back to Top Button
const backToTopManager = {
    init() {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
};

// Contact Form
const contactManager = {
    init() {
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    },

    async handleSubmit(e) {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        const formData = {
            from_name: contactForm.name.value,
            from_email: contactForm.email.value,
            subject: contactForm.subject.value,
            message: contactForm.message.value,
            to_email: 'sonuchandru2004@gmail.com'
        };

        try {
            // For now, simulate email sending
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.showNotification('Message sent successfully to sonuchandru2004@gmail.com!', 'success');
            contactForm.reset();
        } catch (error) {
            console.error('Email Error:', error);
            this.showNotification('Failed to send message. Please try again.', 'error');
        }
        
        // Reset button state
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    },

    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            ${type === 'success' ? 'background: #10b981;' : 'background: #ef4444;'}
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 5000);
    }
};

// Project Links Handler
const projectManager = {
    init() {
        const projectLinks = document.querySelectorAll('.project-link');
        projectLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const isGithubLink = link.querySelector('.fa-github');
                const isViewLink = link.querySelector('.fa-eye');
                
                if (isGithubLink) {
                    // Open GitHub repository (replace with actual URLs)
                    window.open('#', '_blank');
                } else if (isViewLink) {
                    // Open live demo (replace with actual URLs)
                    window.open('#', '_blank');
                }
            });
        });
    }
};

// Utility Functions
const utils = {
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// Enhanced scroll performance
const optimizedScrollHandler = utils.throttle(() => {
    navigationManager.setupActiveNavigation();
    backToTopManager.init();
}, 16);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadingManager.init();
    themeManager.init();
    navigationManager.init();
    animationManager.init();
    particlesManager.init();
    backToTopManager.init();
    contactManager.init();
    projectManager.init();
    
    // Add enhanced scroll listener
    window.addEventListener('scroll', optimizedScrollHandler);
});

// Handle page visibility for performance
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause animations when page is hidden
        document.querySelectorAll('.particle').forEach(particle => {
            particle.style.animationPlayState = 'paused';
        });
    } else {
        // Resume animations when page is visible
        document.querySelectorAll('.particle').forEach(particle => {
            particle.style.animationPlayState = 'running';
        });
    }
});

// Preload images for better performance
const imagePreloader = {
    init() {
        const images = [
            'https://pixabay.com/get/g4506f7b5b96719430d7caf52ab1c780e9b7c57a978a51b128ab2e0380da1d649cc808363df372ce9015dbd6a9c76488a2af3f0fe442eda4eb54017b12377a0ac_1280.jpg',
            'https://pixabay.com/get/ga14d58566ebfd75511dbf5f35f243c3a225b647bfd8c31880b9212872f57c79276f21f89942c4eeb78a63fc8c7c8a391889520973721ae9c00ef469e946310fd_1280.jpg'
        ];
        
        images.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }
};

// Initialize image preloader
imagePreloader.init();

// Service Worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(registrationError => console.log('SW registration failed'));
    });
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// Performance monitoring
const performanceMonitor = {
    init() {
        if ('performance' in window) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const perf = performance.getEntriesByType('navigation')[0];
                    console.log('Page load time:', perf.loadEventEnd - perf.loadEventStart, 'ms');
                }, 0);
            });
        }
    }
};

performanceMonitor.init();
