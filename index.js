const express = require('express');
const mongoose = require('mongoose');
const { ApolloServer } = require('apollo-server-express');

const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers/');

const { MONGODB } = require('./config');

const connect = mongoose.connect(MONGODB, {
	useCreateIndex: true,
	useFindAndModify: false,
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const PORT = process.env.PORT || 5000;

const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: ({ req }) => ({ req }),
});

const app = express();

server.applyMiddleware({ app });

connect
	.then(() => {
		console.log('Mongo DB is connected!');
		return app.listen({ port: PORT });
	})
	.then(() => console.log(`Server is ready at http://localhost:${PORT}${server.graphqlPath}`))
	.catch((err) => console.log(err));
// mongoose
// 	.connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
// 	.then(() => {
// 		console.log('Mongo DB is connected!');
// 		return app.listen({ port: PORT });
// 	})
// 	.then(() => console.log(`Server is ready at http://localhost:${PORT}${server.graphqlPath}`))
// 	.catch((err) => console.log(err));
