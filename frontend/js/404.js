
/* =========================================================
   CARECIRCLE - 404 PAGE NOT FOUND
   File: frontend/js/404.js
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    initializeFooterYear();
    initializeHomeKeyboardShortcut();
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
 * Allow users to press Alt + H to return to the homepage.
 *
 * Ignore the shortcut when the user is typing in a form field
 * or using an interactive editable element.
 */
function initializeHomeKeyboardShortcut() {
    document.addEventListener("keydown", (event) => {
        if (!event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) {
            return;
        }

        if (event.key.toLowerCase() !== "h") {
            return;
        }

        const target = event.target;

        if (
            target instanceof HTMLElement &&
            (
                target.isContentEditable ||
                ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
            )
        ) {
            return;
        }

        event.preventDefault();
        window.location.href = "../index.html";
    });
}

/**
 * Expose page utilities for testing and future enhancements.
 */
window.CareCircle404 = {
    initializeFooterYear,
    initializeHomeKeyboardShortcut
};