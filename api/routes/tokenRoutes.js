const express = require("express");
const jwt = require("jsonwebtoken");
const dayjs = require("dayjs");
const userService = require("../services/userService");

const router = express.Router();

router.get("/authenticate", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1] || req.cookies.session_token;

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userService.getUserById(decoded.userId);
        return res.json(user);
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
});

router.get("/authenticateRecoveryToken", async (req, res) => {
    const { token } = req.query;

    if (!token) {
        return res.status(400).json({ message: "Recovery token is required." });
    }

    try {
        const tokenData = await userService.getTokenData(token);
        const tokenCreatedAt = tokenData.created_at;
        const expiresAt = dayjs(tokenCreatedAt).add(30, "minute").toDate();
        const difference = Math.floor(dayjs(expiresAt).diff(dayjs(), "second"));

        const isValid = difference > 0 && difference < 1800 && tokenData.token_used !== 1;
        return res.json({ email: tokenData.user_email, tokenValid: isValid, timeRemaining: isValid ? difference : 0 });
    } catch (err) {
        return res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
