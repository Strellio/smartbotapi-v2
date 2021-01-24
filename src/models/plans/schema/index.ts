'use strict'
import mongoose from 'mongoose'
import featureSchema from './features'
export enum PlanDuration {
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}

const schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    display_name: {
      type: String,
      required: true
    },
    duration: {
      type: String,
      required: true,
      enum: Object.values(PlanDuration),
      default: PlanDuration.MONTHLY
    },
    icon_class: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    free_trial_days: {
      type: Number,
      default: 0
    },
    features: featureSchema
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

export default schema
