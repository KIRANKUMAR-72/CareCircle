
/* =========================================================
   CARECIRCLE - PRIVACY POLICY
   File: frontend/js/privacy.js
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    initializeFooterYear();
    initializePrivacyNavigation();
    initializeBackToTop();
});

/**
 * Update the footer copyright year automatically.
 */
function initializeFooterYear() {
    const yearElement = document.getElementById("currentYear");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

/**
 * Return the preferred scrolling behaviour.
 * Respect visitors who prefer reduced motion.
 *
 * @returns {"smooth" | "auto"}
 */
function getPrivacyScrollBehavior() {
    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    return prefersReducedMotion ? "auto" : "smooth";
}

/**
 * Highlight the active table-of-contents link.
 *
 * @param {HTMLAnchorElement} activeLink
 */
function setActivePrivacyLink(activeLink) {
    const links = document.querySelectorAll(
        ".privacy-sidebar nav a"
    );

    links.forEach((link) => {
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
 * Enable section navigation and active section highlighting.
 */
function initializePrivacyNavigation() {
    const navigationLinks = document.querySelectorAll(
        ".privacy-sidebar nav a[href^='#']"
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
                behavior: getPrivacyScrollBehavior(),
                block: "start"
            });

            // Update the URL without causing an additional page jump.
            if (window.history && window.history.replaceState) {
                window.history.replaceState(
                    null,
                    "",
                    targetId
                );
            }

            setActivePrivacyLink(link);
        });
    });

    if (sections.length === 0) {
        return;
    }

    // Observe sections as they enter the visible reading area.
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                const visibleSections = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort(
                        (first, second) =>
                            first.boundingClientRect.top -
                            second.boundingClientRect.top
                    );

                if (visibleSections.length === 0) {
                    return;
                }

                const currentSection = visibleSections[0].target;

                const matchingItem = sections.find(
                    (item) => item.section === currentSection
                );

                if (matchingItem) {
                    setActivePrivacyLink(matchingItem.link);
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

    // Highlight the correct link when opening a URL with a section hash.
    if (window.location.hash) {
        const initialLink = Array.from(navigationLinks).find(
            (link) =>
                link.getAttribute("href") === window.location.hash
        );

        if (initialLink) {
            setActivePrivacyLink(initialLink);
        }
    }
}

/**
 * Return to the top of the privacy policy.
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
            behavior: getPrivacyScrollBehavior()
        });

        // Remove the section hash from the URL.
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
 * Expose page functions for testing and future enhancements.
 */
window.CareCirclePrivacy = {
    initializeFooterYear,
    initializePrivacyNavigation,
    initializeBackToTop
};
