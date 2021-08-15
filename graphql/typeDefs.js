const { gql } = require('apollo-server-express');

module.exports = gql`
	type UserSettings {
		darkMode: Boolean
		darkText: Boolean
		squareEdges: Boolean
	}
	type User {
		id: ID!
		userSettings: UserSettings
		email: String!
		token: String!
		username: String!
		createdAt: String!
	}
	type Todo {
		id: ID!
		title: String!
		masterId: ID!
		color: String!
		listId: ID!
		listTitle: String!
		creatorId: ID!
		isComplete: Boolean!
		subTasks: [Todo]
		isSubTask: Boolean
		myDay: Boolean!
		participants: [User]
		dueDate: String
		createdAt: String
	}
	input UpdateTodoInput {
		title: String
		isComplete: Boolean
		isSubTask: Boolean
	}
	type TodoList {
		id: ID!
		creatorId: ID!
		participants: [User]
		title: String!
		color: String!
		todos: [Todo]
	}
	input UpdateTodoListInput {
		title: String
		dueDate: String
		color: String
	}
	input RegisterInput {
		username: String!
		email: String!
		password: String!
		confirmPassword: String!
	}
	type Query {
		getUser(userId: ID!): User
		getUsers: [User]
		getTodoList(listId: ID!): TodoList!
		getUserLists(userId: ID!): [TodoList]
		getUserTodos(userId: ID!): [Todo]
	}

	type Mutation {
		# Auth
		register(registerInput: RegisterInput): User!
		login(username: String!, password: String!): User!
		updateSettings(darkMode: Boolean, darkText: Boolean, squareEdges: Boolean): User
		# write
		createTodoList(title: String!, color: String!): TodoList!
		addTodoListItem(masterId: ID!, listId: ID!, title: String!, isSubTask: Boolean): Todo!
		# update
		updateTodoList(listId: ID!, color: String, title: String): TodoList!
		updateTodo(
			updateType: String!
			todoId: ID!
			title: String
			isComplete: Boolean
			isSubTask: Boolean
			dueDate: String
			myDay: Boolean
		): Todo!
		# delete
		deleteTodo(todoId: ID!): Todo
		deleteAllCompletedTodos(userId: ID): [ID]
		deleteListCompletedTodos(listId: ID): [ID]
		deleteList(listId: ID): [ID]
	}
`;
