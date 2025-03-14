const express = require("express");
const jwt = require('jsonwebtoken');
const dayjs = require('dayjs');
const cookieParser = require('cookie-parser');
const router = express.Router();
const authService = require('../services/authService');
const userService = require('../services/userService');
const mailService = require('../services/mailService');
const { authenticateUser } = require('../middlewares/authMiddleware');

// Middleware to parse cookies
router.use(cookieParser());

// ALL ROUTES SORTED ALPHABETICALLY

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

router.get('/authenticateRecoveryToken', async (req, res) => {
	const { token } = req.query;
	
	if (!token) {
		return res.status(400).json({ message: 'Recovery token is required.' });
	}

	try {
		const tokenData = await userService.getTokenData(token);
		console.log(tokenData.token_used);

		const tokenCreatedAt = tokenData.created_at;
		const expiresAt = dayjs(tokenCreatedAt).add(30, 'minute').$d;
		console.log('token created at: ', tokenCreatedAt);
		console.log('expires at: ', expiresAt);
		console.log('right now: ', dayjs().$d);
		const difference = Math.floor(dayjs(expiresAt).diff(dayjs(), 'second'));
		console.log('difference: ', difference);

		const isValid = (difference > 0 && difference < 1800) && tokenData.token_used !== 1;
		const timeRemaining = isValid ? (difference) : 0;

		return res.json({ 
			email: tokenData.user_email,
			tokenValid: isValid,
			timeRemaining: timeRemaining
		});
	} catch (err) {
		console.log('There was an error: ', err.message);
		return res.status(500).json({ message: 'Server error' });
	}
});

router.get('/authenticateVerifyToken', async (req, res) => {
	const { token } = req.query;
	
	if (!token) {
		return res.status(400).json({ message: 'Recovery token is required.' });
	}

	try {
		const tokenData = await userService.getTokenData(token);

		return res.json({ 
			userId: tokenData.user_id,
			emailVerified: tokenData.token_used,
		});
	} catch (err) {
		console.log('There was an error: ', err.message);
		return res.status(500).json({ message: 'Server error' });
	}
});

router.post('/check-email', async (req, res) => {
	const { email } = req.body;

	try {
		const user = await userService.getUserByEmail(email);

		console.log(user);

		if (!user) {
            return res.status(200).json({ available: true });
        }

		return res.status(404).json({ 
			available: false,
			message: 'Email already in use' 
		});

	} catch (err) {
		console.log('There was an error: ', err.message)
		return res.status(500).json({ message: 'Error checking email' });
	}
});

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

router.post('/logout', authenticateUser, (req, res) => {
	res.clearCookie('session_token', {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'Strict'
	});

	res.json({ message: 'Logged out successfully' });
});

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
			console.log('There was an error: ', err.message)
			return res.status(500).json({ message: 'Error sending password reset email' });
		}

		res.status(201).json({
			message: 'User found, recovery email sent!'
		});
	} catch (err) {
		console.log('User not found');
		res.status(400).json({ message: err.message });
	}
});

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

router.post('/reset-password', async (req, res) => {
    const { password, token } = req.body; // Get token from request body instead of params

    if (!token) {
        return res.status(400).json({ message: "Reset token is required." });
    }

	try {
		await userService.updatePassword(password, token);
		res.status(201).json({
			message: 'Password updated!'
		})
	} catch (err) {
		res.status(500).json({ message: err.message });
	}

});

router.post('/updateVerified', async (req, res) => {
	const { user_id, token } = req.body;

	try {
		await userService.updateVerified(user_id, token);
	} catch (err) {
		res.status(500).json({ message: err.message });
	}

});

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