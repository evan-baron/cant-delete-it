const bcrypt = require('bcrypt');
const crypto = require('crypto');
const userModel = require('../models/userModel'); // Import the User model
const tokenModel = require('../models/tokenModel'); // Import the Token model

// ALL FUNCTIONS LISTED BELOW ALPHABETICALLY

// Authenticate a user
const authenticateUser = async (email, password) => {
	const hashedPassword = await userModel.getPasswordByEmail(email);
	if (!hashedPassword) {
		return { success: false, message: 'Incorrect email or password.' };
	}

	// Compare input password with stored hash
	const isMatch = await bcrypt.compare(password, hashedPassword);
	if (!isMatch) {
		return { success: false, message: 'Incorrect email or password.' };
	}

	const user = await userModel.findUserByEmail(email);

	return { success: true, user };
};

// Check if a user exists by email
const checkIfUserExists = async (email) => {
	return await userModel.checkIfUserExists(email);
};

// Create a new user
const createUser = async (first, last, email, password) => {
	const hashedPassword = await bcrypt.hash(password, 10);

	const result = await userModel.createUser(
		first,
		last,
		email,
		hashedPassword
	);

	const newUser = await userModel.findUserById(result.insertId);

	return {
		id: newUser.id,
		first_name: newUser.first_name,
		last_name: newUser.last_name,
		email: newUser.email,
		created_at: newUser.created_at,
	};
};

// Delete a user by ID
const deleteUser = async (id) => {
	return await userModel.deleteUserById(id);
};

// Get a user by email
const getUserByEmail = async (email) => {
	return await userModel.findUserByEmail(email);
};

// Get user by ID
const getUserById = async (id) => {
	return await userModel.findUserById(id);
};

// Generate recovery token
const generateToken = async (id, tokenName, length = 32) => {
	const recoveryToken = crypto
		.randomBytes(length)
		.toString('hex')
		.slice(0, length);

	try {
		await tokenModel.createRecoveryToken(id, tokenName, recoveryToken);
		return recoveryToken;
	} catch (err) {
		console.log('There was an error: ', err.message);
	}
};

// Get recovery token Data
const getTokenData = async (token) => {
	try {
		const recoveryTokenData = await tokenModel.getTokenData(token);
		return recoveryTokenData;
	} catch (err) {
		console.log('There was an error: ', err.message);
	}
}

// Update password
const updatePassword = async (password, token) => {
	const hashedPassword = await bcrypt.hash(password, 10);

	// ADD LOGIC TO MAKE SURE USER ISN'T USING SAME PASSWORD OR PREVIOUS PASSWORDS

	try {
		await userModel.updateUserPassword(hashedPassword, token);
		await tokenModel.updateTokenUsed(token);
	} catch (err) {
		console.log('There was an error: ', err.message);
	}
}

// Update verified
const updateVerified = async (user_id, token) => {
	try {
		await userModel.updateVerified(user_id);
		await tokenModel.updateTokenUsed(token);
	} catch (err) {
		console.log('There was an error. ', err.message);
	}
}

module.exports = {
	authenticateUser,
	checkIfUserExists,
	createUser,
	deleteUser,
	generateToken,
	getTokenData,
	getUserByEmail,
	getUserById,
	updatePassword,
	updateVerified,
};
