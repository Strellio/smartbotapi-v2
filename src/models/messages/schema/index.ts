'use strict'

import mongoose, { Mongoose } from 'mongoose'

export enum MESSAGE_TYPE {
  TEXT = 'text',
  MEDIA = 'media',
  GENERIC_TEMPLATE = 'generic_template'
}

export enum MESSAGE_MEDIA_TYPE {
  VIDEO = 'video',
  TEXT = 'text',
  IMAGE = 'image',
  RAW = 'raw' // for pdf, text, etc
}

const MediaSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true,
      enum: Object.values(MESSAGE_MEDIA_TYPE)
    }
  },
  {
    _id: false
  }
)

const GenericTemplate = new mongoose.Schema(
  {
    image_url: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    subtitle: String
  },
  {
    _id: false
  }
)
const Buttons = new mongoose.Schema({
  payload: String,
  title: String
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
    external_id: String,
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
    buttons: {
      type: [Buttons],
      default: []
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
    generic_templates: {
      type: [GenericTemplate],
      required: function () {
        const that = this as any
        return that === MESSAGE_TYPE.GENERIC_TEMPLATE
      }
    },
    text: {
      type: String,
      required: function () {
        const that = this as any
        return that === MESSAGE_TYPE.TEXT
      }
    },
    is_chat_with_live_agent: { type: Boolean, required: true },
    is_message_from_customer: { type: Boolean, required: true },
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
