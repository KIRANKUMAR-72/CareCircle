
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

const router = express.Router();

// ==========================================
// POST /api/auth/register
// Create a new CareCircle account
// ==========================================
router.post("/register", async (req, res) => {
    try {
        const { fullName, email, phone, password, role } = req.body;

        if (!fullName || !email || !password || !role) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all required fields."
            });
        }

        const normalizedName = fullName.trim();
        const normalizedEmail = email.trim().toLowerCase();

        if (normalizedName.length < 2 || normalizedName.length > 80) {
            return res.status(400).json({
                success: false,
                message: "Name must contain between 2 and 80 characters."
            });
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid email address."
            });
        }

        if (
            typeof password !== "string" ||
            password.length < 8 ||
            password.length > 128
        ) {
            return res.status(400).json({
                success: false,
                message: "Password must contain between 8 and 128 characters."
            });
        }

        const allowedRoles = [
            "volunteer",
            "elderly",
            "family",
            "special-care"
        ];

        if (!allowedRoles.includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Please select a valid account role."
            });
        }

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            fullName: normalizedName,
            email: normalizedEmail,
            phone: typeof phone === "string" ? phone.trim() : "",
            password: hashedPassword,
            role
        });

        return res.status(201).json({
            success: true,
            message: "Registration successful. You can now log in.",
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "An account with this email already exists."
            });
        }

        console.error("Registration error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Registration failed. Please try again later."
        });
    }
});

// ==========================================
// POST /api/auth/login
// Authenticate an existing user
// ==========================================
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (
            typeof email !== "string" ||
            typeof password !== "string" ||
            !email.trim() ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "Please enter your email and password."
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Password is excluded by default in the User model,
        // so explicitly include it for password verification.
        const user = await User.findOne({
            email: normalizedEmail
        }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const passwordMatches = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        // Regenerate the session after successful authentication.
        req.session.regenerate((sessionError) => {
            if (sessionError) {
                console.error("Session error:", sessionError.message);

                return res.status(500).json({
                    success: false,
                    message: "Unable to start your session. Please try again."
                });
            }

            req.session.user = {
                id: user._id.toString(),
                fullName: user.fullName,
                email: user.email,
                role: user.role
            };

            req.session.save((saveError) => {
                if (saveError) {
                    console.error("Session save error:", saveError.message);

                    return res.status(500).json({
                        success: false,
                        message: "Unable to save your login session."
                    });
                }

                return res.status(200).json({
                    success: true,
                    message: "Login successful!",
                    user: {
                        id: user._id,
                        fullName: user.fullName,
                        email: user.email,
                        role: user.role
                    }
                });
            });
        });
    } catch (error) {
        console.error("Login error:", error.message);

        return res.status(500).json({
            success: false,
            message: "Login failed. Please try again later."
        });
    }
});

// ==========================================
// GET /api/auth/me
// Check the current login session
// ==========================================
router.get("/me", (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            success: false,
            message: "You are not logged in."
        });
    }

    return res.status(200).json({
        success: true,
        user: req.session.user
    });
});

// ==========================================
// POST /api/auth/logout
// End the current login session
// ==========================================
router.post("/logout", (req, res) => {
    if (!req.session) {
        return res.status(200).json({
            success: true,
            message: "You are logged out."
        });
    }

    req.session.destroy((error) => {
        if (error) {
            console.error("Logout error:", error.message);

            return res.status(500).json({
                success: false,
                message: "Unable to log out. Please try again."
            });
        }

        res.clearCookie("carecircle.sid", {
            httpOnly: true,
            secure: false,
            sameSite: "lax"
        });

        return res.status(200).json({
            success: true,
            message: "You have logged out successfully."
        });
    });
});

module.exports = router;
