'use strict'

import mongoose from 'mongoose'

export default new mongoose.Schema({
  customer: {
    type: mongoose.Types.ObjectId,
    ref: 'customers',
    required: true
  },
  business: {
    ref: 'businesses',
    required: true
  },
  source: {
    type: mongoose.Types.ObjectId,
    ref: 'chat_platforms',
    required: true
  },

  agent: {}
})
