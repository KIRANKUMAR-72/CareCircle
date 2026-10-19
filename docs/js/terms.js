
/* =========================================================
   CARECIRCLE - TERMS AND CONDITIONS
   File: frontend/js/terms.js
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    initializeFooterYear();
    initializeTermsNavigation();
    initializeBackToTop();
});

/**
 * Update the copyright year in the footer.
 */
function initializeFooterYear() {
    const yearElement = document.getElementById("currentYear");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

/**
 * Enable smooth scrolling for the table of contents.
 */
function initializeTermsNavigation() {
    const navigationLinks = document.querySelectorAll(
        ".terms-sidebar nav a[href^='#']"
    );

    const sections = [];

    navigationLinks.forEach((link) => {
        const targetId = link.getAttribute("href");

        if (!targetId || targetId === "#") {
            return;
        }

        const targetSection = document.querySelector(targetId);

        if (!targetSection) {
            return;
        }

        sections.push({
            link,
            section: targetSection
        });

        link.addEventListener("click", (event) => {
            event.preventDefault();

            targetSection.scrollIntoView({
                behavior: getScrollBehavior(),
                block: "start"
            });

            // Keep the URL in sync with the selected section.
            if (window.history && window.history.replaceState) {
                window.history.replaceState(null, "", targetId);
            }

            setActiveNavigationLink(link);
        });
    });

    if (sections.length === 0) {
        return;
    }

    // Highlight the section currently being viewed.
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                const visibleEntries = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort(
                        (a, b) =>
                            a.boundingClientRect.top -
                            b.boundingClientRect.top
                    );

                if (visibleEntries.length > 0) {
                    const visibleSection = visibleEntries[0].target;

                    const matchingItem = sections.find(
                        (item) => item.section === visibleSection
                    );

                    if (matchingItem) {
                        setActiveNavigationLink(matchingItem.link);
                    }
                }
            },
            {
                root: null,
                rootMargin: "-15% 0px -70% 0px",
                threshold: 0
            }
        );

        sections.forEach(({ section }) => {
            observer.observe(section);
        });
    }

    // Support links that open the page at a specific section.
    if (window.location.hash) {
        const initialLink = Array.from(navigationLinks).find(
            (link) =>
                link.getAttribute("href") === window.location.hash
        );

        if (initialLink) {
            setActiveNavigationLink(initialLink);
        }
    }
}

/**
 * Mark one table-of-contents link as active.
 *
 * @param {HTMLAnchorElement} activeLink
 */
function setActiveNavigationLink(activeLink) {
    const navigationLinks = document.querySelectorAll(
        ".terms-sidebar nav a"
    );

    navigationLinks.forEach((link) => {
        const isActive = link === activeLink;

        link.classList.toggle("active", isActive);

        if (isActive) {
            link.setAttribute("aria-current", "location");
        } else {
            link.removeAttribute("aria-current");
        }
    });
}

/**
 * Respect the visitor's reduced-motion preference.
 *
 * @returns {"smooth" | "auto"}
 */
function getScrollBehavior() {
    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    return prefersReducedMotion ? "auto" : "smooth";
}

/**
 * Handle the Back to Top link.
 */
function initializeBackToTop() {
    const backToTopLink = document.getElementById("backToTop");

    if (!backToTopLink) {
        return;
    }

    backToTopLink.addEventListener("click", (event) => {
        event.preventDefault();

        window.scrollTo({
            top: 0,
            behavior: getScrollBehavior()
        });

        if (window.history && window.history.replaceState) {
            window.history.replaceState(
                null,
                "",
                window.location.pathname + window.location.search
            );
        }
    });
}

/**
 * Expose page utilities for optional testing or future integration.
 */
window.CareCircleTerms = {
    initializeFooterYear,
    initializeTermsNavigation,
    initializeBackToTop
};
