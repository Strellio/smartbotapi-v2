'use strict'

import mongoose from 'mongoose'

export default new mongoose.Schema(
  {
    id: {
      type: String,
      required: true
    },
    business: {
      type: mongoose.Types.ObjectId,
      ref: 'businesses',
      required: true
    },
    source: {
      type: mongoose.Types.ObjectId,
      ref: 'chat_platforms',
      required: true
    },
    email: String,
    name: String,
    profile_url: {
      type: String
    },
    subscribed: {
      type: Boolean,
      default: false
    },
    last_subscribe_asked: Date,
    locale: String
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)
