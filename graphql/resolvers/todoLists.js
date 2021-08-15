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
		async updateTodoList(_, { listId, title, color }) {
			let updatedContent = {};

			if (title) {
				updatedContent.title = await title;
			}

			if (color) {
				updatedContent.color = await color;
			}

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
		async updateTodo(_, { todoId, isComplete, dueDate, title, myDay, isSubTask, updateType }) {
			const newContent = {};

			switch (updateType) {
				case 'toggleComplete':
					newContent.isComplete = isComplete;
					break;
				case 'subTask':
					newContent.isSubTask = isSubTask;
					break;
				case 'title':
					newContent.title = title;
					break;
				case 'myDay':
					newContent.myDay = myDay;
					break;
				case 'dueDate':
					newContent.dueDate = dueDate;
					break;
				default:
					return null;
			}

			if (newContent.title) {
				await Todo.updateMany(
					{ listId: todoId, isSubTask: true },
					{ $set: { listTitle: newContent.title } }
				);
			}

			await Todo.updateOne({ _id: todoId }, { $set: { ...newContent } });

			return Todo.findById(todoId).then((todo) => todo);
		},
		async deleteTodo(_, { todoId }, context) {
			console.log('deleting a todo');
			const user = checkAuth(context);
			if (user) {
				const todo = await Todo.findById(todoId);
				if (todo) {
					if (todo.subTasks && todo.subTasks.length > 0) {
						await Todo.deleteMany({ listId: todoId });
					}
					await Todo.findByIdAndDelete(todoId);
					return todo;
				}
			}
		},
		async deleteAllCompletedTodos(_, __, context) {
			const user = checkAuth(context);
			if (user) {
				const removeTodos = await Todo.find({ creatorId: user.id, isComplete: true });
				const removeIds = await removeTodos.map((todo) => todo._id);

				Todo.deleteMany({ creatorId: user.id, isComplete: true })
					.then(() => {
						return removeIds;
					})
					.catch((err) => {
						console.log('there was an error :: ', err);
					});

				return removeIds;
			}
		},
		async deleteListCompletedTodos(_, { listId }, context) {
			const user = checkAuth(context);
			const removeTodos = await Todo.find({
				creatorId: user.id,
				isComplete: true,
				masterId: listId,
			});
			const removeIds = await removeTodos.map((todo) => todo._id);
			if (user) {
				Todo.deleteMany({ creatorId: user.id, isComplete: true, masterId: listId })
					.then(() => {
						return { message: 'Deleted' };
					})
					.catch((err) => {
						console.log('there was an error :: ', err);
					});
				return removeIds;
			}
		},
		async deleteList(_, { listId }, context) {
			const user = checkAuth(context);

			if (user) {
				const list = await TodoList.find({ _id: listId });
				if (list) {
					Todo.deleteMany({ masterId: listId }).then(() => {
						TodoList.findOneAndDelete({ _id: listId }).then(() => {
							console.log('deleted todo list');
						});
					});
				} else {
					console.log('something did not match', list.creatorId);
				}
			}
		},
	},
};
