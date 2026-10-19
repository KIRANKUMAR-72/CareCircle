
// =========================================================
// CARECIRCLE — REQUEST DETAILS PAGE
// File: frontend/js/request-details.js
// =========================================================

"use strict";

document.addEventListener("DOMContentLoaded", initializeRequestDetails);

// ---------------------------------------------------------
// 1. DEMO REQUEST DATA
// ---------------------------------------------------------
// These are fictional examples for front-end development.
// Replace this data with backend API responses later.

const requestDetailsData = {
    "demo-001": {
        id: "demo-001",
        title: "Grocery Shopping Assistance",
        category: "Groceries",
        description:
            "An elderly community member needs help collecting essential groceries from a nearby store. The shopping list will be shared after the arrangements are confirmed. A patient and friendly volunteer would be greatly appreciated.",
        location: "Community area",
        postedDate: "2026-10-10",
        preferredDate: "Flexible",
        preferredTime: "Morning",
        priority: "Normal",
        status: "open",
        preferences:
            "Please coordinate the shopping list and timing in advance. Kindly keep receipts for any purchases made on the requester's behalf.",
        requesterName: "Community Member",
        requesterRole: "Elderly community member",
        requesterInitials: "CM",
        verification: "Demo profile — not verified"
    },

    "demo-002": {
        id: "demo-002",
        title: "Medicine Pickup Assistance",
        category: "Medicine",
        description:
            "A community member needs help collecting prescribed medicines from a local pharmacy. The volunteer should confirm the collection arrangements in advance and follow the pharmacy's applicable procedures.",
        location: "Community area",
        postedDate: "2026-10-09",
        preferredDate: "2026-10-12",
        preferredTime: "Afternoon",
        priority: "Urgent",
        status: "open",
        preferences:
            "Please confirm the collection time beforehand. Volunteers must not provide medical advice or change prescribed medication.",
        requesterName: "Community Member",
        requesterRole: "Community member",
        requesterInitials: "CM",
        verification: "Demo profile — not verified"
    },

    "demo-003": {
        id: "demo-003",
        title: "Friendly Walk and Conversation",
        category: "Companionship",
        description:
            "A senior community member would enjoy a friendly walk in a familiar public area and some conversation. A volunteer who is patient, respectful and comfortable walking at a relaxed pace would be welcome.",
        location: "Nearby public area",
        postedDate: "2026-10-08",
        preferredDate: "Flexible",
        preferredTime: "Evening",
        priority: "Flexible",
        status: "open",
        preferences:
            "Please agree on a suitable public meeting place and a comfortable walking pace before the visit.",
        requesterName: "Community Member",
        requesterRole: "Elderly community member",
        requesterInitials: "CM",
        verification: "Demo profile — not verified"
    },

    "demo-004": {
        id: "demo-004",
        title: "Smartphone Guidance",
        category: "Digital Guidance",
        description:
            "A community member would appreciate help learning basic smartphone features, including adjusting settings, managing contacts and using common applications.",
        location: "Community area",
        postedDate: "2026-10-07",
        preferredDate: "2026-10-13",
        preferredTime: "Morning",
        priority: "Normal",
        status: "open",
        preferences:
            "Please explain each step patiently. The requester should enter their own passwords and PINs and keep sensitive information private.",
        requesterName: "Community Member",
        requesterRole: "Community member",
        requesterInitials: "CM",
        verification: "Demo profile — not verified"
    },

    "demo-005": {
        id: "demo-005",
        title: "Hospital Visit Assistance",
        category: "Hospital Assistance",
        description:
            "A community member needs non-medical assistance getting to a hospital appointment and finding the appropriate department. Help with navigation and general coordination would be appreciated.",
        location: "Hospital vicinity",
        postedDate: "2026-10-06",
        preferredDate: "2026-10-14",
        preferredTime: "Morning",
        priority: "Urgent",
        status: "open",
        preferences:
            "Confirm the meeting point and transport arrangements in advance. This request is for non-medical assistance only.",
        requesterName: "Community Member",
        requesterRole: "Community member",
        requesterInitials: "CM",
        verification: "Demo profile — not verified"
    },

    "demo-006": {
        id: "demo-006",
        title: "Online Form Guidance",
        category: "Documents & Forms",
        description:
            "A community member needs guidance understanding and completing an online application form. A volunteer comfortable with basic digital forms could help explain the steps.",
        location: "Community area",
        postedDate: "2026-10-05",
        preferredDate: "Flexible",
        preferredTime: "To be discussed",
        priority: "Flexible",
        status: "open",
        preferences:
            "The requester must review and submit their own information. Please do not ask for or retain passwords, OTPs, or unnecessary personal documents.",
        requesterName: "Community Member",
        requesterRole: "Community member",
        requesterInitials: "CM",
        verification: "Demo profile — not verified"
    }
};

// ---------------------------------------------------------
// 2. INITIALIZE PAGE
// ---------------------------------------------------------

function initializeRequestDetails() {
    const content = document.getElementById("requestDetailsContent");
    const notFound = document.getElementById("requestNotFound");

    if (!content || !notFound) {
        console.error("CareCircle: Request details page elements are missing.");
        return;
    }

    updateFooterYear();
    setupOfferHelpButton();

    const requestId = getRequestIdFromURL();
    const request = requestDetailsData[requestId];

    if (!request) {
        showRequestNotFound();
        return;
    }

    renderRequestDetails(request);
}

// ---------------------------------------------------------
// 3. READ REQUEST ID FROM URL
// ---------------------------------------------------------
// Example:
// request-details.html?id=demo-001
//
// URLSearchParams safely reads and decodes the query value.

function getRequestIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return (params.get("id") || "").trim();
}

// ---------------------------------------------------------
// 4. RENDER REQUEST DETAILS
// ---------------------------------------------------------

function renderRequestDetails(request) {
    const content = document.getElementById("requestDetailsContent");
    const notFound = document.getElementById("requestNotFound");

    if (!content || !notFound) {
        return;
    }

    notFound.hidden = true;
    content.hidden = false;

    setText("detailCategory", request.category);
    setText("detailTitle", request.title);
    setText("detailLocation", request.location);
    setText("detailPostedDate", formatDate(request.postedDate));
    setText("detailDescription", request.description);

    setText("detailCategoryInfo", request.category);
    setText("detailPreferredDate", formatPreferredDate(request.preferredDate));
    setText("detailPreferredTime", request.preferredTime);
    setText("detailPriority", formatPriority(request.priority));

    setText("detailPreferences", request.preferences);
    setText("requesterName", request.requesterName);
    setText("requesterRole", request.requesterRole);
    setText("requesterAvatar", request.requesterInitials);
    setText("requesterVerification", request.verification);

    setText("detailRequestId", request.id);
    setText("sidebarPriority", formatPriority(request.priority));
    setText("sidebarAvailability", formatStatus(request.status));

    updateRequestStatusBadge(request.status);

    const preferencesSection = document.getElementById("preferencesSection");

    if (preferencesSection) {
        preferencesSection.hidden = !request.preferences;
    }

    const offerButton = document.getElementById("offerHelpButton");

    if (offerButton) {
        const canOfferHelp = request.status === "open";

        offerButton.disabled = !canOfferHelp;
        offerButton.innerHTML = canOfferHelp
            ? '<span aria-hidden="true">♡</span> Offer to Help'
            : escapeHTML(formatStatus(request.status));

        if (!canOfferHelp) {
            offerButton.setAttribute("aria-label", "This request is not open for offers");
        } else {
            offerButton.setAttribute("aria-label", "Offer to help with this request");
        }
    }

    document.title = `${request.title} | CareCircle`;
}

// ---------------------------------------------------------
// 5. UPDATE REQUEST STATUS BADGE
// ---------------------------------------------------------

function updateRequestStatusBadge(status) {
    const badge = document.getElementById("detailStatus");

    if (!badge) {
        return;
    }

    const statusClasses = {
        open: "status-open",
        pending: "status-pending",
        "in-progress": "status-in-progress",
        completed: "status-completed",
        cancelled: "status-cancelled"
    };

    badge.className = "details-status";
    badge.classList.add(statusClasses[status] || "status-open");
    badge.textContent = formatStatus(status);
}

// ---------------------------------------------------------
// 6. OFFER TO HELP BUTTON
// ---------------------------------------------------------
// This is a front-end demonstration only.
// It does not create an offer or update a database.

function setupOfferHelpButton() {
    const button = document.getElementById("offerHelpButton");

    if (!button) {
        return;
    }

    button.addEventListener("click", function () {
        const requestId = getRequestIdFromURL();
        const request = requestDetailsData[requestId];

        if (!request) {
            showOfferMessage(
                "This request could not be found. Please return to the request list.",
                true
            );
            return;
        }

        if (request.status !== "open") {
            showOfferMessage(
                "This request is not currently accepting offers of help.",
                true
            );
            return;
        }

        showOfferMessage(
            "Demo mode: your offer has not been submitted. Account sign-in and the backend offer workflow must be connected before you can offer help.",
            false
        );

        console.info("CareCircle demo: Offer to Help clicked.", {
            requestId: request.id,
            requestTitle: request.title
        });
    });
}

// ---------------------------------------------------------
// 7. SHOW OFFER MESSAGE
// ---------------------------------------------------------

function showOfferMessage(message, isError) {
    const messageBox = document.getElementById("offerMessage");

    if (!messageBox) {
        return;
    }

    messageBox.textContent = message;
    messageBox.classList.toggle("error", Boolean(isError));
    messageBox.hidden = false;
}

// ---------------------------------------------------------
// 8. SHOW REQUEST NOT FOUND
// ---------------------------------------------------------

function showRequestNotFound() {
    const content = document.getElementById("requestDetailsContent");
    const notFound = document.getElementById("requestNotFound");

    if (content) {
        content.hidden = true;
    }

    if (notFound) {
        notFound.hidden = false;
    }

    document.title = "Request Not Found | CareCircle";
}

// ---------------------------------------------------------
// 9. DATE FORMATTING
// ---------------------------------------------------------

function formatDate(dateString) {
    if (!dateString) {
        return "Not specified";
    }

    // Avoid displaying invalid dates.
    const date = new Date(`${dateString}T12:00:00`);

    if (Number.isNaN(date.getTime())) {
        return "Not specified";
    }

    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    }).format(date);
}

function formatPreferredDate(dateString) {
    if (!dateString || dateString.toLowerCase() === "flexible") {
        return "Flexible";
    }

    return formatDate(dateString);
}

// ---------------------------------------------------------
// 10. STATUS AND PRIORITY LABELS
// ---------------------------------------------------------

function formatStatus(status) {
    const labels = {
        open: "Open for help",
        pending: "Pending",
        "in-progress": "In progress",
        completed: "Completed",
        cancelled: "Cancelled"
    };

    return labels[status] || "Status unavailable";
}

function formatPriority(priority) {
    const labels = {
        urgent: "Urgent",
        normal: "Normal",
        flexible: "Flexible"
    };

    const normalizedPriority = String(priority || "").toLowerCase();

    return labels[normalizedPriority] || "Normal";
}

// ---------------------------------------------------------
// 11. SAFE TEXT HELPERS
// ---------------------------------------------------------

function setText(elementId, value) {
    const element = document.getElementById(elementId);

    if (!element) {
        return;
    }

    // textContent prevents request text from being interpreted as HTML.
    element.textContent =
        value === null || value === undefined || value === ""
            ? "Not specified"
            : String(value);
}

function escapeHTML(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// ---------------------------------------------------------
// 12. FOOTER YEAR
// ---------------------------------------------------------

function updateFooterYear() {
    const yearElement = document.getElementById("currentYear");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}
