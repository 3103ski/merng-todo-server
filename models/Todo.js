const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Populate = require('../util/autoPopulate');

const todoSchema = new Schema(
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
		listId: {
			type: Schema.Types.ObjectId,
			required: true,
		},
		color: {
			type: String,
			required: true,
		},
		isSubTask: {
			type: Boolean,
			default: false,
		},
		isComplete: {
			type: Boolean,
			default: false,
		},
		isMyDay: {
			type: Boolean,
			default: false,
		},
		subTasks: {
			type: Schema.Types.ObjectId,
			ref: 'Todo',
		},
		dueDate: {
			type: String,
			default: null,
		},
		participants: [
			{
				type: Schema.Types.ObjectId,
				ref: 'User',
			},
		],
	},
	{
		timestamps: true,
	}
);

todoSchema.pre('find', Populate('subTasks')).pre('findOne', Populate('subTasks'));

const Todo = mongoose.model('Todo', todoSchema, 'todos');

module.exports = Todo;
