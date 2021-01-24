'use strict'

import mongoose from 'mongoose'

export default new mongoose.Schema({
  allowed_external_platforms: { type: Array, required: true },
  allowed_live_support: { type: Boolean, default: true }
})
