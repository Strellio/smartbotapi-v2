'use strict'

import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    business: {
      type: mongoose.Types.ObjectId,
      ref: 'businesses',
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
    linked_chat_agents: {
      type: [
        {
          type: mongoose.Types.ObjectId
        }
      ]
    }
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

schema.virtual('linked_chat_agents_platforms', {
  ref: 'chat_platforms',
  localField: 'linked_chat_agents',
  foreignField: 'agents._id'
})

export default schema
