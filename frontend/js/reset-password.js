
// =========================================================
// CARECIRCLE — RESET PASSWORD PAGE
// File: frontend/js/reset-password.js
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // -----------------------------------------------------
    // 1. Get HTML elements
    // -----------------------------------------------------

    const resetPasswordForm = document.getElementById("resetPasswordForm");

    const newPasswordInput = document.getElementById("newPassword");
    const confirmPasswordInput = document.getElementById("confirmNewPassword");

    const newPasswordError = document.getElementById("newPasswordError");
    const confirmPasswordError = document.getElementById("confirmPasswordError");

    const formMessage = document.getElementById("resetFormMessage");
    const submitButton = document.getElementById("resetSubmitButton");
    const currentYear = document.getElementById("currentYear");

    const toggleNewPasswordButton = document.getElementById("toggleNewPassword");
    const toggleConfirmPasswordButton = document.getElementById("toggleConfirmPassword");

    const requirementLength = document.getElementById("requirementLength");
    const requirementUppercase = document.getElementById("requirementUppercase");
    const requirementLowercase = document.getElementById("requirementLowercase");
    const requirementNumber = document.getElementById("requirementNumber");
    const requirementSpecial = document.getElementById("requirementSpecial");

    // -----------------------------------------------------
    // 2. Update footer year
    // -----------------------------------------------------

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // -----------------------------------------------------
    // 3. Verify required HTML elements
    // -----------------------------------------------------

    if (
        !resetPasswordForm ||
        !newPasswordInput ||
        !confirmPasswordInput ||
        !newPasswordError ||
        !confirmPasswordError ||
        !formMessage ||
        !submitButton
    ) {
        console.error(
            "CareCircle: Required reset-password form elements were not found."
        );
        return;
    }

    // -----------------------------------------------------
    // 4. Password requirement rules
    // -----------------------------------------------------

    function getPasswordRequirements(password) {
        return {
            length: password.length >= 8 && password.length <= 128,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[^A-Za-z0-9]/.test(password)
        };
    }

    // -----------------------------------------------------
    // 5. Update live requirement indicators
    // -----------------------------------------------------

    function updateRequirementIndicator(element, isMet) {
        if (!element) {
            return;
        }

        element.classList.toggle("met", isMet);
        element.classList.toggle("not-met", !isMet);

        element.setAttribute("aria-label", isMet ? "Requirement met" : "Requirement not met");
    }

    function updatePasswordRequirements() {
        const password = newPasswordInput.value;
        const requirements = getPasswordRequirements(password);

        updateRequirementIndicator(requirementLength, requirements.length);
        updateRequirementIndicator(requirementUppercase, requirements.uppercase);
        updateRequirementIndicator(requirementLowercase, requirements.lowercase);
        updateRequirementIndicator(requirementNumber, requirements.number);
        updateRequirementIndicator(requirementSpecial, requirements.special);

        return requirements;
    }

    // -----------------------------------------------------
    // 6. Error message helpers
    // -----------------------------------------------------

    function showFieldError(input, errorElement, message) {
        errorElement.textContent = message;
        input.setAttribute("aria-invalid", "true");
    }

    function clearFieldError(input, errorElement) {
        errorElement.textContent = "";
        input.removeAttribute("aria-invalid");
    }

    function clearAllFieldErrors() {
        clearFieldError(newPasswordInput, newPasswordError);
        clearFieldError(confirmPasswordInput, confirmPasswordError);
    }

    // -----------------------------------------------------
    // 7. Form feedback helpers
    // -----------------------------------------------------

    function showFormMessage(message, type = "info") {
        formMessage.textContent = message;

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
    // 8. Show or hide a password
    // -----------------------------------------------------

    function setupPasswordToggle(button, input, accessibleName) {
        if (!button || !input) {
            return;
        }

        button.addEventListener("click", () => {
            const shouldShowPassword = input.type === "password";

            input.type = shouldShowPassword ? "text" : "password";

            button.setAttribute(
                "aria-label",
                shouldShowPassword
                    ? `Hide ${accessibleName}`
                    : `Show ${accessibleName}`
            );

            button.setAttribute(
                "aria-pressed",
                String(shouldShowPassword)
            );

            input.focus();
        });
    }

    setupPasswordToggle(
        toggleNewPasswordButton,
        newPasswordInput,
        "new password"
    );

    setupPasswordToggle(
        toggleConfirmPasswordButton,
        confirmPasswordInput,
        "confirm password"
    );

    // -----------------------------------------------------
    // 9. Validate the new password
    // -----------------------------------------------------

    function validateNewPassword() {
        const password = newPasswordInput.value;
        const requirements = updatePasswordRequirements();

        clearFieldError(newPasswordInput, newPasswordError);

        if (!password) {
            showFieldError(
                newPasswordInput,
                newPasswordError,
                "Please enter your new password."
            );

            return false;
        }

        if (password.length < 8) {
            showFieldError(
                newPasswordInput,
                newPasswordError,
                "Your password must contain at least 8 characters."
            );

            return false;
        }

        if (password.length > 128) {
            showFieldError(
                newPasswordInput,
                newPasswordError,
                "Your password cannot exceed 128 characters."
            );

            return false;
        }

        if (!requirements.uppercase) {
            showFieldError(
                newPasswordInput,
                newPasswordError,
                "Add at least one uppercase letter (A–Z)."
            );

            return false;
        }

        if (!requirements.lowercase) {
            showFieldError(
                newPasswordInput,
                newPasswordError,
                "Add at least one lowercase letter (a–z)."
            );

            return false;
        }

        if (!requirements.number) {
            showFieldError(
                newPasswordInput,
                newPasswordError,
                "Add at least one number (0–9)."
            );

            return false;
        }

        if (!requirements.special) {
            showFieldError(
                newPasswordInput,
                newPasswordError,
                "Add at least one special character, such as !, @, or #."
            );

            return false;
        }

        return true;
    }

    // -----------------------------------------------------
    // 10. Validate the confirmation password
    // -----------------------------------------------------

    function validateConfirmPassword() {
        const password = newPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        clearFieldError(confirmPasswordInput, confirmPasswordError);

        if (!confirmPassword) {
            showFieldError(
                confirmPasswordInput,
                confirmPasswordError,
                "Please confirm your new password."
            );

            return false;
        }

        if (password !== confirmPassword) {
            showFieldError(
                confirmPasswordInput,
                confirmPasswordError,
                "The passwords do not match. Please try again."
            );

            return false;
        }

        return true;
    }

    // -----------------------------------------------------
    // 11. Validate while the user types
    // -----------------------------------------------------

    newPasswordInput.addEventListener("input", () => {
        hideFormMessage();

        updatePasswordRequirements();

        if (newPasswordInput.hasAttribute("aria-invalid")) {
            validateNewPassword();
        }

        if (confirmPasswordInput.value) {
            validateConfirmPassword();
        }
    });

    confirmPasswordInput.addEventListener("input", () => {
        hideFormMessage();

        if (confirmPasswordInput.hasAttribute("aria-invalid")) {
            validateConfirmPassword();
        }
    });

    newPasswordInput.addEventListener("blur", () => {
        if (newPasswordInput.value) {
            validateNewPassword();
        }
    });

    confirmPasswordInput.addEventListener("blur", () => {
        if (confirmPasswordInput.value) {
            validateConfirmPassword();
        }
    });

    // -----------------------------------------------------
    // 12. Handle form submission
    // -----------------------------------------------------

    resetPasswordForm.addEventListener("submit", (event) => {
        event.preventDefault();

        hideFormMessage();

        const isPasswordValid = validateNewPassword();
        const isConfirmationValid = validateConfirmPassword();

        if (!isPasswordValid) {
            newPasswordInput.focus();
            return;
        }

        if (!isConfirmationValid) {
            confirmPasswordInput.focus();
            return;
        }

        // -------------------------------------------------
        // Backend integration is required here.
        //
        // A production implementation should:
        // 1. Read the reset token from the URL.
        // 2. Send the token and new password to the backend.
        // 3. Verify the token's validity and expiration.
        // 4. Hash the password securely on the server.
        // 5. Invalidate the reset token after successful use.
        //
        // Never change account passwords using frontend-only
        // JavaScript or trust a token without server validation.
        // -------------------------------------------------

        console.info(
            "CareCircle: Password validation successful. " +
            "No password was changed because the backend is not connected."
        );

        showFormMessage(
            "Your new password meets the requirements and both passwords match. " +
            "However, your password has not been changed because the secure " +
            "password-reset backend is not connected yet.",
            "info"
        );

        formMessage.focus();
    });

    // -----------------------------------------------------
    // 13. Initialize requirement indicators
    // -----------------------------------------------------

    updatePasswordRequirements();

    // -----------------------------------------------------
    // 14. Expose helpers for optional browser testing
    // -----------------------------------------------------

    window.CareCircleResetPassword = {
        validateNewPassword,
        validateConfirmPassword,
        updatePasswordRequirements,
        getPasswordRequirements
    };
});
