/* =========================================================
   CARECIRCLE — SPECIAL CARE PAGE
   File: frontend/js/special-care.js
   Purpose:
   1. Initialize the FAQ accordion
   2. Keep accessibility attributes synchronized
   3. Support keyboard interaction
   4. Smooth-scroll to page sections
   5. Handle initialization safely
   ========================================================= */

"use strict";


/* =========================
   1. INITIALIZE THE PAGE
   ========================= */

document.addEventListener("DOMContentLoaded", () => {
    initializeSpecialCarePage();
});


function initializeSpecialCarePage() {
    initializeSpecialCareFAQ();
    initializeSpecialCareSmoothScroll();

    console.log("CareCircle Special Care page initialized.");
}


/* =========================
   2. FAQ ACCORDION
   ========================= */

function initializeSpecialCareFAQ() {
    const faqItems = document.querySelectorAll(".special-faq-item");

    if (!faqItems.length) {
        return;
    }

    faqItems.forEach((item, index) => {
        const question = item.querySelector(".special-faq-question");
        const answer = item.querySelector(".special-faq-answer");

        if (!question || !answer) {
            return;
        }

        // Give every answer a unique ID for accessibility.
        if (!answer.id) {
            answer.id = `specialFaqAnswer${index + 1}`;
        }

        question.setAttribute("aria-controls", answer.id);

        // Set the initial state based on the existing HTML.
        const initiallyExpanded =
            question.getAttribute("aria-expanded") === "true";

        question.setAttribute(
            "aria-expanded",
            String(initiallyExpanded)
        );

        answer.hidden = !initiallyExpanded;

        // Ensure that only one answer is open initially.
        if (initiallyExpanded) {
            closeOtherSpecialCareFAQs(item);
        }

        // Toggle the answer when the question is clicked.
        question.addEventListener("click", () => {
            toggleSpecialCareFAQ(item);
        });

        // Support Enter and Space for keyboard users.
        // Native buttons already generate click events for these keys.
        // No extra keydown handler is necessary.
    });
}


/* =========================
   3. TOGGLE A FAQ ITEM
   ========================= */

function toggleSpecialCareFAQ(selectedItem) {
    const question = selectedItem.querySelector(
        ".special-faq-question"
    );

    const answer = selectedItem.querySelector(
        ".special-faq-answer"
    );

    if (!question || !answer) {
        return;
    }

    const isCurrentlyExpanded =
        question.getAttribute("aria-expanded") === "true";

    if (isCurrentlyExpanded) {
        closeSpecialCareFAQ(selectedItem);
        return;
    }

    // Close all other FAQ items before opening the selected one.
    closeOtherSpecialCareFAQs(selectedItem);

    question.setAttribute("aria-expanded", "true");
    answer.hidden = false;
}


/* =========================
   4. CLOSE ONE FAQ ITEM
   ========================= */

function closeSpecialCareFAQ(item) {
    const question = item.querySelector(
        ".special-faq-question"
    );

    const answer = item.querySelector(
        ".special-faq-answer"
    );

    if (!question || !answer) {
        return;
    }

    question.setAttribute("aria-expanded", "false");
    answer.hidden = true;
}


/* =========================
   5. CLOSE OTHER FAQ ITEMS
   ========================= */

function closeOtherSpecialCareFAQs(selectedItem) {
    const faqItems = document.querySelectorAll(".special-faq-item");

    faqItems.forEach((item) => {
        if (item !== selectedItem) {
            closeSpecialCareFAQ(item);
        }
    });
}


/* =========================
   6. SMOOTH SCROLLING
   ========================= */

function initializeSpecialCareSmoothScroll() {
    const pageLinks = document.querySelectorAll(
        'a[href^="#"]'
    );

    pageLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const href = link.getAttribute("href");

            // Ignore empty links and placeholder links.
            if (!href || href === "#") {
                return;
            }

            let target;

            try {
                target = document.querySelector(href);
            } catch (error) {
                return;
            }

            // Allow the browser's default behavior if no target exists.
            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches
                    ? "auto"
                    : "smooth",
                block: "start"
            });

            // Update the URL hash without triggering another jump.
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