
// ============================================================
// CareCircle - Community Reviews
// File: frontend/js/reviews.js
// Frontend demonstration only - no backend connection
// ============================================================

"use strict";

document.addEventListener("DOMContentLoaded", initializeReviews);

function initializeReviews() {
    const reviewsGrid = document.getElementById("reviewsGrid");
    const reviewCards = Array.from(
        document.querySelectorAll(".community-review-card")
    );

    const searchInput = document.getElementById("reviewSearch");
    const categoryFilter = document.getElementById("reviewCategoryFilter");
    const ratingFilter = document.getElementById("reviewRatingFilter");
    const sortFilter = document.getElementById("reviewSortFilter");
    const clearFiltersButton = document.getElementById("clearReviewFiltersButton");
    const emptyClearButton = document.getElementById("emptyReviewClearButton");

    const resultCount = document.getElementById("reviewResultCount");
    const resultLabel = document.getElementById("reviewResultLabel");
    const totalCount = document.getElementById("reviewTotalCount");
    const emptyState = document.getElementById("reviewsEmptyState");

    const reviewForm = document.getElementById("reviewForm");
    const reviewerName = document.getElementById("reviewerName");
    const reviewService = document.getElementById("reviewService");
    const reviewTitle = document.getElementById("reviewTitle");
    const reviewComment = document.getElementById("reviewComment");
    const reviewConsent = document.getElementById("reviewConsent");
    const reviewCharacterCount = document.getElementById("reviewCharacterCount");
    const ratingHelpText = document.getElementById("ratingHelpText");
    const reviewFormMessage = document.getElementById("reviewFormMessage");
    const submitReviewButton = document.getElementById("submitReviewButton");

    const demoNotice = document.getElementById("reviewsDemoNotice");
    const dismissNoticeButton = document.getElementById("dismissReviewsNotice");

    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // --------------------------------------------------------
    // Review data and filtering
    // --------------------------------------------------------

    if (totalCount) {
        totalCount.textContent = reviewCards.length;
    }

    function getSelectedRating() {
        const selectedRating = document.querySelector(
            'input[name="reviewRating"]:checked'
        );

        return selectedRating ? selectedRating.value : "";
    }

    function normalizeText(value) {
        return String(value || "").trim().toLowerCase();
    }

    function getReviewDate(card) {
        const date = new Date(card.dataset.date + "T00:00:00");

        return Number.isNaN(date.getTime()) ? 0 : date.getTime();
    }

    function sortReviews(cards) {
        const sortValue = sortFilter ? sortFilter.value : "newest";

        return cards.sort((firstCard, secondCard) => {
            const firstDate = getReviewDate(firstCard);
            const secondDate = getReviewDate(secondCard);

            const firstRating = Number(firstCard.dataset.rating) || 0;
            const secondRating = Number(secondCard.dataset.rating) || 0;

            switch (sortValue) {
                case "oldest":
                    return firstDate - secondDate;

                case "highest":
                    return secondRating - firstRating || secondDate - firstDate;

                case "lowest":
                    return firstRating - secondRating || secondDate - firstDate;

                case "newest":
                default:
                    return secondDate - firstDate;
            }
        });
    }

    function reviewMatchesFilters(card) {
        const searchTerm = normalizeText(searchInput ? searchInput.value : "");
        const selectedCategory = categoryFilter
            ? categoryFilter.value
            : "all";
        const selectedRating = ratingFilter
            ? ratingFilter.value
            : "all";

        const searchableText = normalizeText(
            (card.dataset.search || "") + " " + card.textContent
        );

        const matchesSearch =
            !searchTerm || searchableText.includes(searchTerm);

        const matchesCategory =
            selectedCategory === "all" ||
            card.dataset.category === selectedCategory;

        const matchesRating =
            selectedRating === "all" ||
            card.dataset.rating === selectedRating;

        return matchesSearch && matchesCategory && matchesRating;
    }

    function updateReviewResults() {
        if (!reviewsGrid || !emptyState) {
            return;
        }

        const matchingCards = reviewCards.filter(reviewMatchesFilters);
        const sortedCards = sortReviews(matchingCards);

        // Reorder the original cards according to the selected sort option.
        sortedCards.forEach((card) => {
            reviewsGrid.appendChild(card);
        });

        // Hide cards that do not match the selected filters.
        reviewCards.forEach((card) => {
            card.hidden = !matchingCards.includes(card);
        });

        const visibleCount = matchingCards.length;

        if (resultCount) {
            resultCount.textContent = visibleCount;
        }

        if (resultLabel) {
            resultLabel.textContent =
                visibleCount === 1 ? "review" : "reviews";
        }

        if (totalCount) {
            totalCount.textContent = reviewCards.length;
        }

        emptyState.hidden = visibleCount !== 0;
        reviewsGrid.hidden = visibleCount === 0;
    }

    function clearReviewFilters() {
        if (searchInput) {
            searchInput.value = "";
        }

        if (categoryFilter) {
            categoryFilter.value = "all";
        }

        if (ratingFilter) {
            ratingFilter.value = "all";
        }

        if (sortFilter) {
            sortFilter.value = "newest";
        }

        updateReviewResults();
    }

    if (searchInput) {
        searchInput.addEventListener("input", updateReviewResults);
    }

    if (categoryFilter) {
        categoryFilter.addEventListener("change", updateReviewResults);
    }

    if (ratingFilter) {
        ratingFilter.addEventListener("change", updateReviewResults);
    }

    if (sortFilter) {
        sortFilter.addEventListener("change", updateReviewResults);
    }

    if (clearFiltersButton) {
        clearFiltersButton.addEventListener("click", clearReviewFilters);
    }

    if (emptyClearButton) {
        emptyClearButton.addEventListener("click", clearReviewFilters);
    }

    // --------------------------------------------------------
    // Demonstration notice
    // --------------------------------------------------------

    if (dismissNoticeButton && demoNotice) {
        dismissNoticeButton.addEventListener("click", () => {
            demoNotice.hidden = true;
        });
    }

    // --------------------------------------------------------
    // Star rating selector
    // --------------------------------------------------------

    const ratingInputs = Array.from(
        document.querySelectorAll('input[name="reviewRating"]')
    );

    const ratingDescriptions = {
        1: "1 star - Needs significant improvement",
        2: "2 stars - Could be better",
        3: "3 stars - A satisfactory experience",
        4: "4 stars - A very good experience",
        5: "5 stars - An excellent experience"
    };

    function updateStarSelection() {
        const selectedRating = getSelectedRating();

        if (ratingHelpText) {
            ratingHelpText.textContent = selectedRating
                ? ratingDescriptions[selectedRating]
                : "Select a rating.";
        }

        clearFieldError("reviewRatingError");
    }

    ratingInputs.forEach((input) => {
        input.addEventListener("change", updateStarSelection);
    });

    // --------------------------------------------------------
    // Character counter
    // --------------------------------------------------------

    function updateCharacterCount() {
        if (!reviewComment || !reviewCharacterCount) {
            return;
        }

        const currentLength = reviewComment.value.length;
        const maxLength = Number(reviewComment.maxLength) || 1000;

        reviewCharacterCount.textContent =
            `${currentLength} / ${maxLength}`;

        reviewCharacterCount.style.color =
            currentLength >= maxLength * 0.9 ? "#a66b18" : "";
    }

    if (reviewComment) {
        reviewComment.addEventListener("input", () => {
            updateCharacterCount();
            clearFieldError("reviewCommentError");
        });
    }

    updateCharacterCount();

    // --------------------------------------------------------
    // Form validation helpers
    // --------------------------------------------------------

    function setFieldError(fieldId, errorId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(errorId);

        if (field) {
            field.setAttribute("aria-invalid", "true");
        }

        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    function clearFieldError(errorId) {
        const errorElement = document.getElementById(errorId);

        if (errorElement) {
            errorElement.textContent = "";
        }

        const fieldMap = {
            reviewerNameError: "reviewerName",
            reviewServiceError: "reviewService",
            reviewRatingError: null,
            reviewTitleError: "reviewTitle",
            reviewCommentError: "reviewComment",
            reviewConsentError: "reviewConsent"
        };

        const fieldId = fieldMap[errorId];

        if (fieldId) {
            const field = document.getElementById(fieldId);

            if (field) {
                field.removeAttribute("aria-invalid");
            }
        }

        if (errorId === "reviewRatingError") {
            ratingInputs.forEach((input) => {
                input.removeAttribute("aria-invalid");
            });
        }

        if (errorId === "reviewConsentError" && reviewConsent) {
            reviewConsent.removeAttribute("aria-invalid");
        }
    }

    function clearAllFieldErrors() {
        [
            "reviewerNameError",
            "reviewServiceError",
            "reviewRatingError",
            "reviewTitleError",
            "reviewCommentError",
            "reviewConsentError"
        ].forEach(clearFieldError);
    }

    function showFormMessage(message, type) {
        if (!reviewFormMessage) {
            return;
        }

        reviewFormMessage.textContent = message;
        reviewFormMessage.className = "review-form-message " + type;
        reviewFormMessage.hidden = false;
    }

    function hideFormMessage() {
        if (!reviewFormMessage) {
            return;
        }

        reviewFormMessage.textContent = "";
        reviewFormMessage.className = "review-form-message";
        reviewFormMessage.hidden = true;
    }

    function validateReviewForm() {
        clearAllFieldErrors();
        hideFormMessage();

        let isValid = true;
        let firstInvalidField = null;

        function markInvalid(fieldId, errorId, message) {
            setFieldError(fieldId, errorId, message);
            isValid = false;

            if (!firstInvalidField) {
                firstInvalidField = document.getElementById(fieldId);
            }
        }

        const nameValue = reviewerName
            ? reviewerName.value.trim()
            : "";

        const serviceValue = reviewService
            ? reviewService.value
            : "";

        const titleValue = reviewTitle
            ? reviewTitle.value.trim()
            : "";

        const commentValue = reviewComment
            ? reviewComment.value.trim()
            : "";

        const selectedRating = getSelectedRating();

        // Name
        if (nameValue.length < 2) {
            markInvalid(
                "reviewerName",
                "reviewerNameError",
                "Please enter a name containing at least 2 characters."
            );
        } else if (nameValue.length > 80) {
            markInvalid(
                "reviewerName",
                "reviewerNameError",
                "Your name cannot exceed 80 characters."
            );
        }

        // Service
        if (!serviceValue) {
            markInvalid(
                "reviewService",
                "reviewServiceError",
                "Please choose the service you are reviewing."
            );
        }

        // Rating
        if (!selectedRating) {
            const ratingError = document.getElementById("reviewRatingError");

            if (ratingError) {
                ratingError.textContent = "Please select a star rating.";
            }

            ratingInputs.forEach((input) => {
                input.setAttribute("aria-invalid", "true");
            });

            isValid = false;

            if (!firstInvalidField && ratingInputs.length > 0) {
                firstInvalidField = ratingInputs[0];
            }
        }

        // Review title
        if (titleValue.length < 4) {
            markInvalid(
                "reviewTitle",
                "reviewTitleError",
                "Please enter a title containing at least 4 characters."
            );
        } else if (titleValue.length > 100) {
            markInvalid(
                "reviewTitle",
                "reviewTitleError",
                "The title cannot exceed 100 characters."
            );
        }

        // Review text
        if (commentValue.length < 20) {
            markInvalid(
                "reviewComment",
                "reviewCommentError",
                "Please write at least 20 characters about your experience."
            );
        } else if (commentValue.length > 1000) {
            markInvalid(
                "reviewComment",
                "reviewCommentError",
                "Your review cannot exceed 1000 characters."
            );
        }

        // Consent
        if (!reviewConsent || !reviewConsent.checked) {
            markInvalid(
                "reviewConsent",
                "reviewConsentError",
                "Please confirm that your review respects others' privacy."
            );
        }

        if (!isValid && firstInvalidField) {
            firstInvalidField.focus();
        }

        return isValid;
    }

    // --------------------------------------------------------
    // Review form submission
    // --------------------------------------------------------

    if (reviewForm) {
        reviewForm.addEventListener("submit", (event) => {
            event.preventDefault();

            if (!validateReviewForm()) {
                showFormMessage(
                    "Please check the highlighted fields and correct the errors.",
                    "error"
                );

                return;
            }

            /*
             * Frontend demonstration only.
             *
             * This form does not submit to a server, publish a review,
             * or save anything to MongoDB or local storage.
             *
             * When the backend is ready, replace this demonstration
             * handler with a request to the authenticated reviews API.
             */

            const demoReview = {
                reviewerName: reviewerName.value.trim(),
                service: reviewService.value,
                rating: Number(getSelectedRating()),
                title: reviewTitle.value.trim(),
                comment: reviewComment.value.trim(),
                submittedAt: new Date().toISOString()
            };

            // Useful for local development; no data is persisted.
            console.info(
                "CareCircle review form demonstration. Not saved:",
                demoReview
            );

            showFormMessage(
                "Your form passed validation! This is a frontend demonstration, " +
                "so your review has not been published or saved. Backend " +
                "integration is required to submit a real review.",
                "success"
            );

            // Keep the form available so the user can inspect or edit it.
        });
    }

    // --------------------------------------------------------
    // Clear individual validation errors as users edit fields
    // --------------------------------------------------------

    const fieldErrorPairs = [
        ["reviewerName", "reviewerNameError"],
        ["reviewService", "reviewServiceError"],
        ["reviewTitle", "reviewTitleError"]
    ];

    fieldErrorPairs.forEach(([fieldId, errorId]) => {
        const field = document.getElementById(fieldId);

        if (!field) {
            return;
        }

        field.addEventListener("input", () => {
            clearFieldError(errorId);
        });

        field.addEventListener("change", () => {
            clearFieldError(errorId);
        });
    });

    if (reviewConsent) {
        reviewConsent.addEventListener("change", () => {
            clearFieldError("reviewConsentError");
        });
    }

    // --------------------------------------------------------
    // Initial rendering
    // --------------------------------------------------------

    updateReviewResults();

    // Optional interface API for future backend integration.
    window.CareCircleReviews = {
        refresh: updateReviewResults,
        clearFilters: clearReviewFilters,
        getSelectedRating
    };
}
