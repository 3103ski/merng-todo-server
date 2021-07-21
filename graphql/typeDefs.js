const { gql } = require('apollo-server-express');

module.exports = gql`
	type User {
		id: ID!
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
		# write
		createTodoList(title: String!, color: String!): TodoList!
		addTodoListItem(masterId: ID!, listId: ID!, title: String!, isSubTask: Boolean): Todo!
		# update
		updateTodoList(listId: ID!, updatedContent: UpdateTodoListInput): TodoList!
		updateTodo(
			todoId: ID!
			title: String
			isComplete: Boolean
			isSubTask: Boolean
			dueDate: String
			isMyDay: Boolean
		): Todo!
		# delete
		deleteTodo(todoId: ID!): Todo
	}
`;
