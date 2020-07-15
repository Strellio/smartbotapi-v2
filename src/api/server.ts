'use strict'

import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import bodyParser from 'body-parser'
import { schemas, resolvers } from './graphql'

const app = express()

const graphqlServer = new ApolloServer({ typeDefs: schemas, resolvers })

app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))
  .use(graphqlServer.getMiddleware())
  .listen(4000, () => {
    console.info('Server started on http://localhost:4000')
  })
