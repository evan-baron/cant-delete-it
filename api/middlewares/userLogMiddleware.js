const userService = require('../services/userService');

const logUserAction = async (req, res, next) => {
	try {
		const user = req.body.id || null;
		const action = `${req.method} ${req.url}`;
		const ip_address = req.ip;

		await userService.logUserAction(user, action, ip_address);
	} catch (error) {
		console.error('Error logging user action:', error);
	}
	next();
};

module.exports = { logUserAction };