'use strict'
import mongoose from 'mongoose'

export default new mongoose.Schema(
  {
    business: {
      type: mongoose.Types.ObjectId,
      ref: 'businesses',
      required: true
    },
    external_id: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    title: {
      type: String,
      required: true
    },
    image_url: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    description: String,
    email_sent: {
      type: Boolean,
      default: false
    }
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
