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
		masterId: {
			type: Schema.Types.ObjectId,
			ref: 'TodoList',
			required: true,
		},
		listId: {
			type: Schema.Types.ObjectId,
			required: true,
		},
		listTitle: {
			type: String,
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
		myDay: {
			type: Boolean,
			default: false,
		},
		dueDate: {
			type: String,
			default: '',
		},
		subTasks: [
			{
				type: Schema.Types.ObjectId,
				ref: 'Todo',
			},
		],
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
