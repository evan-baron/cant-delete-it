const express = require("express");
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');
const cookieParser = require('cookie-parser');
const router = express.Router();
const userService = require('../services/userService');
const mailService = require('../services/mailService');

// Middleware to parse cookies
router.use(cookieParser());

// ALL ROUTES SORTED ALPHABETICALLY

//token
router.get('/authenticate', async (req, res) => {
	const token = req.headers.authorization?.split(' ')[1] || req.cookies.session_token;
	
	if (!token) {
		return res.status(401).json({ message: 'No token provided' });
	}
	
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		
		const user = await userService.getUserById(decoded.userId);
		
		return res.json(user);
	} catch (error) {
		console.error('Error during token verification:', error.message);
		return res.status(401).json({ message: 'Invalid or expired token' });
	}
});

//token
router.get('/authenticateRecoveryToken', async (req, res) => {
	const { token } = req.query;
	
	if (!token) {
		return res.status(400).json({ message: 'Recovery token is required.' });
	}

	try {
		const tokenData = await userService.getTokenData(token);
		const { email } = await userService.getUserById(tokenData.user_id);
		console.log(tokenData);

		const tokenCreatedAt = tokenData.created_at;
		const expiresAt = dayjs(tokenCreatedAt).add(30, 'minute').$d;
		const difference = Math.floor(dayjs(expiresAt).diff(dayjs(), 'second'));

		const isValid = (difference > 0 && difference < 1800) && tokenData.token_used !== 1;
		const timeRemaining = isValid ? (difference) : 0;

		return res.json({ 
			email: email,
			tokenValid: isValid,
			timeRemaining: timeRemaining
		});
	} catch (err) {
		console.log('There was an error: ', err.message);
		return res.status(500).json({ message: 'Server error' });
	}
});

//token
router.get('/authenticateVerifyToken', async (req, res) => {
	const { token } = req.query;
	
	if (!token) {
		return res.status(400).json({ message: 'Recovery token is required.' });
	}

	try {
		const tokenData = await userService.getTokenData(token);
		console.log('tokenRoutes authenticateVerify: ', tokenData);

		return res.json({ 
			userId: tokenData.user_id,
			tokenType: tokenData.token_name,
			emailVerified: tokenData.token_used,
		});
	} catch (err) {
		console.log('There was an error: ', err.message);
		return res.status(500).json({ message: 'Server error' });
	}
});

//token
router.post('/updateVerified', async (req, res) => {
	const { user_id, token } = req.body;

	try {
		await userService.updateVerified(user_id, token_name, token);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}

});

//token
router.post('/verify-email', async (req, res) => {
	const { email, tokenName } = req.body;
	
	try {
		const user = await userService.getUserByEmail(email);
		
		if (!user) {
			return res.status(400).json({ message: 'User not found' });
		}
		
		const { id } = user;

		const verificationToken = await userService.generateToken(id, tokenName);
		
		try {
			await mailService.sendVerificationEmail(user, verificationToken);
		} catch (err) {
			console.log('There was an error: ', err.message)
			return res.status(500).json({ message: 'Error sending verification email' });
		}

		res.status(201).json({
			message: 'User found, verification email sent!'
		});
	} catch (err) {
		console.log('User not found');
		res.status(400).json({ message: err.message });
	}
});

module.exports = router;