'use strict'

import mongoose from 'mongoose'

export default new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    profile_url: String,
    is_online: {
      type: Boolean,
      default: false
    },
    is_person: {
      type: Boolean,
      required: true
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
