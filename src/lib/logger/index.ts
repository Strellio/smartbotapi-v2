'use strict'
import pino from 'pino'

const pinoLogger = pino({
  name: 'Api',
  redact: ['access_token', 'token', 'password', 'secret', 'pin']
})

const logger = (name?: string) => {
  const loggerInstance = name ? pinoLogger.child({ type: name }) : pinoLogger

  return loggerInstance
}

export default logger
