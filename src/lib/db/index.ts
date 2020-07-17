'use strict'

import mongoose from 'mongoose'
import config from '../../config'
import logger from '../logger'

export const connect = () => {
  return mongoose
    .connect(config.get('DB_URL') as any, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true
    })
    .then(() => {
      logger().info('db connected successfully')
    })
}

export const disconnect = () => mongoose.disconnect()
