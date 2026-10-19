
// =========================================================
// CARECIRCLE — SOCIALCREDITS WALLET
// File: frontend/js/wallet.js
// =========================================================

"use strict";

document.addEventListener("DOMContentLoaded", initializeWallet);

// ---------------------------------------------------------
// 1. INITIALIZE WALLET
// ---------------------------------------------------------

function initializeWallet() {
    updateWalletFooterYear();
    setupWalletDemoNotice();
    setupWalletFilters();
    updateWalletTransactionResults();
}

// ---------------------------------------------------------
// 2. SETUP FILTERS AND SEARCH
// ---------------------------------------------------------

function setupWalletFilters() {
    const searchInput = document.getElementById("walletSearch");
    const typeFilter = document.getElementById("walletTypeFilter");
    const sortFilter = document.getElementById("walletSortFilter");
    const clearButton = document.getElementById("clearWalletFilters");
    const emptyClearButton = document.getElementById("walletEmptyClearButton");

    if (searchInput) {
        searchInput.addEventListener("input", updateWalletTransactionResults);
    }

    if (typeFilter) {
        typeFilter.addEventListener("change", updateWalletTransactionResults);
    }

    if (sortFilter) {
        sortFilter.addEventListener("change", updateWalletTransactionResults);
    }

    if (clearButton) {
        clearButton.addEventListener("click", clearWalletFilters);
    }

    if (emptyClearButton) {
        emptyClearButton.addEventListener("click", clearWalletFilters);
    }
}

// ---------------------------------------------------------
// 3. FILTER, SEARCH AND SORT TRANSACTIONS
// ---------------------------------------------------------

function updateWalletTransactionResults() {
    const transactionContainer = document.getElementById("walletTransactions");
    const resultCount = document.getElementById("walletResultCount");
    const resultLabel = document.getElementById("walletResultLabel");
    const emptyState = document.getElementById("walletEmptyState");

    const searchInput = document.getElementById("walletSearch");
    const typeFilter = document.getElementById("walletTypeFilter");
    const sortFilter = document.getElementById("walletSortFilter");

    if (!transactionContainer) {
        return;
    }

    const allTransactions = Array.from(
        transactionContainer.querySelectorAll(".wallet-transaction")
    );

    const searchTerm = searchInput
        ? searchInput.value.trim().toLowerCase()
        : "";

    const selectedType = typeFilter
        ? typeFilter.value
        : "all";

    const selectedSort = sortFilter
        ? sortFilter.value
        : "newest";

    // Filter transactions using their data attributes.
    const filteredTransactions = allTransactions.filter(function (transaction) {
        const transactionType = transaction.dataset.type || "";
        const transactionId = transaction.dataset.id || "";
        const transactionDate = transaction.dataset.date || "";

        const transactionTitle =
            transaction.querySelector(".transaction-details h3")?.textContent || "";

        const transactionDescription =
            transaction.querySelector(".transaction-details > p")?.textContent || "";

        const searchableText = [
            transactionId,
            transactionTitle,
            transactionDescription,
            transaction.dataset.search || "",
            transactionType,
            transactionDate
        ].join(" ").toLowerCase();

        const matchesSearch = searchableText.includes(searchTerm);

        const matchesType =
            selectedType === "all" ||
            transactionType === selectedType;

        return matchesSearch && matchesType;
    });

    // Sort by transaction date.
    filteredTransactions.sort(function (a, b) {
        const dateA = getTransactionDate(a);
        const dateB = getTransactionDate(b);

        if (selectedSort === "oldest") {
            return dateA - dateB;
        }

        return dateB - dateA;
    });

    // Hide all cards first, then show and order the matching cards.
    allTransactions.forEach(function (transaction) {
        transaction.hidden = true;
    });

    filteredTransactions.forEach(function (transaction) {
        transaction.hidden = false;
        transactionContainer.appendChild(transaction);
    });

    // Update the result count.
    const count = filteredTransactions.length;

    if (resultCount) {
        resultCount.textContent = count;
    }

    if (resultLabel) {
        resultLabel.textContent =
            count === 1 ? "transaction" : "transactions";
    }

    // Show the empty state when no transactions match.
    if (emptyState) {
        emptyState.hidden = count !== 0;
    }

    transactionContainer.hidden = count === 0;
}

// ---------------------------------------------------------
// 4. READ TRANSACTION DATE
// ---------------------------------------------------------

function getTransactionDate(transaction) {
    const dateValue = transaction.dataset.date || "";
    const timestamp = Date.parse(`${dateValue}T12:00:00`);

    return Number.isNaN(timestamp) ? 0 : timestamp;
}

// ---------------------------------------------------------
// 5. CLEAR FILTERS
// ---------------------------------------------------------

function clearWalletFilters() {
    const searchInput = document.getElementById("walletSearch");
    const typeFilter = document.getElementById("walletTypeFilter");
    const sortFilter = document.getElementById("walletSortFilter");

    if (searchInput) {
        searchInput.value = "";
    }

    if (typeFilter) {
        typeFilter.value = "all";
    }

    if (sortFilter) {
        sortFilter.value = "newest";
    }

    updateWalletTransactionResults();

    if (searchInput) {
        searchInput.focus();
    }
}

// ---------------------------------------------------------
// 6. DISMISS DEMO NOTICE
// ---------------------------------------------------------

function setupWalletDemoNotice() {
    const notice = document.getElementById("walletDemoNotice");
    const dismissButton = document.getElementById("dismissWalletNotice");

    if (!notice || !dismissButton) {
        return;
    }

    dismissButton.addEventListener("click", function () {
        notice.hidden = true;
    });
}

// ---------------------------------------------------------
// 7. UPDATE FOOTER YEAR
// ---------------------------------------------------------

function updateWalletFooterYear() {
    const yearElement = document.getElementById("currentYear");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}
