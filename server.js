const { ApolloServer, gql } = require('apollo-server');



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
    typeDefs
});

server.listen().then(({ url }) => {
    console.log(`Server listening on ${url}`)
});