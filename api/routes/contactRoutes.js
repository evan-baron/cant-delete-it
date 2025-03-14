const express = require("express");
const mailService = require("../services/mailService");

const router = express.Router();

router.post("/contact", async (req, res) => {
    const { name, email, message } = req.body;

    try {
        await mailService.sendContactForm(name, email, message);
        return res.status(201).json({ message: "Contact Us email sent" });
    } catch (err) {
        return res.status(500).json({ message: "Error sending contact email" });
    }
});

module.exports = router;
