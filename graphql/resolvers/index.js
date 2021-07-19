const userResolvers = require('./users');
const todoListResolvers = require('./todoLists');

module.exports = {
	Query: {
		...userResolvers.Query,
		...todoListResolvers.Query,
	},
	Mutation: {
		...userResolvers.Mutation,
		...todoListResolvers.Mutation,
	},
};
