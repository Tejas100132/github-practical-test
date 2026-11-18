/* ========================================================
   PORTFOLIO LOGIC (script.js)
   Author: Tejas Kushwah
   Technologies: Vanilla JavaScript (ES6)
   Feature: Responsive Navigation Bar & Core Interactions
   ======================================================== */

// Execute as soon as the DOM content is ready
document.addEventListener("DOMContentLoaded", () => {

    /* ----------------------------------------------------
       1. RESPONSIVE NAVBAR: MOBILE HAMBURGER MENU
       Handles toggling, closing on navigation, and accessibility
       ---------------------------------------------------- */
    const navToggleBtn = document.getElementById("nav-toggle");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");
    const siteHeader = document.getElementById("site-header");

    function toggleMobileMenu() {
        if (!navToggleBtn || !navMenu) return;

        const isOpen = navMenu.classList.contains("is-open");
        if (isOpen) {
            closeMobileMenu();
        } else {
            navMenu.classList.add("is-open");
            navToggleBtn.classList.add("is-active");
            navToggleBtn.setAttribute("aria-expanded", "true");
        }
    }

    function closeMobileMenu() {
        if (!navToggleBtn || !navMenu) return;
        navMenu.classList.remove("is-open");
        navToggleBtn.classList.remove("is-active");
        navToggleBtn.setAttribute("aria-expanded", "false");
    }

    if (navToggleBtn) {
        navToggleBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            toggleMobileMenu();
        });
    }

    // Automatically close menu when any nav link is clicked
    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            closeMobileMenu();
        });
    });

    // Close menu when clicking outside of the header
    document.addEventListener("click", (event) => {
        if (siteHeader && !siteHeader.contains(event.target)) {
            closeMobileMenu();
        }
    });

    // Accessibility: Close menu when pressing Escape key
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMobileMenu();
        }
    });

    /* ----------------------------------------------------
       2. SCROLLSPY & HEADER SHADOW ON SCROLL
       Highlights the active nav link and adds shadow on scroll
       ---------------------------------------------------- */
    const sections = document.querySelectorAll("section[id], .hero-section[id]");

    function handleScrollEvents() {
        const scrollY = window.scrollY || document.documentElement.scrollTop;

        // Add subtle shadow to header when scrolled past 20px
        if (siteHeader) {
            if (scrollY > 20) {
                siteHeader.classList.add("header-scrolled");
            } else {
                siteHeader.classList.remove("header-scrolled");
            }
        }

        // Active Section ScrollSpy
        let currentSectionId = "";
        sections.forEach((section) => {
            const sectionTop = section.offsetTop - 120; // Offset for sticky navbar
            const sectionHeight = section.offsetHeight;

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute("id");
            }
        });

        if (currentSectionId) {
            navLinks.forEach((link) => {
                link.classList.remove("active");
                if (link.getAttribute("href") === `#${currentSectionId}`) {
                    link.classList.add("active");
                }
            });
        }
    }

    window.addEventListener("scroll", handleScrollEvents, { passive: true });

    /* ----------------------------------------------------
       3. SMOOTH SCROLLING FOR ALL ANCHORS
       ---------------------------------------------------- */
    const allInternalAnchors = document.querySelectorAll('a[href^="#"]');
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    allInternalAnchors.forEach((anchor) => {
        anchor.addEventListener("click", function (event) {
            const targetId = this.getAttribute("href");
            if (targetId && targetId !== "#") {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    event.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: prefersReducedMotion ? "auto" : "smooth",
                        block: "start"
                    });
                }
            }
        });
    });

    /* ----------------------------------------------------
       4. THEME TOGGLE (DARK / LIGHT) WITH LOCALSTORAGE
       ---------------------------------------------------- */
    const themeToggleBtn = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");
    const themeLabel = document.getElementById("theme-label");

    function getStoredTheme() {
        try {
            return localStorage.getItem("portfolio-theme");
        } catch (e) {
            console.warn("Storage access not available:", e);
            return null;
        }
    }

    function setStoredTheme(theme) {
        try {
            localStorage.setItem("portfolio-theme", theme);
        } catch (e) {
            console.warn("Unable to save theme preference:", e);
        }
    }

    function updateThemeToggleUI(activeTheme) {
        if (!themeToggleBtn) return;

        if (activeTheme === "light") {
            if (themeIcon) themeIcon.textContent = "🌙";
            if (themeLabel) themeLabel.textContent = "Dark Mode";
            themeToggleBtn.setAttribute("aria-label", "Switch to dark theme");
            themeToggleBtn.title = "Switch to dark theme";
        } else {
            if (themeIcon) themeIcon.textContent = "☀️";
            if (themeLabel) themeLabel.textContent = "Light Mode";
            themeToggleBtn.setAttribute("aria-label", "Switch to light theme");
            themeToggleBtn.title = "Switch to light theme";
        }
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute("data-theme", theme);
        updateThemeToggleUI(theme);
    }

    const storedTheme = getStoredTheme();
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = storedTheme ? storedTheme : (systemPrefersDark ? "dark" : "dark");

    applyTheme(initialTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
            const newTheme = currentTheme === "dark" ? "light" : "dark";

            applyTheme(newTheme);
            setStoredTheme(newTheme);
        });
    }

    /* ----------------------------------------------------
       5. BACK TO TOP BUTTON
       ---------------------------------------------------- */
    const backToTopBtn = document.getElementById("back-to-top");
    const scrollThreshold = 300;

    function handleBackToTopVisibility() {
        if (!backToTopBtn) return;
        const currentScrollY = window.scrollY || document.documentElement.scrollTop;

        if (currentScrollY > scrollThreshold) {
            backToTopBtn.classList.add("visible");
        } else {
            backToTopBtn.classList.remove("visible");
        }
    }

    window.addEventListener("scroll", handleBackToTopVisibility, { passive: true });

    if (backToTopBtn) {
        backToTopBtn.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion ? "auto" : "smooth"
            });
        });
    }

    /* ----------------------------------------------------
       6. SCROLL REVEAL ANIMATIONS
       ---------------------------------------------------- */
    const revealElements = document.querySelectorAll(".reveal-on-scroll");

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        revealElements.forEach((el) => {
            el.classList.add("is-revealed");
        });
    } else {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-revealed");
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: "0px 0px -40px 0px"
        });

        revealElements.forEach((el) => {
            revealObserver.observe(el);
        });
    }

    /* ----------------------------------------------------
       7. DYNAMIC TIME-BASED GREETING
       ---------------------------------------------------- */
    const greetingBadge = document.getElementById("greeting");
    if (greetingBadge) {
        const currentHour = new Date().getHours();
        let greetingMessage = "Welcome to my portfolio!";

        if (currentHour >= 5 && currentHour < 12) {
            greetingMessage = "Good Morning! ☀️ Welcome to my portfolio";
        } else if (currentHour >= 12 && currentHour < 18) {
            greetingMessage = "Good Afternoon! 🌤️ Welcome to my portfolio";
        } else {
            greetingMessage = "Good Evening! 🌙 Welcome to my portfolio";
        }

        greetingBadge.textContent = greetingMessage;
    }

    /* ----------------------------------------------------
       8. DYNAMIC COPYRIGHT YEAR (FOOTER)
       ---------------------------------------------------- */
    const copyrightYearSpan = document.getElementById("copyright-year");
    if (copyrightYearSpan) {
        copyrightYearSpan.textContent = new Date().getFullYear();
    }

    /* ----------------------------------------------------
       9. DEVTOOLS LOGGING (PRACTICAL DEMONSTRATION)
       ---------------------------------------------------- */
    console.log(
        "%c Tejas Kushwah Portfolio - Production Build (Navbar & Footer Merged) ",
        "background: #2563eb; color: #ffffff; font-weight: bold; padding: 4px 10px; border-radius: 4px;"
    );
});
