
/* =========================================================
   CareCircle - My Requests JavaScript
   File: frontend/js/my-requests.js

   Features:
   1. Search requests by title or category
   2. Filter by request type
   3. Filter by status
   4. Sort by date or title
   5. Update request statistics
   6. Display request details in a dialog
   7. Clear all filters
   8. Dismiss the demo notice
   9. Update the footer year

   IMPORTANT:
   This page currently uses fictional demo data.
   No requests are fetched from or saved to MongoDB.
========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    initializeMyRequests();
});


/* =========================================================
   DEMONSTRATION REQUEST DETAILS
========================================================= */

const myRequestDetailsData = {
    "my-demo-001": {
        title: "Grocery Shopping Assistance",
        type: "help-needed",
        typeLabel: "Help I Need",
        status: "pending",
        statusLabel: "Pending",
        category: "Groceries",
        date: "2026-10-10",
        description:
            "Assistance collecting vegetables, fruits, and household essentials from a nearby shop. The preferred schedule is flexible. Please coordinate arrangements before the visit."
    },

    "my-demo-002": {
        title: "Smartphone Guidance",
        type: "helping",
        typeLabel: "Help I'm Providing",
        status: "in-progress",
        statusLabel: "In Progress",
        category: "Digital Guidance",
        date: "2026-10-09",
        description:
            "Helping a community member learn basic smartphone features and video calling. This is a demonstration request and is not connected to a real volunteer assignment."
    },

    "my-demo-003": {
        title: "Friendly Walk and Conversation",
        type: "helping",
        typeLabel: "Help I'm Providing",
        status: "in-progress",
        statusLabel: "In Progress",
        category: "Companionship",
        date: "2026-10-08",
        description:
            "Providing companionship and helping strengthen everyday community connections. Any real-world visit should be mutually agreed upon and arranged safely."
    },

    "my-demo-004": {
        title: "Online Form Guidance",
        type: "help-needed",
        typeLabel: "Help I Need",
        status: "completed",
        statusLabel: "Completed",
        category: "Documents & Forms",
        date: "2026-10-05",
        description:
            "Received basic guidance with navigating an online form while keeping personal information private. This is an illustrative completed request, not a real transaction."
    }
};


/* =========================================================
   INITIALIZATION
========================================================= */

function initializeMyRequests() {
    const container = document.getElementById("myRequestsContainer");

    if (!container) {
        return;
    }

    initializeSearch();
    initializeFilters();
    initializeSorting();
    initializeClearFilters();
    initializeDemoNotice();
    initializeRequestDialog();
    initializeFooterYear();

    // Render initial statistics and request count.
    updateMyRequestResults();
}


/* =========================================================
   SEARCH
========================================================= */

function initializeSearch() {
    const searchInput = document.getElementById("myRequestsSearch");

    if (!searchInput) {
        return;
    }

    searchInput.addEventListener("input", updateMyRequestResults);
}


/* =========================================================
   FILTERS
========================================================= */

function initializeFilters() {
    const typeFilter = document.getElementById("myRequestTypeFilter");
    const statusFilter = document.getElementById("myRequestStatusFilter");

    if (typeFilter) {
        typeFilter.addEventListener("change", updateMyRequestResults);
    }

    if (statusFilter) {
        statusFilter.addEventListener("change", updateMyRequestResults);
    }
}


/* =========================================================
   SORTING
========================================================= */

function initializeSorting() {
    const sortFilter = document.getElementById("myRequestSortFilter");

    if (sortFilter) {
        sortFilter.addEventListener("change", updateMyRequestResults);
    }
}


/* =========================================================
   FILTER, SORT AND UPDATE REQUESTS
========================================================= */

function updateMyRequestResults() {
    const container = document.getElementById("myRequestsContainer");

    if (!container) {
        return;
    }

    const searchInput = document.getElementById("myRequestsSearch");
    const typeFilter = document.getElementById("myRequestTypeFilter");
    const statusFilter = document.getElementById("myRequestStatusFilter");
    const sortFilter = document.getElementById("myRequestSortFilter");

    const emptyState = document.getElementById("myRequestsEmptyState");

    const cards = Array.from(
        container.querySelectorAll(".my-request-card")
    );

    const searchTerm = searchInput
        ? searchInput.value.trim().toLowerCase()
        : "";

    const selectedType = typeFilter
        ? typeFilter.value
        : "all";

    const selectedStatus = statusFilter
        ? statusFilter.value
        : "all";

    const selectedSort = sortFilter
        ? sortFilter.value
        : "newest";

    // Apply search and filters.
    const filteredCards = cards.filter((card) => {
        const title = (card.dataset.title || "").toLowerCase();
        const category = (card.dataset.category || "").toLowerCase();
        const description = card.textContent.toLowerCase();

        const matchesSearch =
            searchTerm === "" ||
            title.includes(searchTerm) ||
            category.includes(searchTerm) ||
            description.includes(searchTerm);

        const matchesType =
            selectedType === "all" ||
            card.dataset.type === selectedType;

        const matchesStatus =
            selectedStatus === "all" ||
            card.dataset.status === selectedStatus;

        return matchesSearch && matchesType && matchesStatus;
    });

    // Sort the matching requests.
    const sortedCards = [...filteredCards];

    if (selectedSort === "newest") {
        sortedCards.sort((a, b) => {
            return compareRequestDates(b.dataset.date, a.dataset.date);
        });
    } else if (selectedSort === "oldest") {
        sortedCards.sort((a, b) => {
            return compareRequestDates(a.dataset.date, b.dataset.date);
        });
    } else if (selectedSort === "title") {
        sortedCards.sort((a, b) => {
            return (a.dataset.title || "").localeCompare(
                b.dataset.title || "",
                "en",
                { sensitivity: "base" }
            );
        });
    }

    // Reorder visible cards while preserving the original card elements.
    sortedCards.forEach((card) => {
        card.hidden = false;
        container.appendChild(card);
    });

    cards.forEach((card) => {
        if (!sortedCards.includes(card)) {
            card.hidden = true;
        }
    });

    // Update visible result count.
    const resultCount = document.getElementById("myRequestsResultCount");
    const resultLabel = document.getElementById("myRequestsResultLabel");

    if (resultCount) {
        resultCount.textContent = String(sortedCards.length);
    }

    if (resultLabel) {
        resultLabel.textContent =
            sortedCards.length === 1
                ? "demo request"
                : "demo requests";
    }

    // Toggle empty state.
    if (emptyState) {
        emptyState.hidden = sortedCards.length !== 0;
    }

    container.setAttribute(
        "aria-label",
        `${sortedCards.length} matching demo requests`
    );

    // Statistics represent all demo requests, not the filtered subset.
    updateMyRequestStatistics(cards);
}


/* =========================================================
   DATE COMPARISON
========================================================= */

function compareRequestDates(dateA, dateB) {
    const timestampA = Date.parse(dateA || "");
    const timestampB = Date.parse(dateB || "");

    const safeA = Number.isFinite(timestampA) ? timestampA : 0;
    const safeB = Number.isFinite(timestampB) ? timestampB : 0;

    return safeA - safeB;
}


/* =========================================================
   SUMMARY STATISTICS
========================================================= */

function updateMyRequestStatistics(cards) {
    const statistics = {
        total: cards.length,
        pending: 0,
        active: 0,
        completed: 0
    };

    cards.forEach((card) => {
        const status = card.dataset.status;

        if (status === "pending") {
            statistics.pending += 1;
        } else if (status === "in-progress") {
            statistics.active += 1;
        } else if (status === "completed") {
            statistics.completed += 1;
        }
    });

    setElementText("myTotalRequests", statistics.total);
    setElementText("myPendingRequests", statistics.pending);
    setElementText("myActiveRequests", statistics.active);
    setElementText("myCompletedRequests", statistics.completed);
}


/* =========================================================
   CLEAR FILTERS
========================================================= */

function initializeClearFilters() {
    const clearButton = document.getElementById("clearMyRequestFilters");
    const emptyClearButton = document.getElementById(
        "myRequestsEmptyClearButton"
    );

    if (clearButton) {
        clearButton.addEventListener("click", clearMyRequestFilters);
    }

    if (emptyClearButton) {
        emptyClearButton.addEventListener("click", clearMyRequestFilters);
    }
}

function clearMyRequestFilters() {
    const searchInput = document.getElementById("myRequestsSearch");
    const typeFilter = document.getElementById("myRequestTypeFilter");
    const statusFilter = document.getElementById("myRequestStatusFilter");
    const sortFilter = document.getElementById("myRequestSortFilter");

    if (searchInput) {
        searchInput.value = "";
    }

    if (typeFilter) {
        typeFilter.value = "all";
    }

    if (statusFilter) {
        statusFilter.value = "all";
    }

    if (sortFilter) {
        sortFilter.value = "newest";
    }

    updateMyRequestResults();

    if (searchInput) {
        searchInput.focus();
    }
}


/* =========================================================
   DEMO NOTICE
========================================================= */

function initializeDemoNotice() {
    const notice = document.querySelector(".my-requests-demo-notice");
    const dismissButton = document.getElementById(
        "dismissMyRequestsNotice"
    );

    if (!notice || !dismissButton) {
        return;
    }

    dismissButton.addEventListener("click", () => {
        notice.hidden = true;
    });
}


/* =========================================================
   REQUEST DETAILS DIALOG
========================================================= */

function initializeRequestDialog() {
    const container = document.getElementById("myRequestsContainer");
    const dialog = document.getElementById("myRequestDetailsDialog");

    const closeButton = document.getElementById("closeMyRequestDialog");
    const cancelButton = document.getElementById("cancelMyRequestDialog");

    if (!container || !dialog) {
        return;
    }

    let previouslyFocusedElement = null;

    container.addEventListener("click", (event) => {
        const button = event.target.closest(".my-request-view-button");

        if (!button || button.disabled) {
            return;
        }

        const requestId = button.dataset.requestId;
        const request = myRequestDetailsData[requestId];

        if (!request) {
            window.alert(
                "The details for this demonstration request could not be found."
            );
            return;
        }

        openMyRequestDialog(request, button);
    });

    function openMyRequestDialog(request, triggerButton) {
        previouslyFocusedElement = triggerButton;

        setElementText("myDialogRequestType", request.typeLabel);
        setElementText("myDialogRequestStatus", request.statusLabel);
        setElementText("myRequestDialogTitle", request.title);
        setElementText("myRequestDialogDescription", request.description);
        setElementText("myDialogRequestCategory", request.category);
        setElementText(
            "myDialogRequestDate",
            formatMyRequestDate(request.date)
        );

        // Keep the badge styles consistent with the selected request.
        const typeBadge = document.getElementById("myDialogRequestType");
        const statusBadge = document.getElementById("myDialogRequestStatus");

        if (typeBadge) {
            typeBadge.className =
                "my-request-type-badge " +
                (request.type === "helping"
                    ? "type-helping"
                    : "type-help-needed");
        }

        if (statusBadge) {
            const statusClasses = {
                pending: "status-pending",
                "in-progress": "status-in-progress",
                completed: "status-completed",
                cancelled: "status-cancelled"
            };

            statusBadge.className =
                "my-request-status " +
                (statusClasses[request.status] || "");
        }

        if (typeof dialog.showModal === "function") {
            if (!dialog.open) {
                dialog.showModal();
            }

            if (closeButton) {
                closeButton.focus();
            }
        } else {
            window.alert(
                "Your browser does not support this request details dialog. Please use a modern browser."
            );
        }
    }

    function closeDialog() {
        if (dialog.open) {
            dialog.close();
        }
    }

    if (closeButton) {
        closeButton.addEventListener("click", closeDialog);
    }

    if (cancelButton) {
        cancelButton.addEventListener("click", closeDialog);
    }

    dialog.addEventListener("click", (event) => {
        if (event.target === dialog) {
            closeDialog();
        }
    });

    dialog.addEventListener("close", () => {
        if (
            previouslyFocusedElement &&
            document.contains(previouslyFocusedElement)
        ) {
            previouslyFocusedElement.focus();
        }

        previouslyFocusedElement = null;
    });
}


/* =========================================================
   SAFE DOM HELPERS
========================================================= */

function setElementText(elementId, value) {
    const element = document.getElementById(elementId);

    if (element) {
        // textContent prevents the value from being parsed as HTML.
        element.textContent = String(value ?? "");
    }
}


/* =========================================================
   DATE FORMATTING
========================================================= */

function formatMyRequestDate(dateString) {
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
   FOOTER YEAR
========================================================= */

function initializeFooterYear() {
    setElementText("currentYear", new Date().getFullYear());
}
