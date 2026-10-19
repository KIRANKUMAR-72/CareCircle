"use strict";

/*
=========================================================
 CARECIRCLE - REGISTRATION PAGE JAVASCRIPT
 File: frontend/js/register.js

 Features:
 1. Full name validation
 2. Email validation
 3. Optional phone validation
 4. Role selection validation
 5. Password validation
 6. Confirm password matching
 7. Show/hide password buttons
 8. Terms acceptance validation
 9. Accessible status and error messages

 IMPORTANT:
 This file performs frontend validation only.
 It does not create accounts or save data to MongoDB.
=========================================================
*/

document.addEventListener("DOMContentLoaded", () => {
    initializeRegisterPage();
});


/* =======================================================
   INITIALIZE REGISTRATION PAGE
======================================================= */

function initializeRegisterPage() {
    const registerForm = document.getElementById("registerForm");

    // Avoid running registration logic on other pages.
    if (!registerForm) {
        return;
    }

    initializePasswordToggles();
    initializeRegisterValidation();
    initializeRoleSelection();
    initializeTermsValidation();
    initializeRegisterSubmission();

    console.log("CareCircle registration page initialized.");
}


/* =======================================================
   PASSWORD SHOW / HIDE BUTTONS
======================================================= */

function initializePasswordToggles() {
    const toggleButtons = document.querySelectorAll(
        ".register-password-toggle"
    );

    toggleButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const targetId = button.dataset.passwordTarget;
            const passwordInput = document.getElementById(targetId);

            if (!passwordInput) {
                return;
            }

            const isHidden = passwordInput.type === "password";

            passwordInput.type = isHidden ? "text" : "password";

            button.setAttribute(
                "aria-label",
                isHidden ? "Hide password" : "Show password"
            );

            button.setAttribute(
                "aria-pressed",
                String(isHidden)
            );

            const icon = button.querySelector("i");

            if (icon) {
                icon.classList.toggle("fa-eye", !isHidden);
                icon.classList.toggle("fa-eye-slash", isHidden);
            }

            passwordInput.focus();
        });
    });
}


/* =======================================================
   INITIALIZE LIVE VALIDATION
======================================================= */

function initializeRegisterValidation() {
    const fields = [
        {
            inputId: "fullName",
            errorId: "fullNameError",
            validator: validateFullName
        },
        {
            inputId: "registerEmail",
            errorId: "registerEmailError",
            validator: validateRegisterEmail
        },
        {
            inputId: "phone",
            errorId: "phoneError",
            validator: validatePhone
        },
        {
            inputId: "registerPassword",
            errorId: "passwordError",
            validator: validateRegisterPassword
        },
        {
            inputId: "confirmPassword",
            errorId: "confirmPasswordError",
            validator: validateConfirmPassword
        }
    ];

    fields.forEach(({ inputId, errorId, validator }) => {
        const input = document.getElementById(inputId);

        if (!input) {
            return;
        }

        input.addEventListener("blur", validator);

        input.addEventListener("input", () => {
            clearRegisterFieldError(inputId, errorId);
            clearRegisterMessage();

            // Recheck confirmation when the original password changes.
            if (inputId === "registerPassword") {
                const confirmInput =
                    document.getElementById("confirmPassword");

                if (confirmInput && confirmInput.value) {
                    validateConfirmPassword();
                }
            }
        });
    });
}


/* =======================================================
   FULL NAME VALIDATION
======================================================= */

function validateFullName() {
    const input = document.getElementById("fullName");

    if (!input) {
        return false;
    }

    const name = input.value.trim();

    if (!name) {
        return setRegisterFieldError(
            "fullName",
            "fullNameError",
            "Please enter your full name."
        );
    }

    if (name.length < 2) {
        return setRegisterFieldError(
            "fullName",
            "fullNameError",
            "Your name must contain at least 2 characters."
        );
    }

    if (name.length > 100) {
        return setRegisterFieldError(
            "fullName",
            "fullNameError",
            "Your name must not exceed 100 characters."
        );
    }

    // Reject control characters while allowing international names.
    if (/[\u0000-\u001F\u007F]/.test(name)) {
        return setRegisterFieldError(
            "fullName",
            "fullNameError",
            "Please enter a valid name."
        );
    }

    clearRegisterFieldError("fullName", "fullNameError");
    return true;
}


/* =======================================================
   EMAIL VALIDATION
======================================================= */

function validateRegisterEmail() {
    const input = document.getElementById("registerEmail");

    if (!input) {
        return false;
    }

    const email = input.value.trim();

    if (!email) {
        return setRegisterFieldError(
            "registerEmail",
            "registerEmailError",
            "Please enter your email address."
        );
    }

    if (email.length > 254) {
        return setRegisterFieldError(
            "registerEmail",
            "registerEmailError",
            "Your email address is too long."
        );
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        return setRegisterFieldError(
            "registerEmail",
            "registerEmailError",
            "Please enter a valid email address."
        );
    }

    clearRegisterFieldError(
        "registerEmail",
        "registerEmailError"
    );

    return true;
}


/* =======================================================
   OPTIONAL PHONE VALIDATION
======================================================= */

function validatePhone() {
    const input = document.getElementById("phone");

    if (!input) {
        return true;
    }

    const phone = input.value.trim();

    // Phone number is optional in the current HTML.
    if (!phone) {
        clearRegisterFieldError("phone", "phoneError");
        return true;
    }

    // Allow digits, spaces, +, parentheses, and hyphens.
    if (!/^[+\d\s()-]+$/.test(phone)) {
        return setRegisterFieldError(
            "phone",
            "phoneError",
            "Use only digits, spaces, +, parentheses, or hyphens."
        );
    }

    // Count actual digits, not formatting characters.
    const digits = phone.replace(/\D/g, "");

    if (digits.length < 7 || digits.length > 15) {
        return setRegisterFieldError(
            "phone",
            "phoneError",
            "Enter a phone number containing 7 to 15 digits."
        );
    }

    clearRegisterFieldError("phone", "phoneError");
    return true;
}


/* =======================================================
   PASSWORD VALIDATION
======================================================= */

function validateRegisterPassword() {
    const input = document.getElementById("registerPassword");

    if (!input) {
        return false;
    }

    const password = input.value;

    if (!password) {
        return setRegisterFieldError(
            "registerPassword",
            "passwordError",
            "Please create a password."
        );
    }

    if (password.length < 8) {
        return setRegisterFieldError(
            "registerPassword",
            "passwordError",
            "Your password must contain at least 8 characters."
        );
    }

    if (password.length > 128) {
        return setRegisterFieldError(
            "registerPassword",
            "passwordError",
            "Your password must not exceed 128 characters."
        );
    }

    clearRegisterFieldError(
        "registerPassword",
        "passwordError"
    );

    return true;
}


/* =======================================================
   CONFIRM PASSWORD VALIDATION
======================================================= */

function validateConfirmPassword() {
    const passwordInput = document.getElementById("registerPassword");
    const confirmInput = document.getElementById("confirmPassword");

    if (!passwordInput || !confirmInput) {
        return false;
    }

    const password = passwordInput.value;
    const confirmation = confirmInput.value;

    if (!confirmation) {
        return setRegisterFieldError(
            "confirmPassword",
            "confirmPasswordError",
            "Please confirm your password."
        );
    }

    if (password !== confirmation) {
        return setRegisterFieldError(
            "confirmPassword",
            "confirmPasswordError",
            "The passwords do not match."
        );
    }

    clearRegisterFieldError(
        "confirmPassword",
        "confirmPasswordError"
    );

    return true;
}


/* =======================================================
   ROLE SELECTION
======================================================= */

function initializeRoleSelection() {
    const roleInputs = document.querySelectorAll(
        'input[name="role"]'
    );

    roleInputs.forEach((input) => {
        input.addEventListener("change", () => {
            clearRegisterFieldError(null, "roleError");
            clearRegisterMessage();
        });
    });
}


function validateRole() {
    const selectedRole = document.querySelector(
        'input[name="role"]:checked'
    );

    if (!selectedRole) {
        return setRegisterFieldError(
            null,
            "roleError",
            "Please select how you would like to participate."
        );
    }

    const allowedRoles = [
        "volunteer",
        "elderly",
        "family",
        "special-care"
    ];

    if (!allowedRoles.includes(selectedRole.value)) {
        return setRegisterFieldError(
            null,
            "roleError",
            "Please select a valid participation role."
        );
    }

    clearRegisterFieldError(null, "roleError");
    return true;
}


/* =======================================================
   TERMS ACCEPTANCE
======================================================= */

function initializeTermsValidation() {
    const termsCheckbox = document.getElementById("acceptTerms");

    if (!termsCheckbox) {
        return;
    }

    termsCheckbox.addEventListener("change", () => {
        clearRegisterFieldError(null, "termsError");
        clearRegisterMessage();
    });
}


function validateTerms() {
    const termsCheckbox = document.getElementById("acceptTerms");

    if (!termsCheckbox) {
        return false;
    }

    if (!termsCheckbox.checked) {
        return setRegisterFieldError(
            null,
            "termsError",
            "Please accept the Terms of Service and Privacy Policy."
        );
    }

    clearRegisterFieldError(null, "termsError");
    return true;
}


/* =======================================================
   REGISTRATION FORM SUBMISSION
======================================================= */


function initializeRegisterSubmission() {
    const form = document.getElementById("registerForm");

    if (!form) {
        return;
    }

    const submitButton = document.getElementById("registerSubmitButton");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        clearRegisterMessage();

        const nameValid = validateFullName();
        const emailValid = validateRegisterEmail();
        const phoneValid = validatePhone();
        const passwordValid = validateRegisterPassword();
        const confirmationValid = validateConfirmPassword();
        const roleValid = validateRole();
        const termsValid = validateTerms();

        const formIsValid =
            nameValid &&
            emailValid &&
            phoneValid &&
            passwordValid &&
            confirmationValid &&
            roleValid &&
            termsValid;

        if (!formIsValid) {
            showRegisterMessage(
                "Please correct the highlighted fields before continuing.",
                "error"
            );
            focusFirstInvalidField();
            return;
        }

        const selectedRole = document.querySelector(
            'input[name="role"]:checked'
        );

        const payload = {
            fullName: document.getElementById("fullName").value.trim(),
            email: document.getElementById("registerEmail").value.trim(),
            phone: document.getElementById("phone")?.value.trim() || "",
            password: document.getElementById("registerPassword").value,
            role: selectedRole.value
        };

        const originalButtonText = submitButton
            ? submitButton.textContent
            : "";

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Creating account...";
        }

        try {
            const response = await fetch(
                "http://localhost:5000/api/auth/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(payload)
                }
            );

            const result = await response.json();

            if (!response.ok) {
                showRegisterMessage(
                    result.message || "Registration failed. Please try again.",
                    "error"
                );
                return;
            }

            showRegisterMessage(
                "Your CareCircle account has been created successfully! You can now log in.",
                "success"
            );

            form.reset();

            // Clear any previous field validation errors.
            [
                ["fullName", "fullNameError"],
                ["registerEmail", "registerEmailError"],
                ["phone", "phoneError"],
                ["registerPassword", "passwordError"],
                ["confirmPassword", "confirmPasswordError"]
            ].forEach(([inputId, errorId]) => {
                clearRegisterFieldError(inputId, errorId);
            });

            clearRegisterFieldError(null, "roleError");
            clearRegisterFieldError(null, "termsError");

        } catch (error) {
            console.error("Registration request failed:", error);

            showRegisterMessage(
                "Cannot connect to the CareCircle server. Make sure your backend is running and try again.",
                "error"
            );
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        }
    });
}

/* =======================================================
   FIELD ERROR HELPERS
======================================================= */

function setRegisterFieldError(inputId, errorId, message) {
    if (inputId) {
        const input = document.getElementById(inputId);

        if (input) {
            input.setAttribute("aria-invalid", "true");
        }
    }

    const errorElement = document.getElementById(errorId);

    if (errorElement) {
        errorElement.textContent = message;
    }

    return false;
}


function clearRegisterFieldError(inputId, errorId) {
    if (inputId) {
        const input = document.getElementById(inputId);

        if (input) {
            input.removeAttribute("aria-invalid");
        }
    }

    const errorElement = document.getElementById(errorId);

    if (errorElement) {
        errorElement.textContent = "";
    }
}


/* =======================================================
   STATUS MESSAGE HELPERS
======================================================= */

function showRegisterMessage(message, type = "info") {
    const messageElement = document.getElementById("registerMessage");

    if (!messageElement) {
        return;
    }

    // Use textContent instead of innerHTML for safe text rendering.
    messageElement.textContent = message;

    messageElement.classList.remove(
        "error",
        "success",
        "info"
    );

    messageElement.classList.add(type);
    messageElement.hidden = false;
}


function clearRegisterMessage() {
    const messageElement = document.getElementById("registerMessage");

    if (!messageElement) {
        return;
    }

    messageElement.textContent = "";
    messageElement.classList.remove(
        "error",
        "success",
        "info"
    );

    messageElement.hidden = true;
}


/* =======================================================
   FOCUS FIRST INVALID FIELD
======================================================= */

function focusFirstInvalidField() {
    const firstInvalidInput = document.querySelector(
        "#registerForm [aria-invalid='true']"
    );

    if (firstInvalidInput) {
        firstInvalidInput.focus();
        return;
    }

    const selectedRole = document.querySelector(
        'input[name="role"]:checked'
    );

    const roleError = document.getElementById("roleError");

    if (roleError && roleError.textContent) {
        document.querySelector('input[name="role"]')?.focus();
        return;
    }

    const termsCheckbox = document.getElementById("acceptTerms");

    if (termsCheckbox && !termsCheckbox.checked) {
        termsCheckbox.focus();
    }
}