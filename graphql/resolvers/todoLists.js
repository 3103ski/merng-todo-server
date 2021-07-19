const TodoList = require('../../models/TodoList');
const Todo = require('../../models/Todo');

module.exports = {
	Query: {
		async getTodoList(_, { listId }) {
			const todoList = TodoList.findById(listId);
			if (todoList) {
				return todoList;
			}
		},
	},
	Mutation: {
		async createTodoList(_, { title, creatorId, color }) {
			if (title.trim() !== '' && creatorId && color.trim() !== '') {
				const todoList = new TodoList({ title, color, creatorId });
				todoList.save();
				return todoList;
			}
		},
		async updateTodoList(_, { listId, updatedContent }) {
			await TodoList.updateOne({ _id: listId }, { $set: { ...updatedContent } });
			return TodoList.findById(listId).then((list) => list);
		},
		async addTodoListItem(_, { listId, creatorId, color, title, isSubTask = false }) {
			const newTodo = await new Todo({ creatorId, listId, title, color });
			await newTodo.save();

			if (isSubTask === true) {
				const parentTodo = await Todo.findById(listId);
				await parentTodo.subTasks.push(newTodo._id);
				await parentTodo.save();
			} else {
				const todoList = await TodoList.findById(listId);
				await todoList.todos.push(newTodo._id);
				await todoList.save();
			}

			return newTodo;
		},
		async updateTodo(_, { todoId, updatedContent }) {
			await Todo.updateOne({ _id: todoId }, { $set: { ...updatedContent } });
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
