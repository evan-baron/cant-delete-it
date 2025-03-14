// models/userModel.js
const pool = require('../config/db');

const Token = {
	// Create email recovery token
	async createRecoveryToken(id, tokenName, token) {
		const [result] = await pool.execute(
			'INSERT INTO email_tokens (user_id, token_name, token) VALUES (?, ?, ?)',
			[id, tokenName, token]
		);
		return result;
	},

	// Get token created timestamp
	async getTokenData(token) {
		const [result] = await pool.execute(
			'SELECT user_id, token_name, created_at, token_used FROM email_tokens WHERE token = ?',
			[token]
		);
		return result[0];
	},

	// Update token used
	async updateTokenUsed(token) {
		const [result] = await pool.execute(
			'UPDATE email_tokens SET token_used = 1 WHERE token = ?', [token]
		);
		return result.affectedRows > 0;
	}
}

module.exports = Token;