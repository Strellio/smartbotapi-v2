'use strict'
import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import { hashPassword } from '../../../lib/utils'

const schema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
      index: true
    },
    full_name: {
      type: String
    },
    country: {
      type: String
    },
    password: {
      type: String,
      set: (value: string) => value && hashPassword(value)
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

schema.virtual('businesses', {
  localField: '_id',
  foreignField: 'user',
  ref: 'businesses',
  options: { sort: { created_at: -1 } }
})

schema.plugin(uniqueValidator, { message: '{PATH} already exists' })

export default schema
