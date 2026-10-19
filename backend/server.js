
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

const helpRequestRoutes = require("./routes/helpRequestRoutes");

// Allow requests from your local Live Server frontend.
app.use(
    cors({
        origin: [
            "http://127.0.0.1:5500",
            "http://localhost:5500"
        ],
        credentials: true
    })
);

// Parse incoming request data.
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configure login sessions.
app.use(
    session({
        name: "carecircle.sid",
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 1000 * 60 * 60 * 24
        }
    })
);

// Backend health check.
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "CareCircle backend is running!"
    });
});

// Authentication routes.
app.use("/api/auth", authRoutes);
app.use("/api/requests", helpRequestRoutes);

// Start only after MongoDB connects.
async function startServer() {
    try {
        if (!process.env.SESSION_SECRET) {
            throw new Error("SESSION_SECRET is missing from the .env file.");
        }

        await connectDB();

        app.listen(PORT, () => {
            console.log(`CareCircle backend: http://localhost:${PORT}`);
            console.log("Registration endpoint: POST /api/auth/register");
            console.log("Login sessions are configured.");
        });
    } catch (error) {
        console.error("Unable to start CareCircle:", error.message);
        process.exit(1);
    }
}

startServer();
