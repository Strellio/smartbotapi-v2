'use strict'

import mongoose from 'mongoose'
import { PLATFORM_MAP } from './enums'

export default new mongoose.Schema({
  external_created_at: Date,
  external_updated_at: Date,
  external_platform_domain: {
    type: String,
    unique: true,
    sparse: true,
    required: true
  },
  external_access_token: {
    type: String,
    required: function () {
      const that = this as any
      return that.platform === PLATFORM_MAP.SHOPIFY
    }
  },
  external_refresh_token: {
    type: String
  },
  currency: String,
  external_platform_secret: {
    type: String,
    required: function () {
      const that = this as any
      return that.platform === PLATFORM_MAP.WORDPRESS
    }
  },
  external_platform_client: {
    type: String,
    required: function () {
      const that = this as any
      return that.platform === PLATFORM_MAP.WORDPRESS
    }
  }
})
