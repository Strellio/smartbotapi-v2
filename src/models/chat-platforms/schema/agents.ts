'use strict'

import mongoose from 'mongoose'

export enum AGENT_TYPE {
  PERSON = 'person',
  BOT = 'bot'
}

export default new mongoose.Schema(
  {
    id: {
      required: true,
      type: String
    },
    name: {
      type: String,
      required: true
    },
    profile_url: String,
    active: {
      type: Boolean,
      default: false
    },
    is_person: {
      type: Boolean,
      required: true
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
)
