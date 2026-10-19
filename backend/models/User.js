
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 80
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            maxlength: 254
        },

        phone: {
            type: String,
            trim: true,
            default: ""
        },

        password: {
            type: String,
            required: true,
            select: false
        },

        role: {
            type: String,
            required: true,
            enum: ["volunteer", "elderly", "family", "special-care"]
        },

        isVerified: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);
