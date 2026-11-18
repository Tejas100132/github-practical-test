/* ========================================================
   PORTFOLIO LOGIC (script.js)
   Author: Tejas Kushwah
   Technologies: Vanilla JavaScript (ES6)
   Zero external libraries or frameworks
   ======================================================== */

// Execute as soon as the DOM content is ready
document.addEventListener("DOMContentLoaded", () => {

    /* ----------------------------------------------------
       1. THEME TOGGLE (DARK / LIGHT) WITH LOCALSTORAGE
       Persists user choice and respects system defaults.
       ---------------------------------------------------- */
    const themeToggleBtn = document.getElementById("theme-toggle");
    const themeIcon = document.getElementById("theme-icon");
    const themeLabel = document.getElementById("theme-label");

    // Helper: Safely read from localStorage (handles private browsing / blocked storage)
    function getStoredTheme() {
        try {
            return localStorage.getItem("portfolio-theme");
        } catch (e) {
            console.warn("Storage access not available:", e);
            return null;
        }
    }

    // Helper: Safely save to localStorage
    function setStoredTheme(theme) {
        try {
            localStorage.setItem("portfolio-theme", theme);
        } catch (e) {
            console.warn("Unable to save theme preference:", e);
        }
    }

    // Update the button icon, text, and accessible aria-label based on the active theme
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

    // Apply the theme to the root <html> tag
    function applyTheme(theme) {
        document.documentElement.setAttribute("data-theme", theme);
        updateThemeToggleUI(theme);
    }

    // Initialize Theme: Check localStorage first, fallback to system preference, default to dark
    const storedTheme = getStoredTheme();
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = storedTheme ? storedTheme : (systemPrefersDark ? "dark" : "dark"); // Dark theme as default aesthetic

    applyTheme(initialTheme);

    // Event Listener for Theme Toggle Button
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener("click", () => {
            const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
            const newTheme = currentTheme === "dark" ? "light" : "dark";

            applyTheme(newTheme);
            setStoredTheme(newTheme);
        });
    }

    /* ----------------------------------------------------
       2. BACK TO TOP BUTTON
       Reveals when the user scrolls down, smooth-scrolls to top on click.
       ---------------------------------------------------- */
    const backToTopBtn = document.getElementById("back-to-top");
    const scrollThreshold = 300; // Show after scrolling 300px

    function handleScroll() {
        if (!backToTopBtn) return;
        const currentScrollY = window.scrollY || document.documentElement.scrollTop;

        if (currentScrollY > scrollThreshold) {
            backToTopBtn.classList.add("visible");
        } else {
            backToTopBtn.classList.remove("visible");
        }
    }

    // Passive listener for smooth scrolling performance
    window.addEventListener("scroll", handleScroll, { passive: true });

    if (backToTopBtn) {
        backToTopBtn.addEventListener("click", () => {
            const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion ? "auto" : "smooth"
            });
        });
    }

    /* ----------------------------------------------------
       3. LIGHTWEIGHT SCROLL REVEAL ANIMATIONS
       Uses IntersectionObserver with prefers-reduced-motion support.
       ---------------------------------------------------- */
    const revealElements = document.querySelectorAll(".reveal-on-scroll");
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        // Accessibility fallback: Immediately display all elements if user prefers reduced motion
        revealElements.forEach((el) => {
            el.classList.add("is-revealed");
        });
    } else {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-revealed");
                    // Stop observing once revealed to save memory and CPU cycles
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
       4. DYNAMIC TIME-BASED GREETING
       Presents greeting based on the current hour.
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
       5. SMOOTH SCROLL FOR HERO CTA BUTTONS
       Handles in-page anchor links smoothly.
       ---------------------------------------------------- */
    const internalAnchors = document.querySelectorAll('a[href^="#"]');

    internalAnchors.forEach((anchor) => {
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
       6. CONSOLE LOG (FOR VIVA / ACADEMIC DEMONSTRATION)
       ---------------------------------------------------- */
    console.log(
        "%c Tejas Kushwah Portfolio Loaded Successfully ",
        "background: #6366f1; color: #ffffff; font-weight: bold; padding: 4px 10px; border-radius: 4px;"
    );
    console.log("Active Theme:", document.documentElement.getAttribute("data-theme"));
    console.log("Reduced Motion Active:", prefersReducedMotion);
});
