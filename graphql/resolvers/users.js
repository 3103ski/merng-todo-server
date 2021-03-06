const User = require('../../models/User');
const bcrypt = require('bcrypt');
const { UserInputError } = require('apollo-server-express');
const checkAuth = require('../../util/checkAuth');
const jwt = require('jsonwebtoken');

const { SERCRET_KEY } = require('../../config');

function generateToken(user) {
	return jwt.sign(
		{
			id: user.id,
			email: user.email,
			username: user.username,
		},
		SERCRET_KEY,
		{ expiresIn: '1h' }
	);
}

module.exports = {
	Query: {
		async getUser(_, { userId }) {
			const user = User.findById(userId);
			if (user) {
				console.log('This user :: ', user);
				return user;
			}
		},
		async getUsers() {
			const users = await User.find();
			return users;
		},
	},
	Mutation: {
		async updateSettings(_, { darkMode, squareEdges, showPopups }, context) {
			const user = checkAuth(context);

			const updatedSettings = await {
				darkMode,
				squareEdges,
				showPopups,
			};

			if (user) {
				await User.findByIdAndUpdate(user.id, {
					$set: {
						userSettings: { ...updatedSettings },
					},
				});
				const updatedUser = await User.findById(user.id);
				return updatedUser;
			}
		},
		async login(_, { username, password }) {
			const user = await User.findOne({ username });

			console.log('This User :: ', user);
			if (!user) {
				throw new UserInputError('User not found', {
					errors: {
						username: 'No user was found with this username',
					},
				});
			}

			const match = await bcrypt.compare(password, user.password);

			if (!match) {
				throw new UserInputError('Wrong Credentials', {
					errors: {
						password: 'The password you enetered is incorrect',
					},
				});
			}

			const token = generateToken(user);

			return {
				...user._doc,
				id: user._id,
				token,
			};
		},
		async register(_, { registerInput: { username, email, password, confirmPassword } }) {
			const user = await User.findOne({ username });

			if (user) {
				throw new UserInputError('Username already in use', {
					errors: {
						username: 'This username is taken',
					},
				});
			}

			if (password === confirmPassword) {
				password = await bcrypt.hash(password, 12);

				const newUser = new User({
					email,
					username,
					password,
					createdAt: new Date().toISOString(),
				});

				const res = await newUser.save();
				const token = generateToken(res);
				return {
					...res._doc,
					id: res._id,
					token,
				};
			} else {
				throw new UserInputError('The passwords do not match', {
					errors: {
						confirmPassword: 'Passwords do not match',
					},
				});
			}
		},
	},
};
