
const mongoose = require("mongoose");

const helpRequestSchema = new mongoose.Schema(
    {
        requester: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true
        },

        volunteer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
            index: true
        },

        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 5,
            maxlength: 100
        },

        description: {
            type: String,
            required: true,
            trim: true,
            minlength: 10,
            maxlength: 2000
        },

        category: {
            type: String,
            required: true,
            enum: [
                "groceries",
                "medicine",
                "hospital-assistance",
                "companionship",
                "digital-guidance",
                "documents",
                "everyday-support",
                "special-care",
                "other"
            ]
        },

        location: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200
        },

        preferredDate: {
            type: Date,
            default: null
        },

        status: {
            type: String,
            enum: [
                "pending",
                "accepted",
                "in-progress",
                "completed",
                "cancelled"
            ],
            default: "pending",
            index: true
        },

        creditsAwarded: {
            type: Number,
            default: 0,
            min: 0
        },

        completedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

// Efficiently retrieve requests created by a user.
helpRequestSchema.index({
    requester: 1,
    status: 1,
    createdAt: -1
});

// Efficiently retrieve requests accepted by a volunteer.
helpRequestSchema.index({
    volunteer: 1,
    status: 1,
    createdAt: -1
});

module.exports = mongoose.model("HelpRequest", helpRequestSchema);
