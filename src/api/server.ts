'use strict'

import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import bodyParser from 'body-parser'
import { schemas, resolvers } from './graphql'
import routes from './routes'
import config from '../config'
import loggerMaker from '../lib/logger'

const reqLogger = require('express-pino-logger')({
  logger: loggerMaker()
})

const app = express()

const graphqlServer = new ApolloServer({ typeDefs: schemas, resolvers })

app
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))
  .use(reqLogger)
  .use(routes())
  .use(graphqlServer.getMiddleware())
  .listen(config.get('PORT'), () => {
    loggerMaker().info('Server started on http://localhost:4000')
  })
