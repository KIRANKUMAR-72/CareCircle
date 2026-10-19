
/* =========================================================
   CareCircle - Dashboard JavaScript
   File: frontend/js/dashboard.js

   Features:
   1. Mobile sidebar toggle
   2. Dashboard date
   3. Demo notice dismissal
   4. Real authenticated user information
   5. Dashboard statistics helper
   6. Notification indicator
   7. Backend logout
   8. Navigation highlighting
   9. Footer year
========================================================= */

"use strict";

const CARECIRCLE_API = `http://${window.location.hostname}:5000/api`;

document.addEventListener("DOMContentLoaded", initializeDashboard);

async function initializeDashboard() {
    initializeSidebar();
    initializeDashboardDate();
    initializeDemoNotice();
    initializeDashboardLinks();
    initializeFooterYear();

    // Load the authenticated user before showing private dashboard data.
    const user = await loadAuthenticatedUser();

    if (!user) {
        return;
    }

    displayAuthenticatedUser(user);
    initializeLogout();
    initializeNotifications();
}

/* =========================================================
   AUTHENTICATED USER
========================================================= */

async function loadAuthenticatedUser() {
    try {
        const response = await fetch(`${CARECIRCLE_API}/auth/me`, {
            method: "GET",
            credentials: "include",
            headers: {
                Accept: "application/json"
            }
        });

        if (response.status === 401) {
            window.location.replace("login.html");
            return null;
        }

        const data = await response.json();

        if (!response.ok || !data.success || !data.user) {
            showDashboardMessage(
                data.message || "Unable to load your account. Please log in again."
            );
            return null;
        }

        return data.user;
    } catch (error) {
        console.error("Unable to load CareCircle user:", error);

        showDashboardMessage(
            "Cannot connect to CareCircle. Please check that the backend is running."
        );

        return null;
    }
}

function displayAuthenticatedUser(user) {
    const fullName = user.fullName || "Community Member";
    const role = formatRole(user.role);
    const initials = getInitials(fullName);

    const sidebarAvatar = document.getElementById("sidebarAvatar");
    const sidebarUserName = document.getElementById("sidebarUserName");
    const sidebarUserRole = document.getElementById("sidebarUserRole");

    const topbarAvatar = document.getElementById("topbarAvatar");
    const topbarUserName = document.getElementById("topbarUserName");
    const welcomeUserName = document.getElementById("welcomeUserName");

    if (sidebarAvatar) {
        sidebarAvatar.textContent = initials;
        sidebarAvatar.setAttribute("aria-label", `${fullName}'s avatar`);
    }

    if (sidebarUserName) {
        sidebarUserName.textContent = fullName;
    }

    if (sidebarUserRole) {
        sidebarUserRole.textContent = role;
    }

    if (topbarAvatar) {
        topbarAvatar.textContent = initials;
        topbarAvatar.setAttribute("aria-label", `${fullName}'s avatar`);
    }

    if (topbarUserName) {
        topbarUserName.textContent = fullName;
    }

    if (welcomeUserName) {
        welcomeUserName.textContent = fullName;
    }

    // Populate optional profile elements if they exist in the HTML.
    setTextIfPresent("profileUserName", fullName);
    setTextIfPresent("profileUserEmail", user.email || "");
    setTextIfPresent("profileUserRole", role);
}

function formatRole(role) {
    const roleNames = {
        volunteer: "Volunteer",
        elderly: "Elderly Member",
        family: "Family Member",
        "special-care": "Special Care Member",
        admin: "Administrator"
    };

    return roleNames[role] || "Community Member";
}

function getInitials(fullName) {
    return fullName
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("") || "CC";
}

function setTextIfPresent(id, value) {
    const element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}

function showDashboardMessage(message) {
    let messageElement = document.getElementById("dashboardConnectionMessage");

    if (!messageElement) {
        messageElement = document.createElement("p");
        messageElement.id = "dashboardConnectionMessage";
        messageElement.setAttribute("role", "alert");

        const main = document.querySelector("main");

        if (main) {
            main.prepend(messageElement);
        } else {
            document.body.prepend(messageElement);
        }
    }

    messageElement.textContent = message;
}

/* =========================================================
   MOBILE SIDEBAR
========================================================= */

function initializeSidebar() {
    const sidebar = document.getElementById("dashboardSidebar");
    const sidebarToggle = document.getElementById("sidebarToggle");
    const overlay = document.getElementById("dashboardOverlay");

    if (!sidebar || !sidebarToggle || !overlay) {
        return;
    }

    function openSidebar() {
        sidebar.classList.add("open");
        overlay.classList.add("active");
        sidebarToggle.setAttribute("aria-expanded", "true");
        overlay.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function closeSidebar() {
        sidebar.classList.remove("open");
        overlay.classList.remove("active");
        sidebarToggle.setAttribute("aria-expanded", "false");
        overlay.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    sidebarToggle.addEventListener("click", () => {
        if (sidebar.classList.contains("open")) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    overlay.addEventListener("click", closeSidebar);

    sidebar.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            if (window.innerWidth <= 850) {
                closeSidebar();
            }
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeSidebar();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 850) {
            closeSidebar();
        }
    });
}

/* =========================================================
   DASHBOARD DATE
========================================================= */

function initializeDashboardDate() {
    const dateElement = document.getElementById("dashboardDate");

    if (!dateElement) {
        return;
    }

    dateElement.textContent = new Intl.DateTimeFormat("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    }).format(new Date());
}

/* =========================================================
   DEMO NOTICE
========================================================= */

function initializeDemoNotice() {
    const notice = document.getElementById("dashboardDemoNotice");
    const dismissButton = document.getElementById("dismissDemoNotice");

    if (!notice || !dismissButton) {
        return;
    }

    dismissButton.addEventListener("click", () => {
        notice.hidden = true;
    });
}

/* =========================================================
   DASHBOARD STATISTICS HELPER

   Real request and SocialCredits APIs will be connected later.
========================================================= */

function updateDashboardStatistics(statistics = {}) {
    const elements = {
        totalRequests: document.getElementById("totalRequests"),
        activeRequests: document.getElementById("activeRequests"),
        completedRequests: document.getElementById("completedRequests"),
        creditBalance: document.getElementById("creditBalance"),
        walletBalance: document.getElementById("walletBalance")
    };

    Object.entries(elements).forEach(([key, element]) => {
        if (
            element &&
            Object.prototype.hasOwnProperty.call(statistics, key)
        ) {
            const value = Number(statistics[key]);

            if (Number.isFinite(value) && value >= 0) {
                element.textContent = String(value);
            }
        }
    });

    const requestCount = document.getElementById("sidebarRequestCount");

    if (
        requestCount &&
        Object.prototype.hasOwnProperty.call(statistics, "totalRequests")
    ) {
        const total = Number(statistics.totalRequests);

        if (Number.isFinite(total) && total >= 0) {
            requestCount.textContent = String(total);
        }
    }
}

/* =========================================================
   NOTIFICATION INDICATOR
========================================================= */

function initializeNotifications() {
    const notificationDot = document.getElementById("notificationDot");

    if (!notificationDot) {
        return;
    }

    notificationDot.setAttribute(
        "aria-label",
        "Notifications are not connected yet"
    );
}

/* =========================================================
   LOGOUT
========================================================= */

function initializeLogout() {
    const logoutButton = document.getElementById("logoutButton");

    if (!logoutButton) {
        return;
    }

    logoutButton.addEventListener("click", async () => {
        const shouldLogout = window.confirm(
            "Are you sure you want to log out of CareCircle?"
        );

        if (!shouldLogout) {
            return;
        }

        logoutButton.disabled = true;

        try {
            const response = await fetch(`${CARECIRCLE_API}/auth/logout`, {
                method: "POST",
                credentials: "include",
                headers: {
                    Accept: "application/json"
                }
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Logout failed.");
            }

            window.location.replace("login.html");
        } catch (error) {
            console.error("CareCircle logout error:", error);

            alert(
                "Unable to log out from the server. Please check your connection and try again."
            );

            logoutButton.disabled = false;
        }
    });
}

/* =========================================================
   DASHBOARD NAVIGATION LINKS
========================================================= */

function initializeDashboardLinks() {
    const sidebarLinks = document.querySelectorAll(
        ".dashboard-sidebar a"
    );

    const currentPage = window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();

    sidebarLinks.forEach((link) => {
        const href = link.getAttribute("href");

        if (!href || href.startsWith("#")) {
            return;
        }

        const targetPage = href.split("/").pop().toLowerCase();

        if (targetPage === currentPage) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        } else {
            link.classList.remove("active");
            link.removeAttribute("aria-current");
        }
    });
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
