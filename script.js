document.addEventListener('DOMContentLoaded', () => {
    // Current Year for Footer
    const yearSpan = document.getElementById('currentYear');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Hamburger Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Smooth Scrolling for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Offset for navbar
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });

    // Simple Intersection Observer for Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add fade-in class and observe elements
    const elementsToAnimate = document.querySelectorAll('.section-title, .about-text, .project-card, .skill-category, .cert-card, .timeline-item');
    elementsToAnimate.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // ==========================================
    // Theme Toggle (Light/Dark Mode)
    // ==========================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    // Helper to apply theme
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    };

    // Initialize theme
    if (currentTheme) {
        applyTheme(currentTheme);
    } else {
        // Auto-detect based on system settings
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        applyTheme(prefersDark ? 'dark' : 'light');
        localStorage.setItem('theme', prefersDark ? 'dark' : 'light');
    }

    // Toggle click event
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark-mode');
            const newTheme = isDark ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            showToast(`Switched to ${newTheme} mode!`);
        });
    }

    // ==========================================
    // Toast Notification System
    // ==========================================
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    let toastTimeout;

    window.showToast = function(message) {
        if (!toast || !toastMessage) return;
        
        toastMessage.textContent = message;
        toast.classList.add('show');
        
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    };

    // ==========================================
    // Heading highlight toggle
    // ==========================================
    const headingToggleBtn = document.getElementById('heading-toggle');
    try {
        const saved = localStorage.getItem('showHeadings') === 'true';
        if (saved) document.body.classList.add('show-headings');
    } catch (e) {}

    if (headingToggleBtn) {
        headingToggleBtn.addEventListener('click', () => {
            const enabled = document.body.classList.toggle('show-headings');
            try { localStorage.setItem('showHeadings', enabled); } catch (e) {}
            showToast(enabled ? 'Headings highlighted' : 'Headings cleared');
        });
    }

    // ==========================================
    // Contact Form Submission
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        const formEndpoint = 'https://formspree.io/f/mlgvldzp'; // Formspree form endpoint (updated)
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const submitButton = contactForm.querySelector('button[type="submit"]');
            if (submitButton) submitButton.disabled = true;

            const formData = new FormData(contactForm);
            try {
                const response = await fetch(formEndpoint, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        Accept: 'application/json'
                    }
                });

                if (response.ok) {
                    showToast('Message sent! You will receive it by email.');
                    contactForm.reset();
                } else {
                    const result = await response.json();
                    throw new Error(result.error || 'Submission failed');
                }
            } catch (error) {
                console.error('Contact form error:', error);
                showToast('Unable to send the message. Please try again later.');
            } finally {
                if (submitButton) submitButton.disabled = false;
            }
        });
    }

    // ==========================================
    // Copy to Clipboard (Recruiter Tool)
    // ==========================================
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-copy');
            const textEl = document.getElementById(targetId);
            if (!textEl) return;
            
            const textToCopy = textEl.textContent.trim();
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                // Show success toast
                const label = targetId.includes('email') ? 'Email' : 'Phone Number';
                showToast(`${label} copied to clipboard!`);
                
                // Update tooltip text temporarily
                const tooltip = btn.querySelector('.tooltip');
                if (tooltip) {
                    tooltip.textContent = 'Copied!';
                    setTimeout(() => {
                        tooltip.textContent = 'Copy';
                    }, 1500);
                }
            }).catch(err => {
                console.error('Failed to copy: ', err);
                showToast('Failed to copy. Please copy manually.');
            });
        });
    });
});
