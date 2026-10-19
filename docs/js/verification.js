
/* =========================================================
   CARECIRCLE — ACCOUNT VERIFICATION
   File: frontend/js/verification.js

   Frontend demonstration only.
   Does not upload documents, verify identity, or save data.
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", initializeVerificationPage);

function initializeVerificationPage() {
    const form = document.getElementById("verificationForm");

    if (!form) {
        return;
    }

    // Form fields
    const fullNameInput = document.getElementById("verificationFullName");
    const emailInput = document.getElementById("verificationEmail");
    const roleInput = document.getElementById("verificationRole");
    const cityInput = document.getElementById("verificationCity");

    const documentTypeInput = document.getElementById(
        "verificationDocumentType"
    );

    const referenceInput = document.getElementById(
        "verificationReference"
    );

    const notesInput = document.getElementById("verificationNotes");
    const consentInput = document.getElementById("verificationConsent");

    const verificationTypeInputs = Array.from(
        document.querySelectorAll('input[name="verificationType"]')
    );

    // Form feedback
    const formMessage = document.getElementById(
        "verificationFormMessage"
    );

    const submitButton = document.getElementById(
        "submitVerificationButton"
    );

    const resetButton = document.getElementById(
        "resetVerificationButton"
    );

    // Review panel
    const reviewPanel = document.getElementById(
        "verificationReviewPanel"
    );

    const editReviewButton = document.getElementById(
        "editVerificationButton"
    );

    const finishReviewButton = document.getElementById(
        "finishVerificationReviewButton"
    );

    // Status card
    const statusHeading = document.getElementById(
        "verificationStatusHeading"
    );

    const statusDescription = document.getElementById(
        "verificationStatusDescription"
    );

    const progressBar = document.getElementById(
        "verificationProgressBar"
    );

    const progressLabel = document.getElementById(
        "verificationProgressLabel"
    );

    // General page elements
    const demoNotice = document.getElementById(
        "verificationDemoNotice"
    );

    const dismissNoticeButton = document.getElementById(
        "dismissVerificationNotice"
    );

    const notesCount = document.getElementById(
        "verificationNotesCount"
    );

    const guidanceTitle = document.getElementById(
        "verificationGuidanceTitle"
    );

    const guidanceText = document.getElementById(
        "verificationGuidanceText"
    );

    const verificationSteps = Array.from(
        document.querySelectorAll(".verification-step")
    );

    const yearElement = document.getElementById("currentYear");

    // Review output elements
    const reviewFullName = document.getElementById("reviewFullName");
    const reviewEmail = document.getElementById("reviewEmail");
    const reviewRole = document.getElementById("reviewRole");
    const reviewType = document.getElementById("reviewType");
    const reviewDocument = document.getElementById("reviewDocument");

    let formWasReviewed = false;

    const roleLabels = {
        volunteer: "Volunteer",
        elderly: "Elderly member",
        family: "Family member / caregiver",
        "special-care": "Special Care member"
    };

    const verificationTypeLabels = {
        identity: "Identity verification",
        age: "Age verification",
        care: "Special Care eligibility",
        caregiver: "Family / caregiver relationship"
    };

    const documentTypeLabels = {
        "government-id": "Government-issued identity document",
        "age-proof": "Age or date-of-birth proof",
        "care-document": "Supporting care documentation",
        "relationship-proof": "Relationship or caregiver proof",
        other: "Other supporting document"
    };

    const verificationGuidance = {
        identity: {
            title: "Identity verification",
            text:
                "In a real verification process, you may be asked to provide " +
                "an accepted identity document through a secure upload system. " +
                "Do not enter document numbers in this demo."
        },

        age: {
            title: "Age verification",
            text:
                "This option is intended for members seeking age-based " +
                "eligibility. An authorized reviewer would need to check " +
                "appropriate age evidence before making an eligibility decision."
        },

        care: {
            title: "Special Care eligibility",
            text:
                "Special Care eligibility may require an appropriate supporting " +
                "document and a respectful review. Only authorized reviewers " +
                "should access sensitive supporting information."
        },

        caregiver: {
            title: "Family / caregiver relationship",
            text:
                "A production workflow may ask for appropriate evidence of " +
                "the caregiving relationship. The member's consent, privacy, " +
                "and independence should be respected."
        }
    };

    // -----------------------------------------------------
    // 1. Footer year
    // -----------------------------------------------------

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // -----------------------------------------------------
    // 2. Dismiss demonstration notice
    // -----------------------------------------------------

    if (dismissNoticeButton && demoNotice) {
        dismissNoticeButton.addEventListener("click", function () {
            demoNotice.hidden = true;
        });
    }

    // -----------------------------------------------------
    // 3. Helpers
    // -----------------------------------------------------

    function getElement(id) {
        return document.getElementById(id);
    }

    function setError(input, errorId, message) {
        const errorElement = getElement(errorId);

        if (errorElement) {
            errorElement.textContent = message || "";
        }

        if (input) {
            input.setAttribute(
                "aria-invalid",
                message ? "true" : "false"
            );
        }

        return !message;
    }

    function clearFieldError(input, errorId) {
        setError(input, errorId, "");
    }

    function clearAllErrors() {
        const errorIds = [
            "verificationNameError",
            "verificationEmailError",
            "verificationRoleError",
            "verificationCityError",
            "verificationTypeError",
            "verificationDocumentError",
            "verificationConsentError"
        ];

        errorIds.forEach(function (id) {
            const element = getElement(id);

            if (element) {
                element.textContent = "";
            }
        });

        const inputs = [
            fullNameInput,
            emailInput,
            roleInput,
            cityInput,
            documentTypeInput,
            consentInput,
            notesInput,
            referenceInput
        ];

        inputs.forEach(function (input) {
            if (input) {
                input.setAttribute("aria-invalid", "false");
            }
        });

        verificationTypeInputs.forEach(function (input) {
            input.setAttribute("aria-invalid", "false");
        });
    }

    function showMessage(message, type) {
        if (!formMessage) {
            return;
        }

        formMessage.textContent = message;
        formMessage.className = "verification-form-message";

        if (type) {
            formMessage.classList.add(type);
        }

        formMessage.hidden = false;
    }

    function hideMessage() {
        if (!formMessage) {
            return;
        }

        formMessage.textContent = "";
        formMessage.className = "verification-form-message";
        formMessage.hidden = true;
    }

    function normalizeText(value) {
        return String(value || "").trim().replace(/\s+/g, " ");
    }

    function getSelectedVerificationType() {
        const selected = verificationTypeInputs.find(function (input) {
            return input.checked;
        });

        return selected ? selected.value : "";
    }

    function getSelectedVerificationTypeInput() {
        return verificationTypeInputs.find(function (input) {
            return input.checked;
        }) || null;
    }

    function getVerificationTypeLabel(value) {
        return verificationTypeLabels[value] || "Not selected";
    }

    function getRoleLabel(value) {
        return roleLabels[value] || "Not selected";
    }

    function getDocumentTypeLabel(value) {
        return documentTypeLabels[value] || "Not selected";
    }

    function scrollToElement(element) {
        if (!element) {
            return;
        }

        element.scrollIntoView({
            behavior: window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            ).matches ? "auto" : "smooth",
            block: "center"
        });
    }

    // -----------------------------------------------------
    // 4. Verification type guidance
    // -----------------------------------------------------

    function updateVerificationGuidance() {
        const selectedType = getSelectedVerificationType();
        const guidance = verificationGuidance[selectedType];

        if (guidanceTitle) {
            guidanceTitle.textContent = guidance
                ? guidance.title
                : "Choose a verification type";
        }

        if (guidanceText) {
            guidanceText.textContent = guidance
                ? guidance.text
                : "Guidance about the information required will appear here.";
        }

        updateProgress();
    }

    verificationTypeInputs.forEach(function (input) {
        input.addEventListener("change", function () {
            clearFieldError(null, "verificationTypeError");
            verificationTypeInputs.forEach(function (radio) {
                radio.setAttribute("aria-invalid", "false");
            });

            updateVerificationGuidance();
            hideMessage();
        });
    });

    // -----------------------------------------------------
    // 5. Role and verification-type compatibility
    // -----------------------------------------------------

    function validateRoleAndType(showErrors) {
        const role = roleInput.value;
        const type = getSelectedVerificationType();

        let valid = true;

        if (role === "elderly" && type === "caregiver") {
            valid = false;

            if (showErrors) {
                setError(
                    null,
                    "verificationTypeError",
                    "Caregiver relationship verification is intended for " +
                    "family members or caregivers. Choose a suitable " +
                    "verification type for your own account."
                );
            }
        } else if (role === "family" && type === "age") {
            valid = false;

            if (showErrors) {
                setError(
                    null,
                    "verificationTypeError",
                    "Age verification is intended for members seeking " +
                    "age-based eligibility. Choose the option relevant " +
                    "to your account."
                );
            }
        } else if (
            role === "family" &&
            type === "care"
        ) {
            valid = false;

            if (showErrors) {
                setError(
                    null,
                    "verificationTypeError",
                    "Special Care eligibility is intended for the member " +
                    "requesting that support. A caregiver can instead " +
                    "choose relationship verification where appropriate."
                );
            }
        } else if (
            role === "volunteer" &&
            (type === "age" || type === "care")
        ) {
            valid = false;

            if (showErrors) {
                setError(
                    null,
                    "verificationTypeError",
                    "The selected verification type is intended for a " +
                    "different eligibility category. Choose a type " +
                    "appropriate to your account."
                );
            }
        } else {
            if (showErrors) {
                setError(null, "verificationTypeError", "");
            }
        }

        return valid;
    }

    // -----------------------------------------------------
    // 6. Progress indicator
    // -----------------------------------------------------

    function updateProgress() {
        const nameComplete = normalizeText(fullNameInput.value).length >= 2;
        const emailComplete = normalizeText(emailInput.value).length > 0;
        const roleComplete = Boolean(roleInput.value);
        const cityComplete = normalizeText(cityInput.value).length > 0;

        const personalDetailsComplete =
            nameComplete &&
            emailComplete &&
            roleComplete &&
            cityComplete;

        const typeComplete = Boolean(getSelectedVerificationType());

        const documentComplete = Boolean(documentTypeInput.value);
        const consentComplete = Boolean(consentInput.checked);

        const reviewComplete = formWasReviewed;

        const completedSteps = [
            personalDetailsComplete,
            typeComplete,
            documentComplete && consentComplete && reviewComplete
        ].filter(Boolean).length;

        if (progressBar) {
            progressBar.style.width =
                Math.round((completedSteps / 3) * 100) + "%";
        }

        if (progressLabel) {
            progressLabel.textContent =
                completedSteps + " of 3 steps completed";
        }

        verificationSteps.forEach(function (step, index) {
            const stepNumber = index + 1;
            const isCompleted = stepNumber <= completedSteps;

            step.classList.toggle("completed", isCompleted);
            step.classList.toggle(
                "active",
                !isCompleted && stepNumber === completedSteps + 1
            );

            if (isCompleted) {
                step.setAttribute("aria-label", "Step " + stepNumber + " completed");
            } else {
                step.removeAttribute("aria-label");
            }
        });

        // This status describes only local form progress.
        // It never represents actual account verification.
        if (statusHeading && statusDescription) {
            if (formWasReviewed) {
                statusHeading.textContent = "Ready for Review";
                statusDescription.textContent =
                    "Your form passed local checks. No documents were " +
                    "uploaded and your account has not been verified.";
            } else if (personalDetailsComplete && typeComplete) {
                statusHeading.textContent = "In Progress";
                statusDescription.textContent =
                    "Your form is being completed. Review all required " +
                    "details before continuing.";
            } else {
                statusHeading.textContent = "Not Verified";
                statusDescription.textContent =
                    "Complete the form to prepare your information for review.";
            }
        }
    }

    // -----------------------------------------------------
    // 7. Field validation
    // -----------------------------------------------------

    function validateFullName() {
        const value = normalizeText(fullNameInput.value);

        if (!value) {
            return setError(
                fullNameInput,
                "verificationNameError",
                "Please enter your full name."
            );
        }

        if (value.length < 2) {
            return setError(
                fullNameInput,
                "verificationNameError",
                "Your name must contain at least 2 characters."
            );
        }

        if (value.length > 80) {
            return setError(
                fullNameInput,
                "verificationNameError",
                "Your name cannot exceed 80 characters."
            );
        }

        return setError(fullNameInput, "verificationNameError", "");
    }

    function validateEmail() {
        const value = normalizeText(emailInput.value);

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        if (!value) {
            return setError(
                emailInput,
                "verificationEmailError",
                "Please enter your email address."
            );
        }

        if (value.length > 254 || !emailPattern.test(value)) {
            return setError(
                emailInput,
                "verificationEmailError",
                "Please enter a valid email address."
            );
        }

        return setError(emailInput, "verificationEmailError", "");
    }

    function validateRole() {
        if (!roleInput.value) {
            return setError(
                roleInput,
                "verificationRoleError",
                "Please select your community role."
            );
        }

        return setError(roleInput, "verificationRoleError", "");
    }

    function validateCity() {
        const value = normalizeText(cityInput.value);

        if (!value) {
            return setError(
                cityInput,
                "verificationCityError",
                "Please enter your city."
            );
        }

        if (value.length > 60) {
            return setError(
                cityInput,
                "verificationCityError",
                "City name cannot exceed 60 characters."
            );
        }

        return setError(cityInput, "verificationCityError", "");
    }

    function validateVerificationType() {
        const selectedType = getSelectedVerificationType();
        const selectedInput = getSelectedVerificationTypeInput();

        if (!selectedType) {
            setError(
                null,
                "verificationTypeError",
                "Please select a verification type."
            );

            verificationTypeInputs.forEach(function (input) {
                input.setAttribute("aria-invalid", "true");
            });

            return false;
        }

        verificationTypeInputs.forEach(function (input) {
            input.setAttribute("aria-invalid", "false");
        });

        if (!validateRoleAndType(true)) {
            verificationTypeInputs.forEach(function (input) {
                input.setAttribute("aria-invalid", "true");
            });

            return false;
        }

        setError(null, "verificationTypeError", "");

        if (selectedInput) {
            selectedInput.setAttribute("aria-invalid", "false");
        }

        return true;
    }

    function validateDocumentType() {
        if (!documentTypeInput.value) {
            return setError(
                documentTypeInput,
                "verificationDocumentError",
                "Please select a supporting document type."
            );
        }

        return setError(
            documentTypeInput,
            "verificationDocumentError",
            ""
        );
    }

    function validateConsent() {
        if (!consentInput.checked) {
            return setError(
                consentInput,
                "verificationConsentError",
                "Please confirm the demonstration consent statement."
            );
        }

        return setError(consentInput, "verificationConsentError", "");
    }

    function validateForm() {
        const results = [
            validateFullName(),
            validateEmail(),
            validateRole(),
            validateCity(),
            validateVerificationType(),
            validateDocumentType(),
            validateConsent()
        ];

        return results.every(Boolean);
    }

    // -----------------------------------------------------
    // 8. Live validation and field feedback
    // -----------------------------------------------------

    fullNameInput.addEventListener("input", function () {
        if (fullNameInput.getAttribute("aria-invalid") === "true") {
            validateFullName();
        }

        formWasReviewed = false;
        updateProgress();
        hideMessage();
    });

    fullNameInput.addEventListener("blur", validateFullName);

    emailInput.addEventListener("input", function () {
        if (emailInput.getAttribute("aria-invalid") === "true") {
            validateEmail();
        }

        formWasReviewed = false;
        updateProgress();
        hideMessage();
    });

    emailInput.addEventListener("blur", validateEmail);

    roleInput.addEventListener("change", function () {
        validateRole();
        validateRoleAndType(false);

        if (getSelectedVerificationType()) {
            validateVerificationType();
        }

        formWasReviewed = false;
        updateProgress();
        hideMessage();
    });

    cityInput.addEventListener("input", function () {
        if (cityInput.getAttribute("aria-invalid") === "true") {
            validateCity();
        }

        formWasReviewed = false;
        updateProgress();
        hideMessage();
    });

    cityInput.addEventListener("blur", validateCity);

    documentTypeInput.addEventListener("change", function () {
        validateDocumentType();
        formWasReviewed = false;
        updateProgress();
        hideMessage();
    });

    consentInput.addEventListener("change", function () {
        validateConsent();
        formWasReviewed = false;
        updateProgress();
        hideMessage();
    });

    referenceInput.addEventListener("input", function () {
        if (referenceInput.value.length > 80) {
            referenceInput.value = referenceInput.value.slice(0, 80);
        }

        formWasReviewed = false;
        updateProgress();
        hideMessage();
    });

    notesInput.addEventListener("input", function () {
        if (notesInput.value.length > 500) {
            notesInput.value = notesInput.value.slice(0, 500);
        }

        if (notesCount) {
            notesCount.textContent = notesInput.value.length;
        }

        formWasReviewed = false;
        updateProgress();
        hideMessage();
    });

    // -----------------------------------------------------
    // 9. Review panel
    // -----------------------------------------------------

    function populateReviewPanel() {
        reviewFullName.textContent =
            normalizeText(fullNameInput.value);

        reviewEmail.textContent =
            normalizeText(emailInput.value);

        reviewRole.textContent =
            getRoleLabel(roleInput.value);

        reviewType.textContent =
            getVerificationTypeLabel(getSelectedVerificationType());

        reviewDocument.textContent =
            getDocumentTypeLabel(documentTypeInput.value);
    }

    function openReviewPanel() {
        populateReviewPanel();

        if (reviewPanel) {
            reviewPanel.hidden = false;
        }

        formWasReviewed = true;
        updateProgress();

        if (reviewPanel) {
            scrollToElement(reviewPanel);
        }
    }

    function closeReviewPanel() {
        if (reviewPanel) {
            reviewPanel.hidden = true;
        }

        scrollToElement(form);
    }

    if (editReviewButton) {
        editReviewButton.addEventListener("click", function () {
            closeReviewPanel();
            hideMessage();
            fullNameInput.focus();
        });
    }

    if (finishReviewButton) {
        finishReviewButton.addEventListener("click", function () {
            closeReviewPanel();

            showMessage(
                "Review finished. This was only a local preview; " +
                "nothing has been uploaded, saved, or submitted.",
                "warning"
            );
        });
    }

    // -----------------------------------------------------
    // 10. Form submission
    // -----------------------------------------------------

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        hideMessage();

        if (!validateForm()) {
            formWasReviewed = false;
            updateProgress();

            showMessage(
                "Please correct the highlighted fields before reviewing " +
                "your information.",
                "error"
            );

            const firstInvalidField = form.querySelector(
                '[aria-invalid="true"]'
            );

            if (firstInvalidField) {
                scrollToElement(firstInvalidField);
                firstInvalidField.focus({ preventScroll: true });
            }

            return;
        }

        // Important:
        // This does not send a request to an API.
        // It only displays a local preview of the entered values.

        openReviewPanel();

        showMessage(
            "Your information passed the browser checks. Review the " +
            "summary below. This demonstration does not submit your " +
            "information to CareCircle.",
            "warning"
        );
    });

    // -----------------------------------------------------
    // 11. Reset form
    // -----------------------------------------------------

    form.addEventListener("reset", function () {
        // Wait for the browser to reset input values first.
        window.setTimeout(function () {
            clearAllErrors();
            hideMessage();

            if (reviewPanel) {
                reviewPanel.hidden = true;
            }

            formWasReviewed = false;

            if (notesCount) {
                notesCount.textContent = "0";
            }

            if (guidanceTitle) {
                guidanceTitle.textContent = "Choose a verification type";
            }

            if (guidanceText) {
                guidanceText.textContent =
                    "Guidance about the information required will appear here.";
            }

            updateProgress();
        }, 0);
    });

    if (resetButton) {
        resetButton.addEventListener("click", function () {
            // The form's reset event handles the remaining cleanup.
            // Hide any existing review panel immediately.
            if (reviewPanel) {
                reviewPanel.hidden = true;
            }
        });
    }

    // -----------------------------------------------------
    // 12. FAQ accordion
    // -----------------------------------------------------

    const faqButtons = Array.from(
        document.querySelectorAll(".verification-faq-question")
    );

    faqButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const answer = button.nextElementSibling;

            if (!answer || !answer.classList.contains("verification-faq-answer")) {
                return;
            }

            const isExpanded =
                button.getAttribute("aria-expanded") === "true";

            button.setAttribute(
                "aria-expanded",
                String(!isExpanded)
            );

            answer.hidden = isExpanded;
        });
    });

    // -----------------------------------------------------
    // 13. Initial page state
    // -----------------------------------------------------

    clearAllErrors();

    if (notesCount) {
        notesCount.textContent = notesInput.value.length;
    }

    if (reviewPanel) {
        reviewPanel.hidden = true;
    }

    updateVerificationGuidance();
    updateProgress();
}
