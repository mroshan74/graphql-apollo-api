const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')
const dotEnv = require('dotenv')
dotEnv.config()
const PORT = process.env.PORT || 8001
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

const { tasks, users } = require('./constants/index')

const typeDefs = gql`
  type Query {
    greetings: String,
    tasks: [Task!]
  }

  type User {
    id: ID!,
    name: String!,
    email: String!,
    tasks: [Task!]
  }

  type Task {
    id: ID!,
    name: String!,
    completed: Boolean!,
    user: User!
  }
`

const resolvers = {
  Query: {
    greetings: () => "Hello",
    tasks: () => {
      // console.log(tasks)
      return tasks
    }
  },
  // Field level resolver // wont run until and unless the query resolver has the data
  // priority --> Field level resolver data > query level resolver
  Task: {
    // user: () => (parent) => users.find( user => user.id === parent.userId)  // parent contains the resolved data previous
    user: ({ userId }) => {
      // console.log('userId', userId)
      return users.find(user => user.id == userId)
    },
    // name: () => "test-task"
  }
}

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers
})

apolloServer.applyMiddleware({app, path: '/v1/graphql'})

app.listen(PORT, () => {
  console.log('LISTENING ON PORT -->',PORT)
  console.log('Graphql Endpoint -->',apolloServer.graphqlPath)
})