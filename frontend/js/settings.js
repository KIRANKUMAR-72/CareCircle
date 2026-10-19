
// ============================================================
// CareCircle - Settings Page
// File: frontend/js/settings.js
// Frontend demonstration only - no backend connection
// ============================================================

"use strict";

document.addEventListener("DOMContentLoaded", initializeSettings);

function initializeSettings() {
    // --------------------------------------------------------
    // DOM Elements
    // --------------------------------------------------------

    const settingsDemoNotice = document.getElementById("settingsDemoNotice");
    const dismissSettingsNotice = document.getElementById("dismissSettingsNotice");

    const saveSettingsButton = document.getElementById("saveSettingsButton");
    const resetSettingsButton = document.getElementById("resetSettingsButton");

    const settingsFeedback = document.getElementById("settingsFeedback");
    const accountActionMessage = document.getElementById("accountActionMessage");

    const changePasswordButton = document.getElementById("changePasswordButton");
    const deleteAccountButton = document.getElementById("deleteAccountButton");

    const currentYear = document.getElementById("currentYear");

    // Update the footer year.
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // --------------------------------------------------------
    // Settings Fields
    // --------------------------------------------------------

    const settingFields = [
        "preferredLanguage",
        "timeFormat",
        "profileVisibility",
        "requestNotifications",
        "messageNotifications",
        "creditNotifications",
        "communityNotifications",
        "emailNotifications",
        "showCommunityActivity",
        "showCreditBalance",
        "showOnlineStatus",
        "largerText",
        "highContrast",
        "reduceAnimations"
    ];

    const fields = settingFields
        .map((id) => document.getElementById(id))
        .filter(Boolean);

    // Store the initial state so Reset can restore it.
    const initialSettings = captureSettings();

    // Keep the last state explicitly saved during this page session.
    let savedSettings = captureSettings();

    // --------------------------------------------------------
    // Capture and Restore Settings
    // --------------------------------------------------------

    function captureSettings() {
        const settings = {};

        fields.forEach((field) => {
            if (field.type === "checkbox") {
                settings[field.id] = field.checked;
            } else {
                settings[field.id] = field.value;
            }
        });

        return settings;
    }

    function applySettings(settings) {
        fields.forEach((field) => {
            if (!Object.prototype.hasOwnProperty.call(settings, field.id)) {
                return;
            }

            if (field.type === "checkbox") {
                field.checked = Boolean(settings[field.id]);
            } else {
                field.value = settings[field.id];
            }
        });

        applyAccessibilitySettings();
        updateDirtyState();
    }

    function settingsAreEqual(first, second) {
        return settingFields.every((id) => first[id] === second[id]);
    }

    function updateDirtyState() {
        const currentSettings = captureSettings();
        const hasUnsavedChanges = !settingsAreEqual(
            currentSettings,
            savedSettings
        );

        if (saveSettingsButton) {
            saveSettingsButton.textContent = hasUnsavedChanges
                ? "Save preferences"
                : "Preferences unchanged";

            saveSettingsButton.disabled = !hasUnsavedChanges;
        }

        if (resetSettingsButton) {
            resetSettingsButton.disabled = !hasUnsavedChanges;
        }
    }

    // --------------------------------------------------------
    // Feedback Messages
    // --------------------------------------------------------

    function showSettingsFeedback(message, type = "success") {
        if (!settingsFeedback) {
            return;
        }

        settingsFeedback.textContent = message;
        settingsFeedback.className = "settings-feedback";

        if (type === "error") {
            settingsFeedback.classList.add("error");
        }

        settingsFeedback.hidden = false;
    }

    function clearSettingsFeedback() {
        if (!settingsFeedback) {
            return;
        }

        settingsFeedback.textContent = "";
        settingsFeedback.className = "settings-feedback";
        settingsFeedback.hidden = true;
    }

    function showAccountActionMessage(message) {
        if (!accountActionMessage) {
            return;
        }

        accountActionMessage.textContent = message;
        accountActionMessage.hidden = false;
    }

    function clearAccountActionMessage() {
        if (!accountActionMessage) {
            return;
        }

        accountActionMessage.textContent = "";
        accountActionMessage.hidden = true;
    }

    // --------------------------------------------------------
    // Demonstration Notice
    // --------------------------------------------------------

    if (dismissSettingsNotice && settingsDemoNotice) {
        dismissSettingsNotice.addEventListener("click", () => {
            settingsDemoNotice.hidden = true;
        });
    }

    // --------------------------------------------------------
    // Accessibility Previews
    // --------------------------------------------------------

    function applyAccessibilitySettings() {
        const largerText = document.getElementById("largerText");
        const highContrast = document.getElementById("highContrast");
        const reduceAnimations = document.getElementById("reduceAnimations");

        document.body.classList.toggle(
            "settings-larger-text",
            Boolean(largerText && largerText.checked)
        );

        document.body.classList.toggle(
            "settings-high-contrast",
            Boolean(highContrast && highContrast.checked)
        );

        document.body.classList.toggle(
            "settings-reduce-animations",
            Boolean(reduceAnimations && reduceAnimations.checked)
        );
    }

    // --------------------------------------------------------
    // Settings Change Detection
    // --------------------------------------------------------

    fields.forEach((field) => {
        field.addEventListener("change", () => {
            clearSettingsFeedback();
            clearAccountActionMessage();

            applyAccessibilitySettings();
            updateDirtyState();
        });

        if (field.type !== "checkbox" && field.tagName !== "SELECT") {
            field.addEventListener("input", () => {
                clearSettingsFeedback();
                updateDirtyState();
            });
        }
    });

    // --------------------------------------------------------
    // Save Preferences
    // --------------------------------------------------------

    if (saveSettingsButton) {
        saveSettingsButton.addEventListener("click", () => {
            const currentSettings = captureSettings();

            /*
             * Demonstration behavior:
             * Save the selected values in JavaScript memory only.
             *
             * This does not persist preferences to a database,
             * localStorage, or the user's CareCircle account.
             *
             * Replace this handler with an authenticated backend
             * API request when the server is implemented.
             */

            savedSettings = { ...currentSettings };

            clearAccountActionMessage();
            updateDirtyState();

            showSettingsFeedback(
                "Your preferences have been applied for this page session. " +
                "They have not been saved to your CareCircle account. " +
                "Backend integration is required for permanent storage."
            );

            console.info(
                "CareCircle settings demonstration. Not persisted:",
                savedSettings
            );
        });
    }

    // --------------------------------------------------------
    // Reset Unsaved Changes
    // --------------------------------------------------------

    if (resetSettingsButton) {
        resetSettingsButton.addEventListener("click", () => {
            const hasUnsavedChanges = !settingsAreEqual(
                captureSettings(),
                savedSettings
            );

            if (!hasUnsavedChanges) {
                showSettingsFeedback(
                    "There are no unsaved changes to reset."
                );

                return;
            }

            applySettings(savedSettings);
            clearAccountActionMessage();

            showSettingsFeedback(
                "Unsaved changes have been reset to the last saved " +
                "settings in this page session."
            );
        });
    }

    // --------------------------------------------------------
    // Account Actions - Safe Demonstration Messages
    // --------------------------------------------------------

    if (changePasswordButton) {
        changePasswordButton.addEventListener("click", () => {
            showAccountActionMessage(
                "Password management is not connected yet. A secure " +
                "implementation will require an authenticated backend, " +
                "current-password verification where appropriate, and " +
                "server-side password validation."
            );
        });
    }

    if (deleteAccountButton) {
        deleteAccountButton.addEventListener("click", () => {
            showAccountActionMessage(
                "Account deletion is not available in this demonstration. " +
                "A real deletion workflow must verify your identity, explain " +
                "the consequences, require explicit confirmation, and securely " +
                "process the request on the server."
            );
        });
    }

    // --------------------------------------------------------
    // Settings Sidebar Navigation
    // --------------------------------------------------------

    const settingsNavigationLinks = Array.from(
        document.querySelectorAll(".settings-nav-link")
    );

    const settingsSections = settingsNavigationLinks
        .map((link) => {
            const targetId = link.getAttribute("href");

            if (!targetId || !targetId.startsWith("#")) {
                return null;
            }

            const section = document.querySelector(targetId);

            return section ? { link, section } : null;
        })
        .filter(Boolean);

    function setActiveNavigationLink(activeLink) {
        settingsNavigationLinks.forEach((link) => {
            const isActive = link === activeLink;

            link.classList.toggle("active", isActive);

            if (isActive) {
                link.setAttribute("aria-current", "location");
            } else {
                link.removeAttribute("aria-current");
            }
        });
    }

    settingsNavigationLinks.forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetId = link.getAttribute("href");

            if (!targetId || !targetId.startsWith("#")) {
                return;
            }

            const targetSection = document.querySelector(targetId);

            if (!targetSection) {
                return;
            }

            event.preventDefault();

            setActiveNavigationLink(link);

            targetSection.scrollIntoView({
                behavior: document.body.classList.contains(
                    "settings-reduce-animations"
                )
                    ? "auto"
                    : "smooth",
                block: "start"
            });

            // Keep the URL hash in sync with the selected section.
            if (window.location.hash !== targetId) {
                window.history.replaceState(null, "", targetId);
            }
        });
    });

    // Highlight the settings section currently in view.
    // This listener is lightweight and only runs when the user scrolls.
    let scrollUpdateScheduled = false;

    function updateActiveSectionOnScroll() {
        if (scrollUpdateScheduled || settingsSections.length === 0) {
            return;
        }

        scrollUpdateScheduled = true;

        window.requestAnimationFrame(() => {
            scrollUpdateScheduled = false;

            const activationLine = 145;
            let currentSection = settingsSections[0];

            settingsSections.forEach((item) => {
                if (item.section.getBoundingClientRect().top <= activationLine) {
                    currentSection = item;
                }
            });

            setActiveNavigationLink(currentSection.link);
        });
    }

    window.addEventListener("scroll", updateActiveSectionOnScroll, {
        passive: true
    });

    // --------------------------------------------------------
    // Initialize from an Optional URL Hash
    // --------------------------------------------------------

    if (window.location.hash) {
        const matchingLink = settingsNavigationLinks.find(
            (link) => link.getAttribute("href") === window.location.hash
        );

        if (matchingLink) {
            setActiveNavigationLink(matchingLink);
        }
    }

    // --------------------------------------------------------
    // Initial UI State
    // --------------------------------------------------------

    applyAccessibilitySettings();
    updateDirtyState();

    // Expose a small interface for future development and testing.
    window.CareCircleSettings = {
        getCurrentSettings: captureSettings,

        getSavedSettings: () => ({ ...savedSettings }),

        resetToSavedSettings: () => {
            applySettings(savedSettings);
            clearSettingsFeedback();
            clearAccountActionMessage();
        },

        applyAccessibilitySettings
    };
}