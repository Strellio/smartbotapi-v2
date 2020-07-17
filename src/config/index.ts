'use strict'
import convict from 'convict'

if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development'

if (process.env.NODE_ENV === 'development') require('dotenv').config()

convict.addFormat(require('convict-format-with-validator').url)

const config = convict({
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
  }
})

config.validate({ allowed: 'strict' })

export default config
