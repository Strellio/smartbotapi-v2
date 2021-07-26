'use strict'
import convict from 'convict'

if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development'

if (process.env.NODE_ENV === 'development') require('dotenv').config()

convict.addFormat(require('convict-format-with-validator').url)

const config = convict({
  NODE_ENV: {
    doc: 'Node Env',
    default: process.env.NODE_ENV,
    env: 'NODE_ENV'
  },
  PORT: {
    doc: 'The port to bind.',
    format: 'port',
    default: process.env.PORT,
    env: 'PORT'
  },
  DB_URL: {
    doc: 'Mongodb url',
    env: 'DB_URL',
    default: process.env.DB_URL
  },
  SHOPIFY_APP_SECRET: {
    doc: 'Shopify secret',
    env: 'SHOPIFY_APP_SECRET',
    default: process.env.SHOPIFY_APP_SECRET
  },
  SHOPIFY_APP_KEY: {
    doc: 'Shopify client',
    env: 'SHOPIFY_APP_KEY',
    default: process.env.SHOPIFY_APP_KEY
  },
  APP_URL: {
    doc: 'APP url',
    env: 'APP_URL',
    format: 'url',
    default: process.env.APP_URL
  },
  DASHBOARD_URL: {
    doc: 'Dashboard url',
    env: 'DASHBOARD_URL',
    format: 'url',
    default: process.env.DASHBOARD_URL
  },
  FB_CLIENT_SECRET: {
    doc: 'Facebook secret',
    env: 'FB_CLIENT_SECRET',
    default: process.env.FB_CLIENT_SECRET
  },
  FB_CLIENT_ID: {
    doc: 'Facebook client',
    env: 'FB_CLIENT_ID',
    default: process.env.FB_CLIENT_ID
  },
  FB_VALIDATION_TOKEN: {
    doc: 'FB_VALIDATION_TOKEN',
    env: 'FB_VALIDATION_TOKEN',
    default: process.env.FB_VALIDATION_TOKEN
  },
  INTERCOM_CLIENT_ID: {
    doc: 'Intercom client',
    env: 'INTERCOM_CLIENT_ID',
    default: process.env.INTERCOM_CLIENT_ID
  },
  INTERCOM_CLIENT_SECRET: {
    doc: 'Intercom Secret',
    env: 'INTERCOM_CLIENT_SECRET',
    default: process.env.INTERCOM_CLIENT_SECRET
  },
  APP_KEY: {
    doc: 'Application Encryption key',
    env: 'APP_KEY',
    default: process.env.APP_KEY
  },
  WIDGET_URL: {
    doc: 'WIDGET_URL ',
    env: 'WIDGET_URL',
    default: process.env.WIDGET_URL
  },
  BOT_API: {
    doc: 'BOT_API',
    env: 'BOT_API',
    default: process.env.BOT_API
  },
  REDIS_URL: {
    doc: 'REDIS_URL',
    env: 'REDIS_URL',
    default: process.env.REDIS_URL
  },
  NEW_ADMIN_MESSAGE_TOPIC: {
    doc: 'NEW_ADMIN_MESSAGE_TOPIC',
    default: 'NEW_ADMIN_MESSAGE_TOPIC'
  },
  NEW_CUSTOMER_MESSAGE_TOPIC: {
    doc: 'NEW_CUSTOMER_MESSAGE_TOPIC',
    default: 'NEW_CUSTOMER_MESSAGE_TOPIC'
  },
  PUBSUB_PROJECT_ID: {
    doc: 'PUBSUB_PROJECT_ID',
    env: 'PUBSUB_PROJECT_ID',
    default: process.env.PUBSUB_PROJECT_ID
  },
  PUBSUB_CREDENTIALS: {
    doc: 'PUBSUB_CREDENTIALS',
    env: 'PUBSUB_CREDENTIALS',
    default: process.env.PUBSUB_CREDENTIALS
  },
  FLUTTERWAVE_SEC_KEY: {
    doc: 'FLUTTERWAVE_SEC_KEY',
    env: 'FLUTTERWAVE_SEC_KEY',
    default: process.env.FLUTTERWAVE_SEC_KEY
  }
})

config.validate({ allowed: 'strict' })

export default config
