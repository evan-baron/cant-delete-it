const express = require("express");
const authService = require("../services/authService");
const { authenticateUser } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/login", async (req, res) => {
    const { email, password, checked } = req.body;

    try {
        const { user, token } = await authService.login(email, password, checked);

        res.cookie("session_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 60 * 60 * 1000, // 1 hour
        });

        res.status(201).json({
            message: "User logged in successfully!",
            user,
            token,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/logout", authenticateUser, (req, res) => {
    res.clearCookie("session_token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "Strict",
    });

    res.json({ message: "Logged out successfully" });
});

router.post("/register-account", async (req, res) => {
    const { first, last, email, password } = req.body;

    try {
        const { user } = await authService.register(first, last, email, password);
        res.status(201).json({
            message: "User registered successfully!",
            user,
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
