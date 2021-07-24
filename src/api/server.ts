'use strict'
import path from 'path'
import express from 'express'
import { formatError } from 'apollo-errors'
import { ApolloServer } from 'apollo-server-express'
import http from 'http'
import { schemas, resolvers } from './graphql'
import routes from './routes'
import config from '../config'
import loggerMaker from '../lib/logger'
import isAuthenticated from './middlewares/is-authenticated'
import logger from '../lib/logger'
import attachIpToReq from './middlewares/attach-ip'

const PORT = config.get('PORT')

const reqLogger = require('express-pino-logger')({
  logger: loggerMaker()
})

const app = express()

const graphqlServer = new ApolloServer({
  typeDefs: schemas,
  resolvers: resolvers as any,
  formatError: formatError as any,
  context: ({ req, connection }) => {
    if (connection) return connection.context
    const token = req.headers.authorization?.split(' ')[1]
    const operationsToIgnore = ['createAccount', 'login']
    if (operationsToIgnore.includes(req.body.operationName)) return req
    return isAuthenticated(token, req)
  },
  subscriptions: {
    onConnect: (connectionParams: any, websocket, context) => {
      logger().info('connection established', connectionParams)
      const token = connectionParams?.headers?.Authorization.split(' ')[1]
      return isAuthenticated(token)
    },
    onDisconnect: websocket => {
      logger().error('Connection disconnected', websocket)
    }
  },
  logger: logger()
})

const httpServer = http.createServer(app)

graphqlServer.installSubscriptionHandlers(httpServer)

app
  .use('/static', express.static(path.join(__dirname, '../public')))
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use(attachIpToReq)
  .use(reqLogger)
  .use(routes())
  .use(graphqlServer.getMiddleware())

httpServer.listen(PORT, () => {
  loggerMaker().info(`Server started on http://localhost:${PORT}`)
  loggerMaker().info(
    `🚀 Subscriptions ready at ws://localhost:${PORT}${graphqlServer.subscriptionsPath}`
  )
})
