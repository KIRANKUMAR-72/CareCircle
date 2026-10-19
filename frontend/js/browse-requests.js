
/* =========================================================
   CareCircle - Browse Requests JavaScript
   File: frontend/js/browse-requests.js

   Features:
   1. Search help requests by keyword
   2. Filter requests by category
   3. Filter requests by priority
   4. Sort requests by date or priority
   5. Show request details in a dialog
   6. Display an empty state when no results match
   7. Clear all filters
   8. Update the results counter
   9. Update the footer year

   IMPORTANT:
   This page currently uses fictional demo requests.
   Real requests and request acceptance require backend APIs.
========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    initializeBrowseRequests();
});

/* =========================================================
   DEMO REQUEST DATA

   The IDs below correspond to data-id attributes in
   browse-requests.html.

   These records are only for frontend demonstration.
========================================================= */

const browseRequestDetails = {
    "demo-001": {
        title: "Grocery Shopping Assistance",
        category: "Groceries",
        description:
            "Help with collecting vegetables, fruits, and a few household essentials from a nearby shop. The preferred schedule is flexible. Please coordinate the details before making arrangements.",
        priority: "Normal",
        date: "2026-10-10"
    },

    "demo-002": {
        title: "Medicine Pickup Support",
        category: "Medicine Pickup",
        description:
            "Assistance collecting a prepared prescription from a pharmacy. No medical advice is required. Any collection must be arranged with the requester and follow applicable pharmacy requirements.",
        priority: "Urgent",
        date: "2026-10-11"
    },

    "demo-003": {
        title: "A Friendly Walk and Conversation",
        category: "Companionship",
        description:
            "Spend some time chatting and, if comfortable, accompany a community member on a short walk. The preferred timing is flexible, with weekends being convenient.",
        priority: "Flexible",
        date: "2026-10-09"
    },

    "demo-004": {
        title: "Help Using a Smartphone",
        category: "Digital Guidance",
        description:
            "Explain basic smartphone features and how to make video calls to family members. The goal is to help the community member become more confident using their device.",
        priority: "Normal",
        date: "2026-10-08"
    },

    "demo-005": {
        title: "Help Accompanying Someone to an Appointment",
        category: "Hospital Assistance",
        description:
            "Provide companionship and practical assistance during travel to a scheduled appointment. This is non-medical support and does not include clinical care or medical advice.",
        priority: "Normal",
        date: "2026-10-07"
    },

    "demo-006": {
        title: "Help Understanding an Online Form",
        category: "Documents & Forms",
        description:
            "Provide basic guidance with navigating an online form while keeping personal information private. The requester should enter and retain control of their own sensitive information.",
        priority: "Flexible",
        date: "2026-10-06"
    }
};


/* =========================================================
   INITIALIZATION
========================================================= */

function initializeBrowseRequests() {
    const requestGrid = document.getElementById("requestGrid");

    if (!requestGrid) {
        return;
    }

    initializeSearch();
    initializeFilters();
    initializeSorting();
    initializeClearFilters();
    initializeRequestDetails();
    initializeFooterYear();

    // Display the initial request count.
    updateRequestResults();
}


/* =========================================================
   SEARCH
========================================================= */

function initializeSearch() {
    const searchInput = document.getElementById("requestSearch");

    if (!searchInput) {
        return;
    }

    searchInput.addEventListener("input", updateRequestResults);
}


/* =========================================================
   CATEGORY AND PRIORITY FILTERS
========================================================= */

function initializeFilters() {
    const categoryFilter = document.getElementById("categoryFilter");
    const urgencyFilter = document.getElementById("urgencyFilter");

    if (categoryFilter) {
        categoryFilter.addEventListener("change", updateRequestResults);
    }

    if (urgencyFilter) {
        urgencyFilter.addEventListener("change", updateRequestResults);
    }
}


/* =========================================================
   SORTING
========================================================= */

function initializeSorting() {
    const sortFilter = document.getElementById("sortFilter");

    if (!sortFilter) {
        return;
    }

    sortFilter.addEventListener("change", updateRequestResults);
}


/* =========================================================
   FILTER AND SORT REQUESTS
========================================================= */

function updateRequestResults() {
    const requestGrid = document.getElementById("requestGrid");
    const searchInput = document.getElementById("requestSearch");
    const categoryFilter = document.getElementById("categoryFilter");
    const urgencyFilter = document.getElementById("urgencyFilter");
    const sortFilter = document.getElementById("sortFilter");

    const emptyState = document.getElementById("emptyRequestState");
    const resultCount = document.getElementById("requestResultCount");
    const resultLabel = document.getElementById("requestResultLabel");

    if (!requestGrid) {
        return;
    }

    const cards = Array.from(
        requestGrid.querySelectorAll(".request-card")
    );

    const searchTerm = searchInput
        ? searchInput.value.trim().toLowerCase()
        : "";

    const selectedCategory = categoryFilter
        ? categoryFilter.value
        : "all";

    const selectedPriority = urgencyFilter
        ? urgencyFilter.value
        : "all";

    const selectedSort = sortFilter
        ? sortFilter.value
        : "newest";

    // Filter the requests according to the selected criteria.
    const filteredCards = cards.filter((card) => {
        const cardCategory = card.dataset.category || "";
        const cardPriority = card.dataset.priority || "";

        const searchableText = [
            card.dataset.search || "",
            card.textContent || ""
        ].join(" ").toLowerCase();

        const matchesSearch =
            searchTerm === "" ||
            searchableText.includes(searchTerm);

        const matchesCategory =
            selectedCategory === "all" ||
            cardCategory === selectedCategory;

        const matchesPriority =
            selectedPriority === "all" ||
            cardPriority === selectedPriority;

        return (
            matchesSearch &&
            matchesCategory &&
            matchesPriority
        );
    });

    // Sort a copy of the matching requests.
    const sortedCards = [...filteredCards];

    if (selectedSort === "newest") {
        sortedCards.sort((a, b) => {
            return compareDates(b.dataset.date, a.dataset.date);
        });
    } else if (selectedSort === "oldest") {
        sortedCards.sort((a, b) => {
            return compareDates(a.dataset.date, b.dataset.date);
        });
    } else if (selectedSort === "priority") {
        const priorityRank = {
            urgent: 1,
            normal: 2,
            flexible: 3
        };

        sortedCards.sort((a, b) => {
            const rankA = priorityRank[a.dataset.priority] || 99;
            const rankB = priorityRank[b.dataset.priority] || 99;

            if (rankA !== rankB) {
                return rankA - rankB;
            }

            return compareDates(b.dataset.date, a.dataset.date);
        });
    }

    // Reorder cards in the document and hide non-matching cards.
    sortedCards.forEach((card) => {
        card.hidden = false;
        requestGrid.appendChild(card);
    });

    cards.forEach((card) => {
        if (!sortedCards.includes(card)) {
            card.hidden = true;
        }
    });

    // Update the results counter.
    if (resultCount) {
        resultCount.textContent = String(sortedCards.length);
    }

    if (resultLabel) {
        resultLabel.textContent =
            sortedCards.length === 1
                ? "demo request"
                : "demo requests";
    }

    // Display the empty state when no requests match.
    if (emptyState) {
        emptyState.hidden = sortedCards.length !== 0;
    }

    requestGrid.setAttribute(
        "aria-label",
        `${sortedCards.length} matching demo requests`
    );
}


/* =========================================================
   DATE COMPARISON
========================================================= */

function compareDates(dateA, dateB) {
    const valueA = Date.parse(dateA || "");
    const valueB = Date.parse(dateB || "");

    const safeA = Number.isFinite(valueA) ? valueA : 0;
    const safeB = Number.isFinite(valueB) ? valueB : 0;

    return safeA - safeB;
}


/* =========================================================
   CLEAR FILTERS
========================================================= */

function initializeClearFilters() {
    const clearButton = document.getElementById("clearFiltersButton");
    const emptyStateClearButton = document.getElementById(
        "emptyStateClearButton"
    );

    if (clearButton) {
        clearButton.addEventListener("click", clearRequestFilters);
    }

    if (emptyStateClearButton) {
        emptyStateClearButton.addEventListener(
            "click",
            clearRequestFilters
        );
    }
}

function clearRequestFilters() {
    const searchInput = document.getElementById("requestSearch");
    const categoryFilter = document.getElementById("categoryFilter");
    const urgencyFilter = document.getElementById("urgencyFilter");
    const sortFilter = document.getElementById("sortFilter");

    if (searchInput) {
        searchInput.value = "";
    }

    if (categoryFilter) {
        categoryFilter.value = "all";
    }

    if (urgencyFilter) {
        urgencyFilter.value = "all";
    }

    if (sortFilter) {
        sortFilter.value = "newest";
    }

    updateRequestResults();

    if (searchInput) {
        searchInput.focus();
    }
}


/* =========================================================
   REQUEST DETAILS DIALOG
========================================================= */

function initializeRequestDetails() {
    const requestGrid = document.getElementById("requestGrid");
    const dialog = document.getElementById("requestDetailsDialog");

    const closeButton = document.getElementById("closeRequestDialog");
    const cancelButton = document.getElementById("cancelRequestDialog");

    if (!requestGrid || !dialog) {
        return;
    }

    // Use event delegation for all View Details buttons.
    requestGrid.addEventListener("click", (event) => {
        const button = event.target.closest(".request-view-button");

        if (!button || button.disabled) {
            return;
        }

        const requestId = button.dataset.requestId;

        if (!requestId) {
            return;
        }

        const request = browseRequestDetails[requestId];

        if (!request) {
            showRequestMessage(
                "The details for this demo request could not be found."
            );
            return;
        }

        openRequestDialog(request);
    });

    if (closeButton) {
        closeButton.addEventListener("click", () => {
            closeRequestDialog(dialog);
        });
    }

    if (cancelButton) {
        cancelButton.addEventListener("click", () => {
            closeRequestDialog(dialog);
        });
    }

    // Close the dialog when the user clicks its backdrop.
    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) {
            closeRequestDialog(dialog);
        }
    });

    // Restore focus to the previous control when the dialog closes.
    let previouslyFocusedElement = null;

    dialog.addEventListener("close", () => {
        if (
            previouslyFocusedElement &&
            document.contains(previouslyFocusedElement)
        ) {
            previouslyFocusedElement.focus();
        }

        previouslyFocusedElement = null;
    });

    function openRequestDialog(request) {
        previouslyFocusedElement = document.activeElement;

        setText("dialogRequestCategory", request.category);
        setText("dialogRequestTitle", request.title);
        setText("dialogRequestDescription", request.description);
        setText("dialogRequestPriority", request.priority);
        setText("dialogRequestDate", formatRequestDate(request.date));

        if (typeof dialog.showModal === "function") {
            if (!dialog.open) {
                dialog.showModal();
            }

            if (closeButton) {
                closeButton.focus();
            }
        } else {
            showRequestMessage(
                "Your browser does not support this request preview dialog. Please use a modern browser."
            );
        }
    }
}


/* =========================================================
   DIALOG HELPERS
========================================================= */

function closeRequestDialog(dialog) {
    if (dialog && dialog.open) {
        dialog.close();
    }
}

function setText(elementId, value) {
    const element = document.getElementById(elementId);

    if (element) {
        // textContent prevents demo text from being interpreted as HTML.
        element.textContent = value ?? "";
    }
}

function formatRequestDate(dateString) {
    const date = new Date(`${dateString}T12:00:00`);

    if (Number.isNaN(date.getTime())) {
        return "Date unavailable";
    }

    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    }).format(date);
}


/* =========================================================
   GENERAL MESSAGE
========================================================= */

function showRequestMessage(message) {
    window.alert(message);
}


/* =========================================================
   FOOTER YEAR
========================================================= */

function initializeFooterYear() {
    const yearElement = document.getElementById("currentYear");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}
