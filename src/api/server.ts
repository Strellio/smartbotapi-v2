'use strict'
import path from 'path'
import express from 'express'
import { formatError } from 'apollo-errors'
import { ApolloServer } from 'apollo-server-express'
import bodyParser from 'body-parser'
import http from 'http'
import { schemas, resolvers } from './graphql'
import routes from './routes'
import config from '../config'
import loggerMaker from '../lib/logger'
import isAuthenticated from './middlewares/is-authenticated'
import logger from '../lib/logger'

const PORT = config.get('PORT')

const reqLogger = require('express-pino-logger')({
  logger: loggerMaker()
})

const app = express()

const graphqlServer = new ApolloServer({
  typeDefs: schemas,
  resolvers,
  formatError: formatError as any,
  context: ({ req, connection }) => {
    if (connection) return connection.context
    const token = req.headers.authorization?.split(' ')[1]
    return isAuthenticated(token)
  },
  subscriptions: {
    onConnect: (connectionParams: any, websocket, context) => {
      logger().info('connection establised', connectionParams)
      const token = connectionParams?.headers?.Authorization.split(' ')[1]
      return isAuthenticated(token)
    },
    onDisconnect: websocket => {
      logger().error('Connection disconnected', websocket)
    }
  }
})

const httpServer = http.createServer(app)

graphqlServer.installSubscriptionHandlers(httpServer)

app
  .use('/static', express.static(path.join(__dirname, '../public')))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))
  .use(reqLogger)
  .use(routes())
  .use(graphqlServer.getMiddleware())

httpServer.listen(PORT, () => {
  loggerMaker().info(`Server started on http://localhost:${PORT}`)
  loggerMaker().info(
    `🚀 Subscriptions ready at ws://localhost:${PORT}${graphqlServer.subscriptionsPath}`
  )
})
