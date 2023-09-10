'use strict'

import mongoose from 'mongoose'

export default new mongoose.Schema({
  allowed_external_platforms: { type: Array, required: true },
  allowed_live_support: { type: Boolean, default: true },
  max_number_of_live_agent: { type:mongoose.Schema.Types.Mixed, required: true },
  customize_chat: { type: Boolean, default: true },
  remove_smartbot_brand: { type: Boolean, required: true }
})
