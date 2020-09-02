'use strict'

import mongoose from 'mongoose'

export default new mongoose.Schema(
  {
    business: {
      type: mongoose.Types.ObjectId,
      ref: "businesses",
      required: true
    },
    name: {
      type: String,
      required: true
    },
    profile_url: {
      type: String,
      required: true
    },
    is_online: {
      type: Boolean,
      default: false
    },
    linked_chat_agents: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'chat_platforms.agents'
      }
    ]
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
