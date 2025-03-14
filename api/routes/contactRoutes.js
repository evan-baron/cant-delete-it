const express = require("express");
const router = express.Router();
const mailService = require('../services/mailService');

// ALL ROUTES SORTED ALPHABETICALLY

//contact
router.post('/contact', async (req, res) => {
	const { name, email, message } = req.body;

	try {
		await mailService.sendContactForm(name, email, message);
		return res.status(201).json({ message: 'Contact Us email sent' });
	} catch (err) {
		console.log('There was an error: ', err.message)
		return res.status(500).json({ message: 'Error sending password reset email' });
	}
});

module.exports = router;