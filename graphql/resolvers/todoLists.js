const { UserInputError } = require('apollo-server-express');

const TodoList = require('../../models/TodoList');
const Todo = require('../../models/Todo');
const checkAuth = require('../../util/checkAuth');
const { validateTodoList } = require('../../validators/');

module.exports = {
	Query: {
		async getTodoList(_, { listId }) {
			const todoList = TodoList.findById(listId);
			if (todoList) {
				return todoList;
			}
		},
		async getUserLists(_, { userId }) {
			const todoLists = await TodoList.find({ creatorId: userId });
			return todoLists;
		},
		async getUserTodos(_, { userId }) {
			const todos = await Todo.find({ creatorId: userId, isSubTask: false });
			return todos;
		},
	},
	Mutation: {
		async createTodoList(_, { title, color }, context) {
			const user = checkAuth(context);

			if (user) {
				const { errors, isValid } = validateTodoList({ title, color });

				if (!isValid) {
					throw new UserInputError('Errors', { errors });
				}

				const newTodoList = new TodoList({ title, color, creatorId: user.id });
				newTodoList.save();

				return newTodoList;
			}
		},
		async updateTodoList(_, { listId, updatedContent }) {
			await TodoList.updateOne({ _id: listId }, { $set: { ...updatedContent } });

			if (updatedContent.title) {
				await Todo.updateMany(
					{ listId, isSubTask: false },
					{ $set: { listTitle: updatedContent.title } }
				);
			}
			if (updatedContent.color) {
				await Todo.updateMany(
					{ masterId: listId },
					{ $set: { color: { ...updatedContent }.color } }
				);
			}
			return TodoList.findById(listId).then((list) => list);
		},
		async addTodoListItem(_, { masterId, listId, title, isSubTask = false }, context) {
			const user = checkAuth(context);
			if (user) {
				let listHome;

				if (isSubTask === true) {
					listHome = await Todo.findById(listId);
				} else {
					listHome = await TodoList.findById(listId);
				}

				const newTodo = await new Todo({
					creatorId: user.id,
					listId,
					masterId,
					title,
					color: listHome.color,
					isSubTask,
					listTitle: listHome.title,
				});

				if (isSubTask === true) {
					await listHome.subTasks.push(newTodo._id);
				} else {
					await listHome.todos.push(newTodo._id);
				}

				await newTodo.save();
				await listHome.save();

				return newTodo;
			}
		},
		async updateTodo(_, { todoId, isComplete, dueDate, title, isMyDay, isSubTask }) {
			const newContent = {};
			console.log(isComplete);

			if (isComplete !== null) {
				console.log('building the new content');
				newContent.isComplete = isComplete;
				console.log('Is the content there', newContent);
			}
			if (dueDate) {
				newContent.dueDate = dueDate;
			}
			if (title) {
				newContent.title = title;
			}
			if (isMyDay) {
				newContent.isMyDay = isMyDay;
			}
			if (isSubTask) {
				newContent.isSubTask = isSubTask;
			}

			await Todo.updateOne({ _id: todoId }, { $set: { ...newContent } });

			if (newContent.title) {
				await Todo.updateMany(
					{ listId: todoId, isSubTask: true },
					{ $set: { listTitle: newContent.title } }
				);
			}

			return Todo.findById(todoId).then((todo) => todo);
		},
		async deleteTodo(_, { todoId }) {
			const todo = await Todo.findById(todoId);
			if (todo) {
				await Todo.findByIdAndDelete(todoId);
				return todo;
			}
		},
	},
};
