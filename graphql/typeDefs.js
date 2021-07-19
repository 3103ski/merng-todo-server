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
		creator: ID!
		isComplete: Boolean!
		subTasks: [Todo]
		isSubTask: Boolean
		participants: [User]
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
	}

	type Mutation {
		register(registerInput: RegisterInput): User!
		login(username: String!, password: String!): User!
		createTodoList(title: String!, creatorId: ID!, color: String!): TodoList!
		updateTodoList(listId: ID!, updatedContent: UpdateTodoListInput): TodoList!
		updateTodo(todoId: ID!, updatedContent: UpdateTodoInput): Todo!
		deleteTodo(todoId: ID!): Todo
		addTodoListItem(
			listId: ID!
			creatorId: ID!
			title: String!
			isSubTask: Boolean
			color: String!
		): Todo!
	}
`;
