const express = require("express");
const userService = require("../services/userService");
const mailService = require("../services/mailService");

const router = express.Router();

router.post("/check-email", async (req, res) => {
    const { email } = req.body;

    try {
        const user = await userService.getUserByEmail(email);
        if (!user) {
            return res.status(200).json({ available: true });
        }
        return res.status(404).json({ available: false, message: "Email already in use" });
    } catch (err) {
        return res.status(500).json({ message: "Error checking email" });
    }
});

router.post("/recover-password", async (req, res) => {
    const { email, tokenName } = req.body;

    try {
        const user = await userService.getUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const recoveryToken = await userService.generateToken(user.id, tokenName);
        await mailService.sendPasswordResetEmail(user, recoveryToken);

        res.status(201).json({ message: "User found, recovery email sent!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/reset-password", async (req, res) => {
    const { password, token } = req.body;

    if (!token) {
        return res.status(400).json({ message: "Reset token is required." });
    }

    try {
        await userService.updatePassword(password, token);
        res.status(201).json({ message: "Password updated!" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
