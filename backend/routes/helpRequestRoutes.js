
const express = require("express");
const mongoose = require("mongoose");
const HelpRequest = require("../models/HelpRequest");

const router = express.Router();

const VALID_CATEGORIES = [
    "groceries",
    "medicine",
    "hospital-assistance",
    "companionship",
    "digital-guidance",
    "documents",
    "everyday-support",
    "special-care",
    "other"
];

function requireLogin(req, res, next) {
    if (!req.session || !req.session.user) {
        return res.status(401).json({
            success: false,
            message: "Please log in to continue."
        });
    }

    next();
}

function requireRequesterRole(req, res, next) {
    const allowedRoles = ["elderly", "family", "special-care"];

    if (!allowedRoles.includes(req.session.user.role)) {
        return res.status(403).json({
            success: false,
            message: "Your account cannot create help requests."
        });
    }

    next();
}

function requireVolunteerRole(req, res, next) {
    if (req.session.user.role !== "volunteer") {
        return res.status(403).json({
            success: false,
            message: "Only volunteers can accept help requests."
        });
    }

    next();
}

// POST /api/requests
// Create a request on behalf of the logged-in requester.
router.post("/", requireLogin, requireRequesterRole, async (req, res) => {
    try {
        const { title, description, category, location, preferredDate } =
            req.body;

        if (
            typeof title !== "string" ||
            typeof description !== "string" ||
            typeof category !== "string" ||
            typeof location !== "string" ||
            !title.trim() ||
            !description.trim() ||
            !category.trim() ||
            !location.trim()
        ) {
            return res.status(400).json({
                success: false,
                message: "Please complete all required fields."
            });
        }

        if (title.trim().length < 5 || title.trim().length > 100) {
            return res.status(400).json({
                success: false,
                message: "The title must contain 5–100 characters."
            });
        }

        if (
            description.trim().length < 10 ||
            description.trim().length > 2000
        ) {
            return res.status(400).json({
                success: false,
                message: "The description must contain 10–2000 characters."
            });
        }

        if (location.trim().length > 200) {
            return res.status(400).json({
                success: false,
                message: "The location must not exceed 200 characters."
            });
        }

        if (!VALID_CATEGORIES.includes(category)) {
            return res.status(400).json({
                success: false,
                message: "Please select a valid help category."
            });
        }

        let parsedDate = null;

        if (preferredDate) {
            parsedDate = new Date(preferredDate);

            if (Number.isNaN(parsedDate.getTime())) {
                return res.status(400).json({
                    success: false,
                    message: "Please provide a valid preferred date."
                });
            }

            if (parsedDate.getTime() < Date.now()) {
                return res.status(400).json({
                    success: false,
                    message: "The preferred date cannot be in the past."
                });
            }
        }

        const helpRequest = await HelpRequest.create({
            requester: req.session.user.id,
            title: title.trim(),
            description: description.trim(),
            category,
            location: location.trim(),
            preferredDate: parsedDate
        });

        return res.status(201).json({
            success: true,
            message: "Your help request has been created.",
            request: helpRequest
        });
    } catch (error) {
        console.error("Create help request error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to create the help request."
        });
    }
});

// GET /api/requests/available
// Volunteers can browse requests that have not been accepted.
router.get(
    "/available",
    requireLogin,
    requireVolunteerRole,
    async (req, res) => {
        try {
            const requests = await HelpRequest.find({
                status: "pending",
                volunteer: null
            })
                .populate("requester", "fullName role")
                .sort({ createdAt: -1 })
                .lean();

            return res.status(200).json({
                success: true,
                count: requests.length,
                requests
            });
        } catch (error) {
            console.error("Available requests error:", error.message);

            return res.status(500).json({
                success: false,
                message: "Unable to load available help requests."
            });
        }
    }
);

// GET /api/requests/mine
// Show requests created by the logged-in user.
router.get("/mine", requireLogin, async (req, res) => {
    try {
        const requests = await HelpRequest.find({
            requester: req.session.user.id
        })
            .populate("volunteer", "fullName")
            .sort({ createdAt: -1 })
            .lean();

        return res.status(200).json({
            success: true,
            count: requests.length,
            requests
        });
    } catch (error) {
        console.error("My requests error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Unable to load your help requests."
        });
    }
});

// GET /api/requests/my-work
// Show requests accepted by the logged-in volunteer.
router.get(
    "/my-work",
    requireLogin,
    requireVolunteerRole,
    async (req, res) => {
        try {
            const requests = await HelpRequest.find({
                volunteer: req.session.user.id
            })
                .populate("requester", "fullName role")
                .sort({ updatedAt: -1 })
                .lean();

            return res.status(200).json({
                success: true,
                count: requests.length,
                requests
            });
        } catch (error) {
            console.error("Volunteer work error:", error.message);

            return res.status(500).json({
                success: false,
                message: "Unable to load your volunteer work."
            });
        }
    }
);

// PATCH /api/requests/:id/accept
// Atomically accept a pending request to prevent double claiming.
router.patch(
    "/:id/accept",
    requireLogin,
    requireVolunteerRole,
    async (req, res) => {
        try {
            const { id } = req.params;

            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid help request ID."
                });
            }

            const request = await HelpRequest.findOneAndUpdate(
                {
                    _id: id,
                    status: "pending",
                    volunteer: null
                },
                {
                    $set: {
                        volunteer: req.session.user.id,
                        status: "accepted"
                    }
                },
                {
                    new: true,
                    runValidators: true
                }
            )
                .populate("requester", "fullName role");

            if (!request) {
                return res.status(409).json({
                    success: false,
                    message: "This request is no longer available."
                });
            }

            return res.status(200).json({
                success: true,
                message: "Help request accepted successfully.",
                request
            });
        } catch (error) {
            console.error("Accept request error:", error.message);

            return res.status(500).json({
                success: false,
                message: "Unable to accept this help request."
            });
        }
    }
);

// PATCH /api/requests/:id/status
// Update the status of a request assigned to the logged-in volunteer.
router.patch(
    "/:id/status",
    requireLogin,
    requireVolunteerRole,
    async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid help request ID."
                });
            }

            if (!["in-progress", "completed"].includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid status transition."
                });
            }

            const allowedPreviousStatuses =
                status === "in-progress"
                    ? ["accepted"]
                    : ["in-progress"];

            const updates = { status };

            if (status === "completed") {
                updates.completedAt = new Date();
            }

            const request = await HelpRequest.findOneAndUpdate(
                {
                    _id: id,
                    volunteer: req.session.user.id,
                    status: { $in: allowedPreviousStatuses }
                },
                { $set: updates },
                {
                    new: true,
                    runValidators: true
                }
            );

            if (!request) {
                return res.status(409).json({
                    success: false,
                    message:
                        "The request was not found or its status cannot be changed this way."
                });
            }

            return res.status(200).json({
                success: true,
                message: `Request marked as ${status}.`,
                request
            });
        } catch (error) {
            console.error("Update request status error:", error.message);

            return res.status(500).json({
                success: false,
                message: "Unable to update the request status."
            });
        }
    }
);

module.exports = router;
