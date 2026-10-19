
/* =========================================================
   CARECIRCLE — MAIN JAVASCRIPT
   Traditional HTML + CSS + JavaScript
========================================================= */

"use strict";


/* =========================================================
   1. INITIALIZE PAGE
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    initializeMobileNavigation();
    initializeCopyrightYear();
    initializeSmoothScrolling();
    initializeHeaderBehavior();
    initializeImageFallbacks();
    initializeCardInteractions();
});


/* =========================================================
   2. MOBILE NAVIGATION
========================================================= */

function initializeMobileNavigation() {
    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");

    if (!menuToggle || !navMenu) {
        return;
    }

    const menuIcon = menuToggle.querySelector("i");

    function openMenu() {
        navMenu.classList.add("active");

        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close navigation menu");

        if (menuIcon) {
            menuIcon.classList.remove("fa-bars");
            menuIcon.classList.add("fa-xmark");
        }
    }

    function closeMenu() {
        navMenu.classList.remove("active");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");

        if (menuIcon) {
            menuIcon.classList.remove("fa-xmark");
            menuIcon.classList.add("fa-bars");
        }
    }

    function toggleMenu() {
        const isOpen = navMenu.classList.contains("active");

        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    menuToggle.addEventListener("click", toggleMenu);

    // Close the menu after selecting a navigation link.
    navMenu.querySelectorAll("a").forEach(function (link) {
        link.addEventListener("click", closeMenu);
    });

    // Close the menu when clicking outside it.
    document.addEventListener("click", function (event) {
        const clickedInsideMenu = navMenu.contains(event.target);
        const clickedToggle = menuToggle.contains(event.target);

        if (!clickedInsideMenu && !clickedToggle) {
            closeMenu();
        }
    });

    // Close the menu using the Escape key.
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            closeMenu();
            menuToggle.focus();
        }
    });

    // Close the mobile menu when returning to desktop width.
    window.addEventListener("resize", function () {
        if (window.innerWidth > 850) {
            closeMenu();
        }
    });
}


/* =========================================================
   3. AUTOMATIC COPYRIGHT YEAR
========================================================= */

function initializeCopyrightYear() {
    const yearElement = document.getElementById("currentYear");

    if (!yearElement) {
        return;
    }

    yearElement.textContent = new Date().getFullYear();
}


/* =========================================================
   4. SMOOTH SCROLLING
========================================================= */

function initializeSmoothScrolling() {
    const internalLinks = document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach(function (link) {
        link.addEventListener("click", function (event) {
            const targetId = link.getAttribute("href");

            // Ignore empty hash links.
            if (!targetId || targetId === "#") {
                return;
            }

            const targetElement = document.querySelector(targetId);

            if (!targetElement) {
                return;
            }

            event.preventDefault();

            targetElement.scrollIntoView({
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches ? "auto" : "smooth",
                block: "start"
            });

            // Update the URL without causing a sudden jump.
            if (window.location.hash !== targetId) {
                history.pushState(null, "", targetId);
            }
        });
    });
}


/* =========================================================
   5. HEADER BEHAVIOUR
========================================================= */

function initializeHeaderBehavior() {
    const header = document.querySelector(".site-header");

    if (!header) {
        return;
    }

    function updateHeader() {
        if (window.scrollY > 30) {
            header.classList.add("header-scrolled");
        } else {
            header.classList.remove("header-scrolled");
        }
    }

    window.addEventListener("scroll", updateHeader, {
        passive: true
    });

    updateHeader();
}


/* =========================================================
   6. IMAGE FALLBACKS
========================================================= */

function initializeImageFallbacks() {
    const images = document.querySelectorAll("img");

    images.forEach(function (image) {
        image.addEventListener("error", function () {
            // Avoid repeating the error handler.
            image.removeAttribute("src");
            image.classList.add("image-unavailable");

            image.setAttribute("alt", "Image unavailable");

            image.style.backgroundColor = "#e7f2ed";
            image.style.minHeight = "100px";
        });
    });
}


/* =========================================================
   7. CARD INTERACTIONS
========================================================= */

function initializeCardInteractions() {
    const cards = document.querySelectorAll(
        ".step-card, .service-card, .trust-card"
    );

    cards.forEach(function (card) {
        card.addEventListener("mouseenter", function () {
            card.classList.add("card-hover");
        });

        card.addEventListener("mouseleave", function () {
            card.classList.remove("card-hover");
        });
    });
}


/* =========================================================
   8. ACTIVE NAVIGATION LINK
========================================================= */

function initializeActiveNavigation() {
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach(function (link) {
        const linkUrl = new URL(link.href, window.location.href);

        if (linkUrl.pathname === currentPage) {
            navLinks.forEach(function (item) {
                item.classList.remove("active");
            });

            link.classList.add("active");
        }
    });
}

// Update the navigation state on pages that use the shared navbar.
initializeActiveNavigation();


/* =========================================================
   9. SAFE EXTERNAL LINK HANDLING
========================================================= */

function initializeExternalLinks() {
    const externalLinks = document.querySelectorAll(
        'a[target="_blank"]'
    );

    externalLinks.forEach(function (link) {
        link.setAttribute("rel", "noopener noreferrer");
    });
}

initializeExternalLinks();


/* =========================================================
   10. CARECIRCLE INITIALIZATION COMPLETE
========================================================= */

console.info("CareCircle frontend initialized successfully.");
