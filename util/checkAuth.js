const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-express');
const { SERCRET_KEY } = require('../config');

module.exports = (context) => {
	const authHeader = context.req.headers.authorization;

	if (authHeader) {
		const token = authHeader.split('Bearer ')[1];
		if (token) {
			try {
				const user = jwt.verify(token, SERCRET_KEY);
				return user;
			} catch (err) {
				throw new AuthenticationError('Invalid/Expired token');
			}
		}
		throw new Error("Authentication token must be 'Beearer [token]'");
	}
	throw new Error('Authorization header must be provided');
};
