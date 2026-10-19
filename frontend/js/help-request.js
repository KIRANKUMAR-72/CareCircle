/* =========================================================
   CareCircle — Help Request Form
   File: frontend/js/help-request.js

   Features:
   1. Validate required form fields
   2. Validate category selection
   3. Validate request title and description
   4. Validate preferred date and time
   5. Update description character counter
   6. Display accessible form feedback
   7. Prepare a clean request payload
   8. Submit to the backend when API integration is ready

   IMPORTANT:
   This frontend does not save requests to MongoDB by itself.
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    initializeHelpRequestForm();

    console.log("CareCircle Help Request page initialized.");
});

/**
 * Initialize the help request form.
 */
function initializeHelpRequestForm() {
    const form = document.getElementById("helpRequestForm");

    if (!form) {
        return;
    }

    initializeDescriptionCounter();
    initializeCategorySelection();
    initializeDateRestrictions(form);
    initializeLiveValidation(form);

    form.addEventListener("submit", handleHelpRequestSubmit);
}

/**
 * Keep the description character counter updated.
 */
function initializeDescriptionCounter() {
    const description = document.getElementById("requestDescription");
    const counter = document.getElementById("descriptionCounter");

    if (!description || !counter) {
        return;
    }

    const updateCounter = () => {
        counter.textContent =
            `${description.value.length} / ${description.maxLength}`;
    };

    description.addEventListener("input", updateCounter);
    updateCounter();
}

/**
 * Add a visual class to the selected service category.
 */
function initializeCategorySelection() {
    const categoryInputs = document.querySelectorAll(
        'input[name="category"]'
    );

    categoryInputs.forEach((input) => {
        input.addEventListener("change", () => {
            updateCategorySelection();
            clearFieldError("categoryError");
        });
    });

    updateCategorySelection();
}

function updateCategorySelection() {
    const categoryOptions = document.querySelectorAll(
        ".request-category-option"
    );

    categoryOptions.forEach((option) => {
        const input = option.querySelector('input[name="category"]');

        if (!input) {
            return;
        }

        option.classList.toggle("selected", input.checked);
    });
}

/**
 * Prevent selecting a date before today.
 *
 * The browser's local date is used rather than UTC to avoid
 * date discrepancies for users in different time zones.
 */
function initializeDateRestrictions(form) {
    const dateInput = form.querySelector("#preferredDate");

    if (!dateInput) {
        return;
    }

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    dateInput.min = `${year}-${month}-${day}`;
}

/**
 * Clear field errors as users correct their input.
 */
function initializeLiveValidation(form) {
    const fields = [
        ["#requestTitle", "titleError"],
        ["#requestDescription", "descriptionError"],
        ["#preferredDate", "dateError"],
        ["#preferredTime", "timeError"],
        ["#city", "cityError"]
    ];

    fields.forEach(([selector, errorId]) => {
        const field = form.querySelector(selector);

        if (!field) {
            return;
        }

        field.addEventListener("input", () => {
            clearFieldError(errorId);
            clearFormMessage();
        });

        field.addEventListener("change", () => {
            clearFieldError(errorId);
            clearFormMessage();
        });
    });
}

/**
 * Handle form submission.
 */
function handleHelpRequestSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;

    clearAllFieldErrors();
    clearFormMessage();

    const validation = validateHelpRequestForm(form);

    if (!validation.isValid) {
        showFormMessage(
            "Please correct the highlighted fields before continuing.",
            "error"
        );

        if (validation.firstInvalidField) {
            validation.firstInvalidField.focus();
            validation.firstInvalidField.scrollIntoView({
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches ? "auto" : "smooth",
                block: "center"
            });
        }

        return;
    }

    const requestData = buildHelpRequestPayload(form);

    /*
     * Backend integration will be added after the API is created.
     *
     * Do not display a success message here because the request
     * has not yet been saved or confirmed by the server.
     */
    showFormMessage(
        "Your details are valid. The request form is ready, but submitting it to CareCircle is not available yet because the backend API has not been connected. Your request has not been saved.",
        "info"
    );

    console.log("Validated help request payload:", requestData);
}

/**
 * Validate all required form fields.
 */
function validateHelpRequestForm(form) {
    let isValid = true;
    let firstInvalidField = null;

    const markInvalid = (field, errorId, message) => {
        showFieldError(field, errorId, message);

        if (!firstInvalidField) {
            firstInvalidField = field;
        }

        isValid = false;
    };

    // Category
    const selectedCategory = form.querySelector(
        'input[name="category"]:checked'
    );

    if (!selectedCategory) {
        showCategoryError("Please select a help category.");

        if (!firstInvalidField) {
            firstInvalidField = form.querySelector(
                'input[name="category"]'
            );
        }

        isValid = false;
    }

    // Title
    const title = form.querySelector("#requestTitle");

    if (title) {
        const titleValue = title.value.trim();

        if (titleValue.length < 5) {
            markInvalid(
                title,
                "titleError",
                "Please enter a title with at least 5 characters."
            );
        } else if (titleValue.length > 100) {
            markInvalid(
                title,
                "titleError",
                "The title must not exceed 100 characters."
            );
        }
    }

    // Description
    const description = form.querySelector("#requestDescription");

    if (description) {
        const descriptionValue = description.value.trim();

        if (descriptionValue.length < 20) {
            markInvalid(
                description,
                "descriptionError",
                "Please describe your request in at least 20 characters."
            );
        } else if (descriptionValue.length > 1500) {
            markInvalid(
                description,
                "descriptionError",
                "The description must not exceed 1500 characters."
            );
        }
    }

    // Preferred date
    const date = form.querySelector("#preferredDate");

    if (date) {
        if (!date.value) {
            markInvalid(
                date,
                "dateError",
                "Please select your preferred date."
            );
        } else if (!isValidDate(date.value)) {
            markInvalid(
                date,
                "dateError",
                "Please select a valid date that is today or later."
            );
        }
    }

    // Preferred time
    const time = form.querySelector("#preferredTime");

    if (time) {
        if (!time.value) {
            markInvalid(
                time,
                "timeError",
                "Please select your preferred time."
            );
        } else if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(time.value)) {
            markInvalid(
                time,
                "timeError",
                "Please select a valid time."
            );
        }
    }

    // City or locality
    const city = form.querySelector("#city");

    if (city) {
        const cityValue = city.value.trim();

        if (cityValue.length < 2) {
            markInvalid(
                city,
                "cityError",
                "Please enter a valid city or locality."
            );
        } else if (cityValue.length > 100) {
            markInvalid(
                city,
                "cityError",
                "The city or locality must not exceed 100 characters."
            );
        }
    }

    return {
        isValid,
        firstInvalidField
    };
}

/**
 * Check a date in YYYY-MM-DD format without relying on UTC parsing.
 */
function isValidDate(dateValue) {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateValue);

    if (!match) {
        return false;
    }

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);

    const chosenDate = new Date(year, month - 1, day);

    // Reject impossible dates such as February 31.
    if (
        chosenDate.getFullYear() !== year ||
        chosenDate.getMonth() !== month - 1 ||
        chosenDate.getDate() !== day
    ) {
        return false;
    }

    const now = new Date();
    const today = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
    );

    return chosenDate >= today;
}

/**
 * Build the request object that will eventually be sent to the API.
 */
function buildHelpRequestPayload(form) {
    const formData = new FormData(form);

    return {
        category: String(formData.get("category") || "").trim(),
        title: String(formData.get("title") || "").trim(),
        description: String(formData.get("description") || "").trim(),
        preferredDate: String(
            formData.get("preferredDate") || ""
        ).trim(),
        preferredTime: String(
            formData.get("preferredTime") || ""
        ).trim(),
        city: String(formData.get("city") || "").trim(),
        locationDetails: String(
            formData.get("locationDetails") || ""
        ).trim(),
        preferences: String(
            formData.get("preferences") || ""
        ).trim(),
        flexibleSchedule: formData.get("flexibleSchedule") === "true"
    };
}

/**
 * Display a field-specific validation message.
 */
function showFieldError(field, errorId, message) {
    if (!field) {
        return;
    }

    field.setAttribute("aria-invalid", "true");

    const errorElement = document.getElementById(errorId);

    if (errorElement) {
        errorElement.textContent = message;
    }
}

/**
 * Display a category-selection error.
 */
function showCategoryError(message) {
    const errorElement = document.getElementById("categoryError");

    if (errorElement) {
        errorElement.textContent = message;
    }

    const categoryInputs = document.querySelectorAll(
        'input[name="category"]'
    );

    categoryInputs.forEach((input) => {
        input.setAttribute("aria-invalid", "true");
    });
}

/**
 * Clear one field error.
 */
function clearFieldError(errorId) {
    const errorElement = document.getElementById(errorId);

    if (errorElement) {
        errorElement.textContent = "";
    }

    const fieldMap = {
        titleError: "#requestTitle",
        descriptionError: "#requestDescription",
        dateError: "#preferredDate",
        timeError: "#preferredTime",
        cityError: "#city"
    };

    const selector = fieldMap[errorId];

    if (selector) {
        const field = document.querySelector(selector);

        if (field) {
            field.removeAttribute("aria-invalid");
        }
    }

    if (errorId === "categoryError") {
        document.querySelectorAll(
            'input[name="category"]'
        ).forEach((input) => {
            input.removeAttribute("aria-invalid");
        });
    }
}

/**
 * Clear all validation messages.
 */
function clearAllFieldErrors() {
    [
        "categoryError",
        "titleError",
        "descriptionError",
        "dateError",
        "timeError",
        "cityError"
    ].forEach(clearFieldError);
}

/**
 * Show a general form message.
 *
 * Supported types: success, error, info.
 * A success message should only be used after server confirmation.
 */
function showFormMessage(message, type = "info") {
    const messageElement = document.getElementById(
        "requestFormMessage"
    );

    if (!messageElement) {
        return;
    }

    messageElement.textContent = message;
    messageElement.className = `request-form-message ${type}`;
    messageElement.hidden = false;
}

/**
 * Hide the general feedback message.
 */
function clearFormMessage() {
    const messageElement = document.getElementById(
        "requestFormMessage"
    );

    if (!messageElement) {
        return;
    }

    messageElement.textContent = "";
    messageElement.className = "request-form-message";
    messageElement.hidden = true;
}