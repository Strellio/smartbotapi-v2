'use strict'

import mongoose from 'mongoose'

const geoLocationSchema = {
  range: Array,
  country: String,
  region: String,
  eu: String,
  timezone: String,
  city: String,
  ll: {
    type: String,
    coordinates: []
  },
  metro: Number,
  area: Number
}

export default new mongoose.Schema(
  {
    product: {
      type: mongoose.Types.ObjectId,
      ref: 'products',
      required: true,
      index: true
    },
    business: {
      type: mongoose.Types.ObjectId,
      ref: 'businesses',
      required: true,
      index: true
    },
    geo_location: geoLocationSchema,
    device: String,
    user_agent: {
      type: String,
      set: (val: any) => {
        return JSON.stringify(val)
      },
      get: (val: any) => {
        if (val) return JSON.parse(val)
        return val
      }
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
