const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// const Populate = require('../util/autoPopulate');

const todoListSchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		creatorId: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},
		color: {
			type: String,
			required: true,
		},
		participants: [
			{
				type: Schema.Types.ObjectId,
				ref: 'User',
				default: [],
			},
		],
		todos: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Todo',
				default: [],
			},
		],
	},
	{
		timestamps: true,
	}
);

const TodoList = mongoose.model('TodoList', todoListSchema, 'todoLists');

module.exports = TodoList;
