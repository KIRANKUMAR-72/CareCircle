
/* =========================================================
   CareCircle — Services Page JavaScript
   File: frontend/js/services.js

   Features:
   1. Initialize services page interactions
   2. Smoothly navigate to the service catalog
   3. Improve service-card keyboard accessibility
   4. Add lightweight card interaction feedback
   5. Respect reduced-motion preferences

   Note:
   This file handles frontend interactions only.
   Backend requests will be implemented separately.
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    initializeServicesPage();

    console.log("CareCircle Services page initialized.");
});

/**
 * Initializes all Services page features.
 */
function initializeServicesPage() {
    initializeServiceCatalogNavigation();
    initializeServiceCardAccessibility();
    initializeServiceCardInteractions();
}

/**
 * Smoothly scrolls to the service catalog when the page
 * contains a link targeting #serviceCatalog.
 */
function initializeServiceCatalogNavigation() {
    const catalog = document.getElementById("serviceCatalog");

    if (!catalog) {
        return;
    }

    const catalogLinks = document.querySelectorAll(
        'a[href="#serviceCatalog"]'
    );

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    catalogLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();

            catalog.scrollIntoView({
                behavior: prefersReducedMotion ? "auto" : "smooth",
                block: "start"
            });

            // Keep the destination reachable with a keyboard.
            catalog.setAttribute("tabindex", "-1");
            catalog.focus({ preventScroll: true });

            // Update the URL fragment without a page reload.
            if (window.location.hash !== "#serviceCatalog") {
                window.history.replaceState(
                    null,
                    "",
                    "#serviceCatalog"
                );
            }
        });
    });
}

/**
 * Makes service cards keyboard-focusable.
 *
 * The card itself is not turned into a link because it already
 * contains a dedicated link for opening the relevant service.
 */
function initializeServiceCardAccessibility() {
    const serviceCards = document.querySelectorAll(".service-card");

    serviceCards.forEach((card) => {
        const serviceLink = card.querySelector(".service-link");

        if (!serviceLink) {
            return;
        }

        // Provide a consistent focus target for the card's link.
        serviceLink.addEventListener("focus", () => {
            card.classList.add("service-card-focused");
        });

        serviceLink.addEventListener("blur", () => {
            card.classList.remove("service-card-focused");
        });
    });
}

/**
 * Adds subtle interaction feedback when a service card
 * receives pointer or keyboard attention.
 */
function initializeServiceCardInteractions() {
    const serviceCards = document.querySelectorAll(".service-card");

    serviceCards.forEach((card) => {
        card.addEventListener("mouseenter", () => {
            card.classList.add("service-card-active");
        });

        card.addEventListener("mouseleave", () => {
            card.classList.remove("service-card-active");
        });
    });
}
