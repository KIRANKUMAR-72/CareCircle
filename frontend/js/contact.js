
// =========================================================
// CARECIRCLE — CONTACT PAGE
// File: frontend/js/contact.js
// =========================================================

document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    // -----------------------------------------------------
    // 1. Get HTML elements
    // -----------------------------------------------------

    const contactForm = document.getElementById("contactForm");

    const nameInput = document.getElementById("contactName");
    const emailInput = document.getElementById("contactEmail");
    const subjectInput = document.getElementById("contactSubject");
    const messageInput = document.getElementById("contactMessage");
    const privacyConsent = document.getElementById("contactPrivacyConsent");

    const nameError = document.getElementById("contactNameError");
    const emailError = document.getElementById("contactEmailError");
    const subjectError = document.getElementById("contactSubjectError");
    const messageError = document.getElementById("contactMessageError");
    const consentError = document.getElementById("contactConsentError");

    const characterCount = document.getElementById("contactCharacterCount");
    const formMessage = document.getElementById("contactFormMessage");
    const submitButton = document.getElementById("contactSubmitButton");
    const currentYear = document.getElementById("currentYear");

    // -----------------------------------------------------
    // 2. Update footer year
    // -----------------------------------------------------

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // -----------------------------------------------------
    // 3. Check required elements
    // -----------------------------------------------------

    if (
        !contactForm ||
        !nameInput ||
        !emailInput ||
        !subjectInput ||
        !messageInput ||
        !privacyConsent ||
        !nameError ||
        !emailError ||
        !subjectError ||
        !messageError ||
        !consentError ||
        !characterCount ||
        !formMessage ||
        !submitButton
    ) {
        console.error(
            "CareCircle: Required contact form elements were not found."
        );
        return;
    }

    // -----------------------------------------------------
    // 4. Field error helpers
    // -----------------------------------------------------

    function showFieldError(input, errorElement, message) {
        errorElement.textContent = message;
        input.setAttribute("aria-invalid", "true");
    }

    function clearFieldError(input, errorElement) {
        errorElement.textContent = "";
        input.removeAttribute("aria-invalid");
    }

    function clearConsentError() {
        consentError.textContent = "";
        privacyConsent.removeAttribute("aria-invalid");
    }

    function clearAllFieldErrors() {
        clearFieldError(nameInput, nameError);
        clearFieldError(emailInput, emailError);
        clearFieldError(subjectInput, subjectError);
        clearFieldError(messageInput, messageError);
        clearConsentError();
    }

    // -----------------------------------------------------
    // 5. Form feedback helpers
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
    // 6. Validate full name
    // -----------------------------------------------------

    function validateName() {
        const name = nameInput.value.trim();

        clearFieldError(nameInput, nameError);

        if (!name) {
            showFieldError(
                nameInput,
                nameError,
                "Please enter your full name."
            );
            return false;
        }

        if (name.length < 2) {
            showFieldError(
                nameInput,
                nameError,
                "Your name must contain at least 2 characters."
            );
            return false;
        }

        if (name.length > 80) {
            showFieldError(
                nameInput,
                nameError,
                "Your name cannot exceed 80 characters."
            );
            return false;
        }

        return true;
    }

    // -----------------------------------------------------
    // 7. Validate email address
    // -----------------------------------------------------

    function validateEmail() {
        const email = emailInput.value.trim();

        clearFieldError(emailInput, emailError);

        if (!email) {
            showFieldError(
                emailInput,
                emailError,
                "Please enter your email address."
            );
            return false;
        }

        if (email.length > 254) {
            showFieldError(
                emailInput,
                emailError,
                "Your email address is too long."
            );
            return false;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            showFieldError(
                emailInput,
                emailError,
                "Please enter a valid email address."
            );
            return false;
        }

        return true;
    }

    // -----------------------------------------------------
    // 8. Validate subject
    // -----------------------------------------------------

    function validateSubject() {
        clearFieldError(subjectInput, subjectError);

        if (!subjectInput.value) {
            showFieldError(
                subjectInput,
                subjectError,
                "Please choose a topic for your message."
            );
            return false;
        }

        return true;
    }

    // -----------------------------------------------------
    // 9. Validate message
    // -----------------------------------------------------

    function validateMessage() {
        const message = messageInput.value.trim();

        clearFieldError(messageInput, messageError);

        if (!message) {
            showFieldError(
                messageInput,
                messageError,
                "Please enter your message."
            );
            return false;
        }

        if (message.length < 20) {
            showFieldError(
                messageInput,
                messageError,
                "Please provide at least 20 characters so we can understand your question."
            );
            return false;
        }

        if (message.length > 1500) {
            showFieldError(
                messageInput,
                messageError,
                "Your message cannot exceed 1500 characters."
            );
            return false;
        }

        return true;
    }

    // -----------------------------------------------------
    // 10. Validate privacy consent
    // -----------------------------------------------------

    function validateConsent() {
        clearConsentError();

        if (!privacyConsent.checked) {
            consentError.textContent =
                "Please agree to the Privacy Policy before continuing.";

            privacyConsent.setAttribute("aria-invalid", "true");
            return false;
        }

        return true;
    }

    // -----------------------------------------------------
    // 11. Live message character counter
    // -----------------------------------------------------

    function updateCharacterCount() {
        const length = messageInput.value.length;
        const maximum = Number(messageInput.maxLength) || 1500;

        characterCount.textContent = `${length} / ${maximum}`;

        characterCount.classList.toggle(
            "near-limit",
            length >= maximum * 0.8 && length < maximum
        );

        characterCount.classList.toggle(
            "at-limit",
            length >= maximum
        );
    }

    messageInput.addEventListener("input", () => {
        updateCharacterCount();
        hideFormMessage();

        if (messageInput.hasAttribute("aria-invalid")) {
            validateMessage();
        }
    });

    updateCharacterCount();

    // -----------------------------------------------------
    // 12. Clear individual errors while editing
    // -----------------------------------------------------

    nameInput.addEventListener("input", () => {
        hideFormMessage();

        if (nameInput.hasAttribute("aria-invalid")) {
            validateName();
        }
    });

    emailInput.addEventListener("input", () => {
        hideFormMessage();

        if (emailInput.hasAttribute("aria-invalid")) {
            validateEmail();
        }
    });

    subjectInput.addEventListener("change", () => {
        hideFormMessage();

        if (subjectInput.hasAttribute("aria-invalid")) {
            validateSubject();
        }
    });

    privacyConsent.addEventListener("change", () => {
        hideFormMessage();

        if (privacyConsent.hasAttribute("aria-invalid")) {
            validateConsent();
        }
    });

    // -----------------------------------------------------
    // 13. Validate fields when leaving them
    // -----------------------------------------------------

    nameInput.addEventListener("blur", () => {
        if (nameInput.value.trim()) {
            validateName();
        }
    });

    emailInput.addEventListener("blur", () => {
        if (emailInput.value.trim()) {
            validateEmail();
        }
    });

    messageInput.addEventListener("blur", () => {
        if (messageInput.value.trim()) {
            validateMessage();
        }
    });

    // -----------------------------------------------------
    // 14. Handle form submission
    // -----------------------------------------------------

    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        hideFormMessage();

        const checks = [
            {
                valid: validateName(),
                input: nameInput
            },
            {
                valid: validateEmail(),
                input: emailInput
            },
            {
                valid: validateSubject(),
                input: subjectInput
            },
            {
                valid: validateMessage(),
                input: messageInput
            },
            {
                valid: validateConsent(),
                input: privacyConsent
            }
        ];

        const firstInvalidField = checks.find(
            (check) => !check.valid
        );

        if (firstInvalidField) {
            firstInvalidField.input.focus();

            showFormMessage(
                "Please correct the highlighted fields before submitting the form.",
                "error"
            );

            return;
        }

        // -------------------------------------------------
        // Backend integration will go here.
        //
        // A future implementation should:
        // 1. Send the form data to an Express API endpoint.
        // 2. Validate and sanitize the data on the server.
        // 3. Apply rate limiting and spam protection.
        // 4. Store the message securely or forward it to
        //    the configured support email service.
        // 5. Return an accurate success or failure response.
        //
        // Do not claim a message was sent until the server
        // confirms that it was accepted.
        // -------------------------------------------------

        const contactData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            subject: subjectInput.value,
            message: messageInput.value.trim(),
            privacyConsent: privacyConsent.checked
        };

        // This payload is only for local development.
        // It is not sent or stored.
        console.info(
            "CareCircle contact form validated. Backend is not connected.",
            {
                subject: contactData.subject,
                messageLength: contactData.message.length
            }
        );

        showFormMessage(
            "Your message has passed validation, but it has not been sent. " +
            "The CareCircle contact service needs to be connected to the backend first.",
            "info"
        );

        formMessage.focus();
    });

    // -----------------------------------------------------
    // 15. Reset validation and feedback when the form resets
    // -----------------------------------------------------

    contactForm.addEventListener("reset", () => {
        clearAllFieldErrors();
        hideFormMessage();

        window.setTimeout(() => {
            updateCharacterCount();
        }, 0);
    });

    // -----------------------------------------------------
    // 16. Expose helpers for optional browser testing
    // -----------------------------------------------------

    window.CareCircleContact = {
        validateName,
        validateEmail,
        validateSubject,
        validateMessage,
        validateConsent,
        updateCharacterCount,
        clearAllFieldErrors
    };
});