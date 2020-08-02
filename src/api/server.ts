'use strict'

import express from 'express'
import { formatError } from 'apollo-errors'
import { ApolloServer } from 'apollo-server-express'
import bodyParser from 'body-parser'
import { schemas, resolvers } from './graphql'
import routes from './routes'
import config from '../config'
import loggerMaker from '../lib/logger'
import isAuthenticated from './middlewares/is-authenticated'

const reqLogger = require('express-pino-logger')({
  logger: loggerMaker()
})

const app = express()

const graphqlServer = new ApolloServer({
  typeDefs: schemas,
  resolvers,
  formatError: formatError as any,
  context: ({ req })=>{
    const token = req.headers.authorization?.split(" ")[1]
    return isAuthenticated(token)
  }
})

app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))
  .use(reqLogger)
  .use(routes())
  .use(graphqlServer.getMiddleware())
  .listen(config.get('PORT'), () => {
    loggerMaker().info('Server started on http://localhost:4000')
  })
