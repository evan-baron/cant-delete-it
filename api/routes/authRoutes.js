const express = require("express");
const cookieParser = require('cookie-parser');
const router = express.Router();
const authService = require('../services/authService');
const { authenticateUser } = require('../middlewares/authMiddleware');

// Middleware to parse cookies
router.use(cookieParser());

// ALL ROUTES SORTED ALPHABETICALLY

//auth
router.post('/login', async (req, res) => {
	const { email, password, checked } = req.body;

	try {
		const { user, token } = await authService.login(email, password, checked);

		// Set HTTP-only cookie (more secure)
		res.cookie('session_token', token, {
			httpOnly: true, // Prevents JavaScript access
			secure: process.env.NODE_ENV === 'production', // Uses secure cookies in production
			sameSite: 'Strict', // Protects against CSRF
			maxAge: 60 * 60 * 1000, // 1 hour
		});

		res.status(201).json({
			message: 'User logged in successfully!',
			user,
			token // Sends token to clientside
		});
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

//auth
router.post('/logout', authenticateUser, (req, res) => {
	res.clearCookie('session_token', {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'Strict'
	});

	res.json({ message: 'Logged out successfully' });
});

//auth
router.post('/register-account', async (req, res) => {
	const { first, last, email, password } = req.body;

	try {
		const { user } = await authService.register(first, last, email, password);

		res.status(201).json({
			message: 'User registered successfully!',
			user
		});
	} catch (err) {
		res.status(500).json({ message: err.message });
	}
});

module.exports = router;