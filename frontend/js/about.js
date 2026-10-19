/* =========================================================
   CARECIRCLE — ABOUT US PAGE
   File: frontend/js/about.js

   Features:
   1. Initialize About page enhancements
   2. Smooth-scroll to internal page sections
   3. Update the footer copyright year
   4. Handle failed image loading gracefully
   ========================================================= */

"use strict";

/* =========================
   1. INITIALIZE PAGE
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
    initializeAboutPage();
});

function initializeAboutPage() {
    initializeAboutSmoothScroll();
    initializeAboutFooterYear();
    initializeAboutImages();

    console.log("CareCircle About page initialized.");
}

/* =========================
   2. SMOOTH SCROLLING
   ========================= */

function initializeAboutSmoothScroll() {
    const internalLinks = document.querySelectorAll(
        'a[href^="#"]'
    );

    internalLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const href = link.getAttribute("href");

            // Ignore empty placeholder links.
            if (!href || href === "#") {
                return;
            }

            let target;

            try {
                target = document.querySelector(href);
            } catch (error) {
                // Ignore malformed selectors.
                return;
            }

            if (!target) {
                return;
            }

            event.preventDefault();

            const reduceMotion = window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches;

            target.scrollIntoView({
                behavior: reduceMotion ? "auto" : "smooth",
                block: "start"
            });

            // Update the hash without triggering a second jump.
            if (window.location.hash !== href) {
                window.history.replaceState(
                    null,
                    "",
                    href
                );
            }
        });
    });
}


/* =========================
   3. FOOTER COPYRIGHT YEAR
   ========================= */

function initializeAboutFooterYear() {
    const yearElement = document.getElementById("currentYear");

    if (!yearElement) {
        return;
    }

    // Keep the footer year current.
    yearElement.textContent = new Date().getFullYear();
}


/* =========================
   4. IMAGE ERROR HANDLING
   ========================= */

function initializeAboutImages() {
    const images = document.querySelectorAll(
        ".about-hero img, " +
        ".about-mission img, " +
        ".about-approach img"
    );

    images.forEach((image) => {
        image.addEventListener("error", () => {
            // Avoid repeated attempts if the image has already failed.
            if (image.dataset.fallbackApplied === "true") {
                return;
            }

            image.dataset.fallbackApplied = "true";

            // Hide the failed image while preserving its layout.
            image.style.visibility = "hidden";

            console.warn(
                "An About page image could not be loaded:",
                image.alt || image.src
            );
        });
    });
}