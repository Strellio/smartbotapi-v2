'use strict'
import express from 'express'
import config from '../../config'
import loggerMaker from '../../lib/logger'
import bodyParser from 'body-parser'
import routes from './routes'
import cors from 'cors'

const app = express()

const PORT = config.get('PORT')

const reqLogger = require('express-pino-logger')({
  logger: loggerMaker()
})

app
  .use(cors())
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: false }))
  .use(reqLogger)
  .use('/webhooks', routes())
  .listen(PORT, () => {
    loggerMaker().info(`Server started on http://localhost:${PORT}`)
  })
