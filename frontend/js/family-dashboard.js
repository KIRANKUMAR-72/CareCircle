
/* =========================================================
   CARECIRCLE — FAMILY DASHBOARD
   File: frontend/js/family-dashboard.js

   Frontend demonstration only.
   Does not load or save real family or request data.
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", initializeFamilyDashboard);

function initializeFamilyDashboard() {
    // -----------------------------------------------------
    // 1. DOM Elements
    // -----------------------------------------------------

    const userNameElement = document.getElementById("familyUserName");
    const userAvatarElement = document.getElementById("familyUserAvatar");
    const dateElement = document.getElementById("familyDashboardDate");
    const yearElement = document.getElementById("currentYear");

    const demoNotice = document.getElementById("familyDemoNotice");
    const dismissNoticeButton = document.getElementById("dismissFamilyNotice");

    const linkedCountElement = document.getElementById("familyLinkedCount");
    const membersHeadingCount = document.getElementById(
        "familyMembersHeadingCount"
    );

    const openRequestCountElement = document.getElementById(
        "familyOpenRequestCount"
    );

    const completedCountElement = document.getElementById(
        "familyCompletedCount"
    );

    const unreadCountElement = document.getElementById("familyUnreadCount");

    const membersList = document.getElementById("familyMembersList");
    const requestsList = document.getElementById("familyRequestList");

    const membersEmptyState = document.getElementById(
        "familyMembersEmptyState"
    );

    const requestsEmptyState = document.getElementById(
        "familyRequestsEmptyState"
    );

    // -----------------------------------------------------
    // 2. Demo Data
    // -----------------------------------------------------
    // These values are illustrative, not real user records.
    // Replace this data with API responses after backend
    // authentication and authorization are implemented.

    const familyDashboardData = {
        user: {
            name: "Family Member",
            role: "Family Member"
        },

        statistics: {
            linkedMembers: 2,
            openRequests: 2,
            completedRequests: 4,
            unreadMessages: 1
        },

        members: [
            {
                id: "member-demo-001",
                name: "Anita Mehta",
                role: "Elderly member"
            },
            {
                id: "member-demo-002",
                name: "Ravi Kumar",
                role: "Special Care member"
            }
        ],

        requests: [
            {
                id: "family-demo-001",
                status: "pending",
                title: "Weekly grocery assistance"
            },
            {
                id: "family-demo-002",
                status: "in-progress",
                title: "Smartphone guidance"
            }
        ]
    };

    // -----------------------------------------------------
    // 3. Date and Footer Year
    // -----------------------------------------------------

    function updateDashboardDate() {
        if (!dateElement) {
            return;
        }

        const today = new Date();

        const formattedDate = new Intl.DateTimeFormat("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(today);

        dateElement.textContent =
            "Here is your family support overview for " + formattedDate + ".";
    }

    function updateFooterYear() {
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }

    // -----------------------------------------------------
    // 4. User Greeting
    // -----------------------------------------------------

    function getInitials(name) {
        const cleanName = String(name || "").trim();

        if (!cleanName) {
            return "FM";
        }

        const parts = cleanName.split(/\s+/);

        if (parts.length === 1) {
            return parts[0].slice(0, 2).toUpperCase();
        }

        return (
            parts[0].charAt(0) +
            parts[parts.length - 1].charAt(0)
        ).toUpperCase();
    }

    function updateUserGreeting(user) {
        if (!user) {
            return;
        }

        const displayName = String(user.name || "").trim() || "Family Member";

        if (userNameElement) {
            userNameElement.textContent = displayName;
        }

        if (userAvatarElement) {
            userAvatarElement.textContent = getInitials(displayName);
            userAvatarElement.setAttribute(
                "aria-label",
                "Profile initials: " + getInitials(displayName)
            );
        }
    }

    // -----------------------------------------------------
    // 5. Demonstration Notice
    // -----------------------------------------------------

    function initializeDemoNotice() {
        if (!demoNotice || !dismissNoticeButton) {
            return;
        }

        dismissNoticeButton.addEventListener("click", function () {
            demoNotice.hidden = true;
        });
    }

    // -----------------------------------------------------
    // 6. Dashboard Statistics
    // -----------------------------------------------------

    function countFamilyMembers() {
        if (!membersList) {
            return 0;
        }

        return membersList.querySelectorAll(".family-member-card").length;
    }

    function countOpenRequests() {
        if (!requestsList) {
            return 0;
        }

        return Array.from(
            requestsList.querySelectorAll(".family-request-card")
        ).filter(function (card) {
            const status = card.dataset.status;

            return status === "pending" || status === "in-progress";
        }).length;
    }

    function countCompletedRequests() {
        if (!requestsList) {
            return 0;
        }

        return requestsList.querySelectorAll(
            '.family-request-card[data-status="completed"]'
        ).length;
    }

    function updateEmptyStates() {
        const memberCount = countFamilyMembers();
        const requestCount = requestsList
            ? requestsList.querySelectorAll(".family-request-card").length
            : 0;

        if (membersEmptyState) {
            membersEmptyState.hidden = memberCount !== 0;
        }

        if (membersList) {
            membersList.hidden = memberCount === 0;
        }

        if (requestsEmptyState) {
            requestsEmptyState.hidden = requestCount !== 0;
        }

        if (requestsList) {
            requestsList.hidden = requestCount === 0;
        }
    }

    function updateDashboardStatistics(statistics) {
        const values = statistics || {};

        const linkedMembers = Number.isFinite(Number(values.linkedMembers))
            ? Math.max(0, Number(values.linkedMembers))
            : 0;

        const openRequests = Number.isFinite(Number(values.openRequests))
            ? Math.max(0, Number(values.openRequests))
            : 0;

        const completedRequests = Number.isFinite(
            Number(values.completedRequests)
        )
            ? Math.max(0, Number(values.completedRequests))
            : 0;

        const unreadMessages = Number.isFinite(Number(values.unreadMessages))
            ? Math.max(0, Number(values.unreadMessages))
            : 0;

        if (linkedCountElement) {
            linkedCountElement.textContent = linkedMembers;
        }

        if (membersHeadingCount) {
            membersHeadingCount.textContent = linkedMembers;
        }

        if (openRequestCountElement) {
            openRequestCountElement.textContent = openRequests;
        }

        if (completedCountElement) {
            completedCountElement.textContent = completedRequests;
        }

        if (unreadCountElement) {
            unreadCountElement.textContent = unreadMessages;
        }
    }

    // -----------------------------------------------------
    // 7. Request and Member Card Interactions
    // -----------------------------------------------------

    function initializeMemberCards() {
        if (!membersList) {
            return;
        }

        const memberCards = membersList.querySelectorAll(
            ".family-member-card"
        );

        memberCards.forEach(function (card) {
            card.setAttribute("tabindex", "0");

            // Cards are informational. Navigation is provided
            // by the explicit links inside each card.
            card.addEventListener("keydown", function (event) {
                if (
                    event.key === "Enter" &&
                    event.target === card
                ) {
                    const link = card.querySelector("a[href]");

                    if (link) {
                        link.click();
                    }
                }
            });
        });
    }

    function initializeRequestCards() {
        if (!requestsList) {
            return;
        }

        const requestCards = requestsList.querySelectorAll(
            ".family-request-card"
        );

        requestCards.forEach(function (card) {
            const status = card.dataset.status;

            if (!status) {
                return;
            }

            card.setAttribute("data-status", status);
        });
    }

    // -----------------------------------------------------
    // 8. Dashboard Initialization
    // -----------------------------------------------------

    function initializeDashboard() {
        updateDashboardDate();
        updateFooterYear();

        updateUserGreeting(familyDashboardData.user);

        initializeDemoNotice();
        initializeMemberCards();
        initializeRequestCards();

        updateEmptyStates();

        // Sample figures are retained from the demonstration
        // dashboard because the HTML contains only two recent
        // requests, while the statistic cards represent a
        // larger illustrative history.
        updateDashboardStatistics(familyDashboardData.statistics);
    }

    // -----------------------------------------------------
    // 9. Optional Update Functions
    // -----------------------------------------------------
    // These functions are available for later integration.
    // They do not fetch data or communicate with a backend.

    window.CareCircleFamilyDashboard = {
        updateUser: function (user) {
            if (!user || typeof user !== "object") {
                return;
            }

            updateUserGreeting(user);
        },

        updateStatistics: function (statistics) {
            if (!statistics || typeof statistics !== "object") {
                return;
            }

            updateDashboardStatistics(statistics);
        },

        refreshDate: function () {
            updateDashboardDate();
            updateFooterYear();
        },

        refreshEmptyStates: function () {
            updateEmptyStates();
        }
    };

    initializeDashboard();
}
