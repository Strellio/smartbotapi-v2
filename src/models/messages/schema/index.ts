'use strict'

import mongoose from 'mongoose'

export enum MESSAGE_TYPE {
  TEXT = 'text',
  MEDIA = 'media'
}

export enum MESSAGE_MEDIA_TYPE {
  VIDEO = 'video',
  TEXT = 'text',
  IMAGE = 'image'
}

const MediaSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: Object.values(MESSAGE_MEDIA_TYPE)
  }
}, {
  _id: false
})

export default new mongoose.Schema(
  {
    customer: {
      type: mongoose.Types.ObjectId,
      ref: 'customers',
      required: true
    },
    agent: {
      type: mongoose.Types.ObjectId,
      ref: 'agents'
    },
    external_id: {
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
    type: {
      type: String,
      enum: Object.values(MESSAGE_TYPE),
      required: true
    },
    media: {
      type: [MediaSchema],
      required: function () {
        const that = this as any
        return that === MESSAGE_TYPE.MEDIA
      }
    },
    text: {
      type: String,
      required: function () {
        const that = this as any
        return that === MESSAGE_TYPE.TEXT
      }
    },
    is_message_from_admin: { type: Boolean, default: false },
    is_message_sent: { type: Boolean, default: false },
    is_message_read: { type: Boolean, default: false }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    },
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    }
  }
)
