/* =========================================================
   CareCircle — How It Works Page
   File: frontend/js/how-it-works.js

   Features:
   1. Expand and collapse FAQ answers
   2. Keep FAQ accessibility attributes updated
   3. Allow only one FAQ to remain open at a time
   4. Support keyboard interaction through native buttons
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    initializeFaqAccordion();

    console.log("CareCircle How It Works page initialized.");
});

/**
 * Initializes the FAQ accordion.
 *
 * Expected HTML structure:
 *
 * <div class="hiw-faq-item">
 *     <button
 *         class="hiw-faq-question"
 *         type="button"
 *         aria-expanded="false"
 *     >
 *         <span>Question goes here</span>
 *         <i class="fa-solid fa-plus" aria-hidden="true"></i>
 *     </button>
 *
 *     <div class="hiw-faq-answer" hidden>
 *         <p>Answer goes here.</p>
 *     </div>
 * </div>
 */

function initializeFaqAccordion() {
    const faqItems = document.querySelectorAll(".hiw-faq-item");

    if (faqItems.length === 0) {
        return;
    }

    faqItems.forEach((item) => {
        const question = item.querySelector(".hiw-faq-question");
        const answer = item.querySelector(".hiw-faq-answer");

        // Skip incomplete FAQ items instead of causing an error.
        if (!question || !answer) {
            return;
        }

        // Give the answer a unique ID for accessibility.
        if (!answer.id) {
            answer.id = `hiw-faq-answer-${generateFaqId()}`;
        }

        question.setAttribute("aria-controls", answer.id);

        // Normalize the initial state from the HTML attributes.
        const initiallyExpanded =
            question.getAttribute("aria-expanded") === "true";

        question.setAttribute(
            "aria-expanded",
            String(initiallyExpanded)
        );

        answer.hidden = !initiallyExpanded;

        updateFaqIcon(question, initiallyExpanded);

        question.addEventListener("click", () => {
            const isCurrentlyExpanded =
                question.getAttribute("aria-expanded") === "true";

            if (isCurrentlyExpanded) {
                closeFaqItem(question, answer);
                return;
            }

            // Close other open FAQ items first.
            faqItems.forEach((otherItem) => {
                if (otherItem === item) {
                    return;
                }

                const otherQuestion =
                    otherItem.querySelector(".hiw-faq-question");

                const otherAnswer =
                    otherItem.querySelector(".hiw-faq-answer");

                if (otherQuestion && otherAnswer) {
                    closeFaqItem(otherQuestion, otherAnswer);
                }
            });

            openFaqItem(question, answer);
        });
    });
}

/**
 * Opens an FAQ answer.
 */
function openFaqItem(question, answer) {
    question.setAttribute("aria-expanded", "true");
    answer.hidden = false;

    updateFaqIcon(question, true);
}

/**
 * Closes an FAQ answer.
 */
function closeFaqItem(question, answer) {
    question.setAttribute("aria-expanded", "false");
    answer.hidden = true;

    updateFaqIcon(question, false);
}

/**
 * Changes the FAQ icon between plus and minus.
 */
function updateFaqIcon(question, isExpanded) {
    const icon = question.querySelector("i");

    if (!icon) {
        return;
    }

    if (isExpanded) {
        icon.classList.remove("fa-plus");
        icon.classList.add("fa-minus");
        icon.setAttribute("aria-label", "Collapse answer");
    } else {
        icon.classList.remove("fa-minus");
        icon.classList.add("fa-plus");
        icon.removeAttribute("aria-label");
    }

    icon.setAttribute("aria-hidden", "true");
}

/**
 * Generates a unique ID for an FAQ answer.
 */
function generateFaqId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
        return window.crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}