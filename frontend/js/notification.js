
/* =========================================================
   CareCircle - Notifications Page
   File: frontend/js/notifications.js

   Features:
   1. Search notifications
   2. Filter by All, Unread, and Read
   3. Filter by notification category
   4. Mark individual notifications as read
   5. Mark all notifications as read
   6. Update notification statistics
   7. Show an empty state when no results match
   8. Clear filters
   9. Dismiss the demo notice
   10. Update the footer year

   IMPORTANT:
   Notifications are demonstration data stored in the HTML.
   Changes are temporary and are not saved to a backend.
   ========================================================= */

"use strict";

document.addEventListener("DOMContentLoaded", initializeNotifications);

function initializeNotifications() {
    // ---------------------------------------------------------
    // 1. Select page elements
    // ---------------------------------------------------------

    const notificationList = document.getElementById("notificationList");

    if (!notificationList) {
        return;
    }

    const notificationItems = Array.from(
        notificationList.querySelectorAll(".notification-item")
    );

    const filterButtons = document.querySelectorAll(
        "[data-notification-filter]"
    );

    const searchInput = document.getElementById("notificationSearch");
    const categoryFilter = document.getElementById(
        "notificationCategoryFilter"
    );

    const markAllReadButton = document.getElementById("markAllReadButton");
    const clearFiltersButton = document.getElementById(
        "clearNotificationFiltersButton"
    );

    const emptyState = document.getElementById("notificationEmptyState");
    const resultsLabel = document.getElementById("notificationResults");

    const totalCountElement = document.getElementById(
        "totalNotificationCount"
    );

    const unreadCountElement = document.getElementById(
        "unreadNotificationCount"
    );

    const requestCountElement = document.getElementById(
        "requestNotificationCount"
    );

    const allTabCountElement = document.getElementById("allTabCount");
    const unreadTabCountElement = document.getElementById("unreadTabCount");

    const demoNotice = document.getElementById("notificationDemoNotice");
    const dismissNoticeButton = document.getElementById(
        "dismissNotificationNotice"
    );

    const currentYearElement = document.getElementById("currentYear");

    // Current selected read status filter.
    let activeStatusFilter = "all";

    // ---------------------------------------------------------
    // 2. Notification read status
    // ---------------------------------------------------------

    function isNotificationRead(notification) {
        return notification.dataset.read === "true";
    }

    function setNotificationRead(notification, isRead) {
        notification.dataset.read = String(isRead);

        notification.classList.toggle("read", isRead);
        notification.classList.toggle("unread", !isRead);

        const unreadDot = notification.querySelector(
            ".notification-unread-dot"
        );

        if (unreadDot) {
            unreadDot.hidden = isRead;
        }

        const markReadButton = notification.querySelector(
            "[data-mark-read]"
        );

        if (markReadButton) {
            markReadButton.hidden = isRead;
        }
    }

    // Initialize read/unread visual states from the HTML.
    notificationItems.forEach(function (notification) {
        setNotificationRead(
            notification,
            isNotificationRead(notification)
        );
    });

    // ---------------------------------------------------------
    // 3. Calculate and display notification counts
    // ---------------------------------------------------------

    function updateNotificationStatistics() {
        const totalNotifications = notificationItems.length;

        const unreadNotifications = notificationItems.filter(
            function (notification) {
                return !isNotificationRead(notification);
            }
        ).length;

        const requestNotifications = notificationItems.filter(
            function (notification) {
                return notification.dataset.category === "request";
            }
        ).length;

        if (totalCountElement) {
            totalCountElement.textContent = totalNotifications;
        }

        if (unreadCountElement) {
            unreadCountElement.textContent = unreadNotifications;
        }

        if (requestCountElement) {
            requestCountElement.textContent = requestNotifications;
        }

        if (allTabCountElement) {
            allTabCountElement.textContent = totalNotifications;
        }

        if (unreadTabCountElement) {
            unreadTabCountElement.textContent = unreadNotifications;
        }

        updateMarkAllButton(unreadNotifications);
    }

    function updateMarkAllButton(unreadCount) {
        if (!markAllReadButton) {
            return;
        }

        const label = markAllReadButton.querySelector("span");

        if (unreadCount === 0) {
            markAllReadButton.disabled = true;
            markAllReadButton.setAttribute("aria-label", "All notifications are read");

            if (label) {
                label.textContent = "✓";
            }

            // Preserve the existing button layout and wording.
            markAllReadButton.innerHTML =
                '<span aria-hidden="true">✓</span> All caught up';
        } else {
            markAllReadButton.disabled = false;
            markAllReadButton.setAttribute(
                "aria-label",
                "Mark all notifications as read"
            );

            markAllReadButton.innerHTML =
                '<span aria-hidden="true">✓</span> Mark all as read';
        }
    }

    // ---------------------------------------------------------
    // 4. Search notifications
    // ---------------------------------------------------------

    function matchesSearch(notification, searchTerm) {
        if (!searchTerm) {
            return true;
        }

        const searchText = [
            notification.dataset.search || "",
            notification.textContent || "",
            notification.dataset.category || ""
        ].join(" ").toLowerCase();

        return searchText.includes(searchTerm);
    }

    // ---------------------------------------------------------
    // 5. Apply status and category filters
    // ---------------------------------------------------------

    function matchesStatus(notification) {
        const isRead = isNotificationRead(notification);

        if (activeStatusFilter === "unread") {
            return !isRead;
        }

        if (activeStatusFilter === "read") {
            return isRead;
        }

        return true;
    }

    function matchesCategory(notification) {
        if (!categoryFilter) {
            return true;
        }

        const selectedCategory = categoryFilter.value;

        if (selectedCategory === "all") {
            return true;
        }

        return notification.dataset.category === selectedCategory;
    }

    // ---------------------------------------------------------
    // 6. Render filtered notification results
    // ---------------------------------------------------------

    function renderNotifications() {
        const searchTerm = searchInput
            ? searchInput.value.trim().toLowerCase()
            : "";

        let visibleCount = 0;

        notificationItems.forEach(function (notification) {
            const shouldShow =
                matchesSearch(notification, searchTerm) &&
                matchesStatus(notification) &&
                matchesCategory(notification);

            notification.hidden = !shouldShow;

            if (shouldShow) {
                visibleCount++;
            }
        });

        if (resultsLabel) {
            resultsLabel.textContent =
                "Showing " + visibleCount +
                (visibleCount === 1 ? " notification" : " notifications");
        }

        if (emptyState) {
            emptyState.hidden = visibleCount !== 0;
        }

        if (notificationList) {
            notificationList.hidden = visibleCount === 0;
        }

        updateNotificationStatistics();
    }

    // ---------------------------------------------------------
    // 7. Activate All / Unread / Read tabs
    // ---------------------------------------------------------

    function activateStatusFilter(filter) {
        activeStatusFilter = filter;

        filterButtons.forEach(function (button) {
            const isActive =
                button.dataset.notificationFilter === filter;

            button.classList.toggle("active", isActive);
            button.setAttribute("aria-pressed", String(isActive));
        });

        renderNotifications();
    }

    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            activateStatusFilter(
                button.dataset.notificationFilter || "all"
            );
        });
    });

    // ---------------------------------------------------------
    // 8. Mark one notification as read
    // ---------------------------------------------------------

    notificationList.addEventListener("click", function (event) {
        const markReadButton = event.target.closest("[data-mark-read]");

        if (!markReadButton) {
            return;
        }

        const notification = markReadButton.closest(".notification-item");

        if (!notification) {
            return;
        }

        setNotificationRead(notification, true);

        renderNotifications();
    });

    // ---------------------------------------------------------
    // 9. Mark all notifications as read
    // ---------------------------------------------------------

    if (markAllReadButton) {
        markAllReadButton.addEventListener("click", function () {
            notificationItems.forEach(function (notification) {
                setNotificationRead(notification, true);
            });

            renderNotifications();
        });
    }

    // ---------------------------------------------------------
    // 10. Search and category events
    // ---------------------------------------------------------

    if (searchInput) {
        searchInput.addEventListener("input", renderNotifications);
    }

    if (categoryFilter) {
        categoryFilter.addEventListener("change", renderNotifications);
    }

    // ---------------------------------------------------------
    // 11. Clear all filters
    // ---------------------------------------------------------

    function clearNotificationFilters() {
        if (searchInput) {
            searchInput.value = "";
        }

        if (categoryFilter) {
            categoryFilter.value = "all";
        }

        activateStatusFilter("all");
    }

    if (clearFiltersButton) {
        clearFiltersButton.addEventListener(
            "click",
            clearNotificationFilters
        );
    }

    // ---------------------------------------------------------
    // 12. Dismiss the demonstration notice
    // ---------------------------------------------------------

    if (dismissNoticeButton && demoNotice) {
        dismissNoticeButton.addEventListener("click", function () {
            demoNotice.hidden = true;
        });
    }

    // ---------------------------------------------------------
    // 13. Update footer year
    // ---------------------------------------------------------

    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // ---------------------------------------------------------
    // 14. Initial page rendering
    // ---------------------------------------------------------

    activateStatusFilter("all");
}
