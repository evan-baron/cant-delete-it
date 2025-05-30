const jwt = require('jsonwebtoken');
const userService = require('./userService'); 
require("dotenv").config();

const login = async (email, password, checked) => {
	const user = await userService.authenticateUser(email, password);

	if (user.success) {
		const token = jwt.sign(
			{ userId: user.user.id, email: user.user.email },
			process.env.JWT_SECRET,
			checked ? {} : { expiresIn: '1h' } // If checked is true, no expiration time
		)
		return { user: user.user, token };
	} else {
		throw new Error(user.message);
	}
}

const register = async (first, last, email, password) => {
    // Find the user by email
    const user = await userService.getUserByEmail(email);
    if (user) {
        throw new Error('An account with this email already exists.');
    } else {
		try {
			const newUser = await userService.createUser(first, last, email, password);
			return { user: newUser }
		} catch (err) {
			throw new Error('Error registering user: ' + err.message);
		}
	}
};

module.exports = { register, login };
