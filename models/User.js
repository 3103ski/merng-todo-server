const { model, Schema } = require('mongoose');

const userSchema = new Schema({
	username: String,
	password: String,
	email: String,
	createdAt: String,
	userSettings: {
		darkMode: {
			type: Boolean,
			default: false,
		},
		darkText: {
			type: Boolean,
			default: false,
		},
		squareEdges: {
			type: Boolean,
			default: false,
		},
	},
});

module.exports = model('User', userSchema);
