const { ApolloServer, gql } = require('apollo-server');
const mongoose = require('mongoose')

require('dotenv').config({ path: './variables.env' })
const User = require('./models/User.js')
const Post = require('./models/Post.js')

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true }).then(() => {
    console.log('DB connected');
}).catch(e => {
    console.log(e);
})

const typeDefs = gql`
type Todo {
    task: String,
    completed: Boolean
}

type Query {
    getTodos: [Todo]
}
`

const server = new ApolloServer({
    typeDefs,
    context: {
        User,
        Post
    }
});

server.listen().then(({ url }) => {
    console.log(`Server listening on ${url}`)
});