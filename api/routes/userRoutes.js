const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const mailService = require('../services/mailService');

// ALL ROUTES SORTED ALPHABETICALLY

//user
router.post('/check-email', async (req, res) => {
	const { email } = req.body;

	try {
		const user = await userService.getUserByEmail(email);

		if (!user) {
			return res.status(200).json({ available: true });
		}

		return res.status(404).json({
			available: false,
			message: 'Email already in use',
		});
	} catch (err) {
		console.log('There was an error: ', err.message);
		return res.status(500).json({ message: 'Error checking email' });
	}
});

//user
router.post('/recover-password', async (req, res) => {
	const { email, tokenName } = req.body;

	try {
		const user = await userService.getUserByEmail(email);

		if (!user) {
			return res.status(400).json({ message: 'User not found' });
		}

		const { id } = user;

		const recoveryToken = await userService.generateToken(id, tokenName);

		try {
			await mailService.sendPasswordResetEmail(user, recoveryToken);
		} catch (err) {
			console.log('There was an error: ', err.message);
			return res
				.status(500)
				.json({ message: 'Error sending password reset email' });
		}

		res.status(201).json({
			message: 'User found, recovery email sent!',
		});
	} catch (err) {
		console.log('User not found');
		res.status(400).json({ message: err.message });
	}
});

//user
router.post('/reset-password', async (req, res) => {
	const { password, token } = req.body; // Get token from request body instead of params

	if (!token) {
		return res.status(400).json({ message: 'Reset token is required.' });
	}

	try {
		const response = await userService.updatePassword(password, token);
		res.status(201).json(response);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

module.exports = router;
