
// =========================================================
// CARECIRCLE — FORGOT PASSWORD PAGE
// File: frontend/js/forgot-password.js
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // -----------------------------------------------------
    // 1. Get HTML elements
    // -----------------------------------------------------

    const forgotPasswordForm = document.getElementById("forgotPasswordForm");
    const emailInput = document.getElementById("forgotEmail");
    const emailError = document.getElementById("forgotEmailError");
    const formMessage = document.getElementById("forgotFormMessage");
    const submitButton = document.getElementById("forgotSubmitButton");
    const currentYear = document.getElementById("currentYear");

    // -----------------------------------------------------
    // 2. Update footer year
    // -----------------------------------------------------

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // -----------------------------------------------------
    // 3. Check required HTML elements
    // -----------------------------------------------------

    if (
        !forgotPasswordForm ||
        !emailInput ||
        !emailError ||
        !formMessage ||
        !submitButton
    ) {
        console.error(
            "CareCircle: Required forgot-password form elements were not found."
        );
        return;
    }

    // -----------------------------------------------------
    // 4. Helper: Display field error
    // -----------------------------------------------------

    function showEmailError(message) {
        emailError.textContent = message;
        emailInput.setAttribute("aria-invalid", "true");
    }

    // -----------------------------------------------------
    // 5. Helper: Clear field error
    // -----------------------------------------------------

    function clearEmailError() {
        emailError.textContent = "";
        emailInput.removeAttribute("aria-invalid");
    }

    // -----------------------------------------------------
    // 6. Helper: Display form feedback
    // -----------------------------------------------------

    function showFormMessage(message, type = "info") {
        formMessage.textContent = message;

        // Support both common feedback class conventions.
        formMessage.classList.remove(
            "success",
            "error",
            "info",
            "is-success",
            "is-error",
            "is-info"
        );

        formMessage.classList.add(type, `is-${type}`);
        formMessage.hidden = false;
    }

    // -----------------------------------------------------
    // 7. Helper: Hide form feedback
    // -----------------------------------------------------

    function hideFormMessage() {
        formMessage.textContent = "";
        formMessage.hidden = true;

        formMessage.classList.remove(
            "success",
            "error",
            "info",
            "is-success",
            "is-error",
            "is-info"
        );
    }

    // -----------------------------------------------------
    // 8. Validate email
    // -----------------------------------------------------

    function validateEmail() {
        const email = emailInput.value.trim();

        clearEmailError();

        if (!email) {
            showEmailError("Please enter your registered email address.");
            return false;
        }

        if (email.length > 254) {
            showEmailError("Your email address is too long.");
            return false;
        }

        // Practical format check for an email address.
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            showEmailError("Please enter a valid email address.");
            return false;
        }

        return true;
    }

    // -----------------------------------------------------
    // 9. Clear errors as the user edits the email
    // -----------------------------------------------------

    emailInput.addEventListener("input", () => {
        clearEmailError();
        hideFormMessage();
    });

    emailInput.addEventListener("blur", () => {
        if (emailInput.value.trim()) {
            validateEmail();
        }
    });

    // -----------------------------------------------------
    // 10. Handle form submission
    // -----------------------------------------------------

    forgotPasswordForm.addEventListener("submit", (event) => {
        event.preventDefault();

        hideFormMessage();

        if (!validateEmail()) {
            emailInput.focus();
            return;
        }

        const email = emailInput.value.trim();

        // -------------------------------------------------
        // Backend integration will go here.
        //
        // When the backend is ready, send a POST request to
        // the password-reset endpoint. The server should
        // generate a secure, expiring reset token and send
        // the reset link by email.
        //
        // Do not generate reset tokens or reset passwords
        // directly in frontend JavaScript.
        // -------------------------------------------------

        console.info(
            "CareCircle: Forgot-password form validated. " +
            "No reset email was sent because the backend is not connected."
        );

        showFormMessage(
            "Your email looks valid, but password-reset emails are not available yet. " +
            "CareCircle's backend reset service needs to be connected before a reset link can be sent.",
            "info"
        );

        // Keep the button usable because no request was sent.
        submitButton.disabled = false;
    });

    // -----------------------------------------------------
    // 11. Expose validation helpers for optional testing
    // -----------------------------------------------------

    window.CareCircleForgotPassword = {
        validateEmail,
        clearEmailError,
        hideFormMessage
    };
});
