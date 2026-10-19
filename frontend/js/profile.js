
/* =========================================================
   CareCircle - Profile Page
   File: frontend/js/profile.js

   Features:
   1. Profile form validation
   2. Live profile summary preview
   3. Bio character counter
   4. Role selection preview
   5. Demo notice dismissal
   6. Save and reset form feedback

   Note: This is frontend-only demo functionality.
   Profile changes are not saved to a backend.
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", initializeProfilePage);

function initializeProfilePage() {
    const profileForm = document.getElementById("profileForm");

    if (!profileForm) {
        return;
    }

    // Form fields
    const fullNameInput = document.getElementById("profileFullName");
    const emailInput = document.getElementById("profileEmail");
    const phoneInput = document.getElementById("profilePhone");
    const cityInput = document.getElementById("profileCity");
    const areaInput = document.getElementById("profileArea");
    const bioInput = document.getElementById("profileBio");
    const languagesInput = document.getElementById("profileLanguages");

    const roleInputs = document.querySelectorAll(
        'input[name="profileRole"]'
    );

    const interestInputs = document.querySelectorAll(
        'input[name="interests"]'
    );

    // Profile summary elements
    const avatarElement = document.getElementById("profileAvatar");
    const summaryNameElement = document.getElementById("summaryFullName");
    const summaryRoleElement = document.getElementById("summaryRole");
    const summaryLocationElement = document.getElementById("summaryLocation");

    // Other elements
    const bioCharacterCount = document.getElementById("bioCharacterCount");
    const verificationStatus = document.getElementById("verificationStatus");

    const messageElement = document.getElementById("profileFormMessage");
    const saveButton = document.getElementById("saveProfileButton");
    const resetButton = document.getElementById("resetProfileButton");

    const demoNotice = document.getElementById("profileDemoNotice");
    const dismissNoticeButton = document.getElementById("dismissProfileNotice");

    const currentYearElement = document.getElementById("currentYear");

    // Default demo profile values.
    // These are demonstration values, not authenticated user data.
    const defaultProfile = {
        fullName: "Community Member",
        email: "member@example.com",
        phone: "",
        city: "",
        area: "",
        role: "volunteer",
        bio: "",
        languages: "",
        interests: []
    };

    // ---------------------------------------------------------
    // 1. Initialize the demo form
    // ---------------------------------------------------------

    function initializeDefaultValues() {
        fullNameInput.value = defaultProfile.fullName;
        emailInput.value = defaultProfile.email;
        phoneInput.value = defaultProfile.phone;
        cityInput.value = defaultProfile.city;
        areaInput.value = defaultProfile.area;
        bioInput.value = defaultProfile.bio;
        languagesInput.value = defaultProfile.languages;

        roleInputs.forEach(function (input) {
            input.checked = input.value === defaultProfile.role;
        });

        interestInputs.forEach(function (input) {
            input.checked = defaultProfile.interests.includes(input.value);
        });

        /*
         * Update defaultValue so the browser's native form reset
         * returns to these demo values.
         */
        [
            fullNameInput,
            emailInput,
            phoneInput,
            cityInput,
            areaInput,
            bioInput,
            languagesInput
        ].forEach(function (input) {
            input.defaultValue = input.value;
        });

        roleInputs.forEach(function (input) {
            input.defaultChecked = input.checked;
        });

        interestInputs.forEach(function (input) {
            input.defaultChecked = input.checked;
        });
    }

    // ---------------------------------------------------------
    // 2. Helper functions
    // ---------------------------------------------------------

    function getSelectedRole() {
        const selectedRole = document.querySelector(
            'input[name="profileRole"]:checked'
        );

        return selectedRole ? selectedRole.value : "volunteer";
    }

    function formatRole(role) {
        const roles = {
            volunteer: "Volunteer",
            elderly: "Elderly Member",
            family: "Family Member",
            "special-care": "Special Care"
        };

        return roles[role] || "Community Member";
    }

    function getInitials(name) {
        const cleanedName = name.trim();

        if (!cleanedName) {
            return "CM";
        }

        const words = cleanedName.split(/\s+/);

        if (words.length === 1) {
            return words[0].substring(0, 2).toUpperCase();
        }

        return (
            words[0].charAt(0) +
            words[words.length - 1].charAt(0)
        ).toUpperCase();
    }

    function showMessage(message, type) {
        if (!messageElement) {
            return;
        }

        messageElement.textContent = message;
        messageElement.className = "profile-form-message " + type;
        messageElement.setAttribute("role", "status");
        messageElement.setAttribute("aria-live", "polite");
        messageElement.hidden = false;
    }

    function clearMessage() {
        if (!messageElement) {
            return;
        }

        messageElement.textContent = "";
        messageElement.className = "profile-form-message";
        messageElement.hidden = true;
    }

    function setFieldError(input, errorId, message) {
        const errorElement = document.getElementById(errorId);

        if (input) {
            input.classList.add("invalid");
            input.setAttribute("aria-invalid", "true");
        }

        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    function clearFieldError(input, errorId) {
        const errorElement = document.getElementById(errorId);

        if (input) {
            input.classList.remove("invalid");
            input.setAttribute("aria-invalid", "false");
        }

        if (errorElement) {
            errorElement.textContent = "";
        }
    }

    function clearAllErrors() {
        clearFieldError(fullNameInput, "fullNameError");
        clearFieldError(emailInput, "profileEmailError");
        clearFieldError(phoneInput, "profilePhoneError");
        clearFieldError(cityInput, "profileCityError");

        const roleError = document.getElementById("profileRoleError");

        if (roleError) {
            roleError.textContent = "";
        }

        roleInputs.forEach(function (input) {
            input.removeAttribute("aria-invalid");
        });
    }

    // ---------------------------------------------------------
    // 3. Live profile summary preview
    // ---------------------------------------------------------

    function updateProfilePreview() {
        const fullName = fullNameInput.value.trim();
        const selectedRole = getSelectedRole();
        const city = cityInput.value.trim();
        const area = areaInput.value.trim();

        if (summaryNameElement) {
            summaryNameElement.textContent =
                fullName || "Community Member";
        }

        if (summaryRoleElement) {
            summaryRoleElement.textContent = formatRole(selectedRole);
        }

        if (avatarElement) {
            avatarElement.textContent = getInitials(fullName);
            avatarElement.setAttribute(
                "aria-label",
                "Profile initials: " + getInitials(fullName)
            );
        }

        if (summaryLocationElement) {
            const locationParts = [];

            if (area) {
                locationParts.push(area);
            }

            if (city) {
                locationParts.push(city);
            }

            summaryLocationElement.textContent =
                locationParts.length > 0
                    ? locationParts.join(", ")
                    : "Not specified";
        }

        /*
         * Changing the selected role only changes the profile preview.
         * It does not grant permissions or change verification status.
         */
    }

    // ---------------------------------------------------------
    // 4. Bio character counter
    // ---------------------------------------------------------

    function updateBioCharacterCount() {
        if (!bioInput || !bioCharacterCount) {
            return;
        }

        const currentLength = bioInput.value.length;
        const maximumLength = bioInput.maxLength > 0
            ? bioInput.maxLength
            : 500;

        bioCharacterCount.textContent =
            currentLength + " / " + maximumLength;

        if (currentLength >= maximumLength) {
            bioCharacterCount.classList.add("limit-reached");
        } else {
            bioCharacterCount.classList.remove("limit-reached");
        }
    }

    // ---------------------------------------------------------
    // 5. Validate the profile form
    // ---------------------------------------------------------

    function validateProfileForm() {
        clearAllErrors();

        let isValid = true;

        const fullName = fullNameInput.value.trim();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();
        const city = cityInput.value.trim();

        // Validate full name
        if (fullName.length < 2) {
            setFieldError(
                fullNameInput,
                "fullNameError",
                "Please enter a name containing at least 2 characters."
            );

            isValid = false;
        } else if (fullName.length > 80) {
            setFieldError(
                fullNameInput,
                "fullNameError",
                "Your name cannot exceed 80 characters."
            );

            isValid = false;
        }

        // Validate email
        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            setFieldError(
                emailInput,
                "profileEmailError",
                "Email address is required."
            );

            isValid = false;
        } else if (!emailPattern.test(email)) {
            setFieldError(
                emailInput,
                "profileEmailError",
                "Please enter a valid email address."
            );

            isValid = false;
        }

        // Validate phone number only if provided
        if (phone) {
            const digitsOnly = phone.replace(/\D/g, "");
            const phonePattern = /^[0-9+\-()\s.]+$/;

            if (
                !phonePattern.test(phone) ||
                digitsOnly.length < 7 ||
                digitsOnly.length > 15
            ) {
                setFieldError(
                    phoneInput,
                    "profilePhoneError",
                    "Enter a valid phone number containing 7–15 digits."
                );

                isValid = false;
            }
        }

        // Validate city
        if (city.length > 60) {
            setFieldError(
                cityInput,
                "profileCityError",
                "City cannot exceed 60 characters."
            );

            isValid = false;
        }

        // Validate role selection
        const selectedRole = document.querySelector(
            'input[name="profileRole"]:checked'
        );

        if (!selectedRole) {
            const roleError = document.getElementById("profileRoleError");

            if (roleError) {
                roleError.textContent = "Please select a community role.";
            }

            isValid = false;
        }

        // Validate bio length
        if (bioInput.value.length > 500) {
            showMessage(
                "Your bio cannot exceed 500 characters.",
                "error"
            );

            isValid = false;
        }

        return isValid;
    }

    // ---------------------------------------------------------
    // 6. Clear errors while the user edits fields
    // ---------------------------------------------------------

    function attachErrorClearing(input, errorId) {
        if (!input) {
            return;
        }

        input.addEventListener("input", function () {
            clearFieldError(input, errorId);
            clearMessage();
        });
    }

    attachErrorClearing(fullNameInput, "fullNameError");
    attachErrorClearing(emailInput, "profileEmailError");
    attachErrorClearing(phoneInput, "profilePhoneError");
    attachErrorClearing(cityInput, "profileCityError");

    roleInputs.forEach(function (input) {
        input.addEventListener("change", function () {
            const roleError = document.getElementById("profileRoleError");

            if (roleError) {
                roleError.textContent = "";
            }

            clearMessage();
            updateProfilePreview();
        });
    });

    [fullNameInput, cityInput, areaInput].forEach(function (input) {
        if (input) {
            input.addEventListener("input", updateProfilePreview);
        }
    });

    if (bioInput) {
        bioInput.addEventListener("input", function () {
            updateBioCharacterCount();
            clearMessage();
        });
    }

    // ---------------------------------------------------------
    // 7. Save profile form
    // ---------------------------------------------------------

    profileForm.addEventListener("submit", function (event) {
        event.preventDefault();

        clearMessage();

        if (!validateProfileForm()) {
            showMessage(
                "Please correct the highlighted fields and try again.",
                "error"
            );

            const firstInvalidField = profileForm.querySelector(
                ".invalid"
            );

            if (firstInvalidField) {
                firstInvalidField.focus();
            }

            return;
        }

        updateProfilePreview();

        /*
         * Frontend demonstration only:
         * No API request is sent and no profile is stored permanently.
         */
        const profilePreview = {
            fullName: fullNameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim(),
            city: cityInput.value.trim(),
            area: areaInput.value.trim(),
            role: getSelectedRole(),
            bio: bioInput.value.trim(),
            languages: languagesInput.value.trim(),
            interests: Array.from(interestInputs)
                .filter(function (input) {
                    return input.checked;
                })
                .map(function (input) {
                    return input.value;
                })
        };

        console.log(
            "CareCircle profile preview (demo only):",
            profilePreview
        );

        showMessage(
            "Your profile preview has been updated for this page session. Changes have not been saved to a server.",
            "success"
        );

        if (saveButton) {
            const originalText = saveButton.textContent;

            saveButton.textContent = "Preview Updated";
            saveButton.disabled = true;

            /*
             * Restore the button immediately after showing feedback.
             * No backend save is performed.
             */
            requestAnimationFrame(function () {
                saveButton.textContent = originalText;
                saveButton.disabled = false;
            });
        }
    });

    // ---------------------------------------------------------
    // 8. Reset profile form
    // ---------------------------------------------------------

    profileForm.addEventListener("reset", function () {
        /*
         * The browser resets the controls after this event.
         * requestAnimationFrame lets us refresh the preview afterward.
         */
        requestAnimationFrame(function () {
            clearAllErrors();
            clearMessage();
            updateProfilePreview();
            updateBioCharacterCount();
        });
    });

    if (resetButton) {
        resetButton.addEventListener("click", function () {
            /*
             * The button should have type="reset" in profile.html.
             * The form's reset handler handles the remaining work.
             */
        });
    }

    // ---------------------------------------------------------
    // 9. Dismiss demo notice
    // ---------------------------------------------------------

    if (dismissNoticeButton && demoNotice) {
        dismissNoticeButton.addEventListener("click", function () {
            demoNotice.hidden = true;
        });
    }

    // ---------------------------------------------------------
    // 10. Footer year
    // ---------------------------------------------------------

    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // ---------------------------------------------------------
    // 11. Initial page setup
    // ---------------------------------------------------------

    initializeDefaultValues();
    updateProfilePreview();
    updateBioCharacterCount();
    clearAllErrors();

    if (messageElement) {
        messageElement.hidden = true;
    }

    // Keep the demo verification status unchanged.
    if (verificationStatus) {
        verificationStatus.textContent =
            verificationStatus.textContent.trim() || "Not verified";
    }
}
