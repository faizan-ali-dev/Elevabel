/**
 * Elevabel Digital Agency - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. Sticky Navigation & Scroll Spy
    ========================================== */
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    let isScrolling = false;
    window.addEventListener('scroll', () => {
        if (!isScrolling) {
            window.requestAnimationFrame(() => {
                // Add specific class for sticky nav
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }

                // Active link switching based on scroll position
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
                    if (link.getAttribute('href').includes(current) && current !== null) {
                        link.classList.add('active');
                    }
                });
                isScrolling = false;
            });
            isScrolling = true;
        }
    });

    /* ==========================================
       2. Mobile Hamburger Menu
    ========================================== */
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');

    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    /* ==========================================
       3. Intersection Observer for Scroll Animations
    ========================================== */
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-down, .reveal-left, .reveal-right');

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Unobserve to animate only once
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    /* ==========================================
       4. Contact Form Validation
    ========================================== */
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            let isValid = true;

            // Basic validation check
            const inputs = contactForm.querySelectorAll('[required]');

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    input.classList.add('invalid');
                    isValid = false;
                } else {
                    input.classList.remove('invalid');

                    // Email validation specifically
                    if (input.type === 'email') {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(input.value)) {
                            input.classList.add('invalid');
                            isValid = false;
                        }
                    }
                }
            });

            // Clear invalid class on input interact
            inputs.forEach(input => {
                input.addEventListener('input', () => {
                    input.classList.remove('invalid');
                });
            });

            if (isValid) {
                // Submit form to Formspree via AJAX
                const submitBtn = document.getElementById('submitBtn');
                const originalText = submitBtn.innerHTML;

                submitBtn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';
                submitBtn.disabled = true;

                const formData = new FormData(contactForm);

                fetch(contactForm.action, {
                    method: contactForm.method,
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                }).then(response => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;

                    if (response.ok) {
                        contactForm.reset();
                        formSuccess.classList.remove('hidden');
                        formSuccess.innerHTML = "Thanks for reaching out! We'll get back to you soon.";

                        // Hide success message after 5 seconds
                        setTimeout(() => {
                            formSuccess.classList.add('hidden');
                        }, 5000);
                    } else {
                        response.json().then(data => {
                            if (Object.hasOwn(data, 'errors')) {
                                formSuccess.innerHTML = data["errors"].map(error => error["message"]).join(", ");
                            } else {
                                formSuccess.innerHTML = "Oops! There was a problem submitting your form";
                            }
                            formSuccess.classList.remove('hidden');
                            setTimeout(() => {
                                formSuccess.classList.add('hidden');
                                formSuccess.innerHTML = "Thanks for reaching out! We'll get back to you soon.";
                            }, 5000);
                        });
                    }
                }).catch(error => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    formSuccess.innerHTML = "Oops! There was a problem submitting your form";
                    formSuccess.classList.remove('hidden');
                    setTimeout(() => {
                        formSuccess.classList.add('hidden');
                        formSuccess.innerHTML = "Thanks for reaching out! We'll get back to you soon.";
                    }, 5000);
                });
            }
        });
    }

    /* ==========================================
       5. View More Services
    ========================================== */
    const viewMoreServicesBtn = document.getElementById('viewMoreServicesBtn');
    if (viewMoreServicesBtn) {
        viewMoreServicesBtn.addEventListener('click', () => {
            const hiddenServices = document.querySelectorAll('.hidden-service');
            hiddenServices.forEach(service => {
                service.classList.remove('hidden-service');
                // Force a small delay to allow CSS to apply display block before observing
                setTimeout(() => {
                    revealOnScroll.observe(service);
                }, 50);
            });
            // Hide the button container
            viewMoreServicesBtn.parentElement.style.display = 'none';
        });
    }
});
