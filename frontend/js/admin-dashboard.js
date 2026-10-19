
// =========================================================
// CareCircle — Admin Dashboard
// File: frontend/js/admin-dashboard.js
//
// IMPORTANT:
// This is a front-end demonstration only.
// No authentication, database updates, or real admin actions
// are implemented in this file.
// =========================================================

"use strict";

document.addEventListener("DOMContentLoaded", () => {
    // -----------------------------------------------------
    // 1. DOM helpers
    // -----------------------------------------------------

    const getElement = (id) => document.getElementById(id);

    const getAll = (selector, parent = document) =>
        Array.from(parent.querySelectorAll(selector));

    const setText = (id, value) => {
        const element = getElement(id);

        if (element) {
            element.textContent = value ?? "";
        }
    };

    const normalise = (value) =>
        String(value ?? "").trim().toLowerCase();

    const formatDate = (dateString) => {
        if (!dateString) {
            return "Not available";
        }

        const date = new Date(`${dateString}T12:00:00`);

        if (Number.isNaN(date.getTime())) {
            return "Not available";
        }

        return date.toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    };

    const formatRole = (role) => {
        const roles = {
            volunteer: "Volunteer",
            elderly: "Elderly",
            family: "Family member",
            "special-care": "Special Care"
        };

        return roles[role] || "Not specified";
    };

    const formatStatus = (status) => {
        const statuses = {
            verified: "Verified",
            pending: "Pending",
            unverified: "Unverified",
            "in-progress": "In progress",
            completed: "Completed",
            cancelled: "Cancelled"
        };

        return statuses[status] || "Not specified";
    };

    const formatCategory = (category) => {
        const categories = {
            groceries: "Groceries",
            medicine: "Medicine",
            hospital: "Hospital Assistance",
            companionship: "Companionship",
            "digital-guidance": "Digital Guidance",
            documents: "Documents & Forms",
            "personal-support": "Everyday Personal Support",
            "special-care": "Special Care",
            other: "Other"
        };

        return categories[category] || "General support";
    };

    const getInitials = (name) => {
        const parts = String(name || "Community Member")
            .trim()
            .split(/\s+/)
            .filter(Boolean);

        return parts
            .slice(0, 2)
            .map((part) => part.charAt(0).toUpperCase())
            .join("") || "CM";
    };

    // -----------------------------------------------------
    // 2. Dashboard date and footer year
    // -----------------------------------------------------

    function updateDashboardDate() {
        const now = new Date();

        const dateElement = getElement("adminCurrentDate");

        if (dateElement) {
            dateElement.textContent = now.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric"
            });
        }

        setText("currentYear", now.getFullYear());
    }

    updateDashboardDate();

    // -----------------------------------------------------
    // 3. Mobile sidebar
    // -----------------------------------------------------

    const sidebar = getElement("adminSidebar");
    const sidebarToggle = getElement("adminSidebarToggle");
    const sidebarOverlay = getElement("adminSidebarOverlay");

    function openSidebar() {
        if (!sidebar || !sidebarToggle || !sidebarOverlay) {
            return;
        }

        sidebar.classList.add("open");
        sidebarOverlay.hidden = false;
        sidebarToggle.setAttribute("aria-expanded", "true");

        document.body.style.overflow = "hidden";
    }

    function closeSidebar() {
        if (!sidebar || !sidebarToggle || !sidebarOverlay) {
            return;
        }

        sidebar.classList.remove("open");
        sidebarOverlay.hidden = true;
        sidebarToggle.setAttribute("aria-expanded", "false");

        document.body.style.overflow = "";
    }

    function toggleSidebar() {
        if (!sidebar) {
            return;
        }

        if (sidebar.classList.contains("open")) {
            closeSidebar();
        } else {
            openSidebar();
        }
    }

    if (sidebarToggle) {
        sidebarToggle.addEventListener("click", toggleSidebar);
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener("click", closeSidebar);
    }

    getAll(".admin-nav-link[data-admin-section]").forEach((link) => {
        link.addEventListener("click", () => {
            const sectionId = link.dataset.adminSection;

            getAll(".admin-nav-link[data-admin-section]").forEach((item) => {
                const isActive = item === link;

                item.classList.toggle("active", isActive);

                if (isActive) {
                    item.setAttribute("aria-current", "location");
                } else {
                    item.removeAttribute("aria-current");
                }
            });

            closeSidebar();

            // Allow the native anchor navigation to scroll to the section.
            if (sectionId && getElement(sectionId)) {
                // Intentionally no preventDefault().
            }
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeSidebar();
        }
    });

    // -----------------------------------------------------
    // 4. Demo notice
    // -----------------------------------------------------

    const adminDemoNotice = getElement("adminDemoNotice");
    const dismissAdminNotice = getElement("dismissAdminNotice");

    if (dismissAdminNotice && adminDemoNotice) {
        dismissAdminNotice.addEventListener("click", () => {
            adminDemoNotice.hidden = true;
        });
    }

    // -----------------------------------------------------
    // 5. Read demonstration records from the HTML
    // -----------------------------------------------------

    function getUserRows() {
        return getAll(".admin-user-row");
    }

    function getRequestRows() {
        return getAll(".admin-request-row");
    }

    function getVerificationRows() {
        return getAll(".admin-verification-row");
    }

    // -----------------------------------------------------
    // 6. Community member search and filters
    // -----------------------------------------------------

    const userSearch = getElement("adminUserSearch");
    const userRoleFilter = getElement("adminUserRoleFilter");
    const userStatusFilter = getElement("adminUserStatusFilter");

    const clearUserFiltersButton = getElement("clearAdminUserFilters");
    const usersEmptyClearButton = getElement("adminUsersEmptyClearButton");

    const usersTableBody = getElement("adminUsersTableBody");
    const usersEmptyState = getElement("adminUsersEmptyState");

    const userResultMessage = getElement("adminUserResultMessage");
    const memberSectionCount = getElement("adminMembersSectionCount");

    function filterUsers() {
        const query = normalise(userSearch?.value);
        const selectedRole = userRoleFilter?.value || "all";
        const selectedStatus = userStatusFilter?.value || "all";

        let visibleCount = 0;

        getUserRows().forEach((row) => {
            const searchText = normalise([
                row.dataset.name,
                row.dataset.email,
                row.dataset.city,
                row.dataset.userId
            ].join(" "));

            const roleMatches =
                selectedRole === "all" ||
                row.dataset.role === selectedRole;

            const statusMatches =
                selectedStatus === "all" ||
                row.dataset.status === selectedStatus;

            const searchMatches =
                !query || searchText.includes(query);

            const shouldShow =
                roleMatches && statusMatches && searchMatches;

            row.hidden = !shouldShow;

            if (shouldShow) {
                visibleCount += 1;
            }
        });

        const total = getUserRows().length;

        if (userResultMessage) {
            userResultMessage.textContent =
                `Showing ${visibleCount} of ${total} sample members`;
        }

        if (memberSectionCount) {
            memberSectionCount.textContent =
                `${total} sample records`;
        }

        if (usersEmptyState) {
            usersEmptyState.hidden = visibleCount !== 0;
        }

        if (usersTableBody) {
            usersTableBody.hidden = visibleCount === 0;
        }
    }

    function clearUserFilters() {
        if (userSearch) {
            userSearch.value = "";
        }

        if (userRoleFilter) {
            userRoleFilter.value = "all";
        }

        if (userStatusFilter) {
            userStatusFilter.value = "all";
        }

        filterUsers();
    }

    if (userSearch) {
        userSearch.addEventListener("input", filterUsers);
    }

    if (userRoleFilter) {
        userRoleFilter.addEventListener("change", filterUsers);
    }

    if (userStatusFilter) {
        userStatusFilter.addEventListener("change", filterUsers);
    }

    if (clearUserFiltersButton) {
        clearUserFiltersButton.addEventListener("click", clearUserFilters);
    }

    if (usersEmptyClearButton) {
        usersEmptyClearButton.addEventListener("click", clearUserFilters);
    }

    // -----------------------------------------------------
    // 7. Dialog helper
    // -----------------------------------------------------

    function showDialog(dialog) {
        if (!dialog) {
            return;
        }

        // Native dialog provides Escape handling and focus management.
        if (typeof dialog.showModal === "function") {
            if (!dialog.open) {
                dialog.showModal();
            }
        } else {
            // Fallback for older browsers.
            dialog.setAttribute("open", "");
        }
    }

    function closeDialog(dialog) {
        if (!dialog) {
            return;
        }

        if (typeof dialog.close === "function" && dialog.open) {
            dialog.close();
        } else {
            dialog.removeAttribute("open");
        }
    }

    function connectDialogCloseButtons(dialogId, buttonIds) {
        const dialog = getElement(dialogId);

        buttonIds.forEach((buttonId) => {
            const button = getElement(buttonId);

            if (button) {
                button.addEventListener("click", () => {
                    closeDialog(dialog);
                });
            }
        });

        if (dialog) {
            dialog.addEventListener("click", (event) => {
                // Close when the click occurs on the backdrop.
                if (event.target === dialog) {
                    closeDialog(dialog);
                }
            });
        }
    }

    // -----------------------------------------------------
    // 8. Member details dialog
    // -----------------------------------------------------

    const userDialog = getElement("adminUserDialog");

    connectDialogCloseButtons("adminUserDialog", [
        "closeAdminUserDialog",
        "closeAdminUserDialogFooter"
    ]);

    function openUserDetails(userId) {
        const row = getUserRows().find(
            (item) => item.dataset.userId === userId
        );

        if (!row) {
            return;
        }

        const name = row.dataset.name || "Community Member";
        const email = row.dataset.email || "Not provided";
        const role = row.dataset.role || "";
        const city = row.dataset.city || "Not provided";
        const status = row.dataset.status || "";
        const joined = row.dataset.joined || "";
        const credits = row.dataset.credits || "0";

        setText("adminDialogUserName", name);
        setText("adminDialogUserEmail", email);
        setText("adminDialogUserId", userId);
        setText("adminDialogUserRole", formatRole(role));
        setText("adminDialogUserCity", city);
        setText("adminDialogUserJoined", formatDate(joined));
        setText("adminDialogUserStatus", formatStatus(status));
        setText("adminDialogUserCredits", credits);

        const avatar = getElement("adminDialogUserAvatar");

        if (avatar) {
            avatar.textContent = getInitials(name);
        }

        showDialog(userDialog);
    }

    // -----------------------------------------------------
    // 9. Request search and filters
    // -----------------------------------------------------

    const requestSearch = getElement("adminRequestSearch");
    const requestStatusFilter = getElement("adminRequestStatusFilter");
    const requestPriorityFilter = getElement("adminRequestPriorityFilter");

    const clearRequestFiltersButton = getElement("clearAdminRequestFilters");
    const requestsEmptyClearButton = getElement("adminRequestsEmptyClearButton");

    const requestsTableBody = getElement("adminRequestsTableBody");
    const requestsEmptyState = getElement("adminRequestsEmptyState");

    const requestResultMessage = getElement("adminRequestResultMessage");

    function filterRequests() {
        const query = normalise(requestSearch?.value);
        const selectedStatus = requestStatusFilter?.value || "all";
        const selectedPriority = requestPriorityFilter?.value || "all";

        let visibleCount = 0;

        getRequestRows().forEach((row) => {
            const searchText = normalise([
                row.dataset.title,
                row.dataset.category,
                row.dataset.requester,
                row.dataset.requestId,
                row.dataset.description
            ].join(" "));

            const searchMatches =
                !query || searchText.includes(query);

            const statusMatches =
                selectedStatus === "all" ||
                row.dataset.status === selectedStatus;

            const priorityMatches =
                selectedPriority === "all" ||
                row.dataset.priority === selectedPriority;

            const shouldShow =
                searchMatches && statusMatches && priorityMatches;

            row.hidden = !shouldShow;

            if (shouldShow) {
                visibleCount += 1;
            }
        });

        const total = getRequestRows().length;

        if (requestResultMessage) {
            requestResultMessage.textContent =
                `Showing ${visibleCount} of ${total} sample requests`;
        }

        if (requestsEmptyState) {
            requestsEmptyState.hidden = visibleCount !== 0;
        }

        if (requestsTableBody) {
            requestsTableBody.hidden = visibleCount === 0;
        }
    }

    function clearRequestFilters() {
        if (requestSearch) {
            requestSearch.value = "";
        }

        if (requestStatusFilter) {
            requestStatusFilter.value = "all";
        }

        if (requestPriorityFilter) {
            requestPriorityFilter.value = "all";
        }

        filterRequests();
    }

    if (requestSearch) {
        requestSearch.addEventListener("input", filterRequests);
    }

    if (requestStatusFilter) {
        requestStatusFilter.addEventListener("change", filterRequests);
    }

    if (requestPriorityFilter) {
        requestPriorityFilter.addEventListener("change", filterRequests);
    }

    if (clearRequestFiltersButton) {
        clearRequestFiltersButton.addEventListener("click", clearRequestFilters);
    }

    if (requestsEmptyClearButton) {
        requestsEmptyClearButton.addEventListener("click", clearRequestFilters);
    }

    // -----------------------------------------------------
    // 10. Request details dialog
    // -----------------------------------------------------

    const requestDialog = getElement("adminRequestDialog");

    connectDialogCloseButtons("adminRequestDialog", [
        "closeAdminRequestDialog",
        "closeAdminRequestDialogFooter"
    ]);

    function openRequestDetails(requestId) {
        const row = getRequestRows().find(
            (item) => item.dataset.requestId === requestId
        );

        if (!row) {
            return;
        }

        setText("adminDialogRequestId", `CC-REQ-${requestId.replace(/^demo-/, "")}`);
        setText("adminDialogRequestName", row.dataset.title || "Help Request");
        setText(
            "adminDialogRequestDescription",
            row.dataset.description || "No description available."
        );
        setText("adminDialogRequestCategory", formatCategory(row.dataset.category));
        setText("adminDialogRequestRequester", row.dataset.requester || "Not specified");
        setText("adminDialogRequestPriority", formatStatus(row.dataset.priority));
        setText("adminDialogRequestStatus", formatStatus(row.dataset.status));
        setText("adminDialogRequestDate", formatDate(row.dataset.date));

        showDialog(requestDialog);
    }

    // -----------------------------------------------------
    // 11. Verification review information dialog
    // -----------------------------------------------------

    const verificationDialog = getElement("adminVerificationDialog");

    connectDialogCloseButtons("adminVerificationDialog", [
        "closeAdminVerificationDialog",
        "closeAdminVerificationDialogFooter"
    ]);

    const verificationInfo = {
        "VER-DEMO-001": {
            applicant: "Meera Patil",
            type: "Special Care eligibility",
            status: "Pending review"
        },

        "VER-DEMO-002": {
            applicant: "Ramesh Kumar",
            type: "Age verification",
            status: "Pending review"
        },

        "VER-DEMO-003": {
            applicant: "Priya Sharma",
            type: "Caregiver relationship",
            status: "Pending review"
        }
    };

    function openVerificationDetails(verificationId) {
        const row = getVerificationRows().find(
            (item) => item.dataset.verificationId === verificationId
        );

        if (!row) {
            return;
        }

        const details = verificationInfo[verificationId];

        if (!details) {
            return;
        }

        setText("adminDialogVerificationApplicant", details.applicant);
        setText("adminDialogVerificationType", details.type);
        setText("adminDialogVerificationId", verificationId);
        setText("adminDialogVerificationStatus", details.status);

        showDialog(verificationDialog);
    }

    // -----------------------------------------------------
    // 12. Handle table actions using event delegation
    // -----------------------------------------------------

    document.addEventListener("click", (event) => {
        const target = event.target;

        if (!(target instanceof Element)) {
            return;
        }

        const userButton = target.closest("[data-user-action='view']");

        if (userButton) {
            openUserDetails(userButton.dataset.userId);
            return;
        }

        const requestButton = target.closest("[data-request-action='view']");

        if (requestButton) {
            openRequestDetails(requestButton.dataset.requestId);
            return;
        }

        const verificationButton = target.closest(
            "[data-verification-action='review']"
        );

        if (verificationButton) {
            openVerificationDetails(verificationButton.dataset.verificationId);
        }
    });

    // -----------------------------------------------------
    // 13. Refresh demo dashboard
    // -----------------------------------------------------

    const refreshButton = getElement("adminRefreshButton");

    if (refreshButton) {
        refreshButton.addEventListener("click", () => {
            updateDashboardDate();

            filterUsers();
            filterRequests();

            // Reset the visible demo data to the current HTML values.
            // No server request is made.
            refreshButton.setAttribute(
                "aria-label",
                "Dashboard refreshed using local demo data"
            );

            refreshButton.title = "Dashboard refreshed using local demo data";

            refreshButton.animate?.(
                [
                    { transform: "rotate(0deg)" },
                    { transform: "rotate(360deg)" }
                ],
                {
                    duration: 350,
                    easing: "ease-out"
                }
            );
        });
    }

    // -----------------------------------------------------
    // 14. Demo sign-out
    // -----------------------------------------------------

    const logoutButton = getElement("adminLogoutButton");

    if (logoutButton) {
        logoutButton.addEventListener("click", (event) => {
            event.preventDefault();

            const confirmed = window.confirm(
                "This is a demonstration dashboard. Administrator authentication " +
                "and session management are not connected yet.\n\n" +
                "Go to the CareCircle login page?"
            );

            if (confirmed) {
                window.location.href = "login.html";
            }
        });
    }

    // -----------------------------------------------------
    // 15. Initialize the page
    // -----------------------------------------------------

    filterUsers();
    filterRequests();

    // -----------------------------------------------------
    // 16. Optional developer interface
    // -----------------------------------------------------
    // These functions only update the current page's DOM.
    // They do not persist information or replace backend APIs.

    window.CareCircleAdminDashboard = {
        refreshDate: updateDashboardDate,

        filterUsers,
        clearUserFilters,

        filterRequests,
        clearRequestFilters,

        openUserDetails,
        openRequestDetails,
        openVerificationDetails,

        getDemoCounts() {
            return {
                users: getUserRows().length,
                requests: getRequestRows().length,
                verifications: getVerificationRows().length
            };
        }
    };
});
