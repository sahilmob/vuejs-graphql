const { ApolloServer } = require('apollo-server');
const mongoose = require('mongoose')
const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, 'typeDefs.gql')
const typeDefs = fs.readFileSync(filePath, 'utf8')

require('dotenv').config({ path: './variables.env' })
const User = require('./models/User.js')
const Post = require('./models/Post.js')

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true }).then(() => {
    console.log('DB connected');
}).catch(e => {
    console.log(e);
})


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