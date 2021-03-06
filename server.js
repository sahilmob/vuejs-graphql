const { ApolloServer, AuthenticationError } = require("apollo-server");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

const filePath = path.join(__dirname, "typeDefs.gql");
const typeDefs = fs.readFileSync(filePath, "utf8");
const resolvers = require("./resolvers.js");

require("dotenv").config({ path: "./variables.env" });
const User = require("./models/User.js");
const Post = require("./models/Post.js");

mongoose
	.connect(
		process.env.MONGO_URI,
		{ useNewUrlParser: true }
	)
	.then(() => {
		console.log("DB connected");
	})
	.catch(e => {
		console.log(e);
	});

const getUser = token => {
	if (token) {
		try {
			return jwt.verify(token, process.env.SECRET);
		} catch (err) {
			throw new AuthenticationError(
				"Your session has ended. Please sign in again"
			);
		}
	}
};

const server = new ApolloServer({
	typeDefs,
	resolvers,
	formatError: error => ({
		name: error.name,
		message: error.message.replace("Context creation failed:", "")
	}),
	context: ({ req }) => {
		const token = req.headers["authorization"];
		return { User, Post, currentUser: getUser(token) };
	}
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
	console.log(`Server listening on ${url}`);
});
