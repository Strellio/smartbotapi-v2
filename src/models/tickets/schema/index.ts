'use strict'
import mongoose from 'mongoose'

export const columns = [
  {
    id: 1,
    title: 'Backlog'
  },
  {
    id: 2,
    title: 'Waiting on Us'
  },
  {
    id: 3,
    title: 'Waiting on Customer'
  },
  {
    id: 4,
    title: 'Completed'
  }
]

export enum TICKET_PRIORITY_ENUM {
  HIGH = 'high',
  LOW = 'low',
  MEDIUM = 'medium'
}

const schema = new mongoose.Schema(
  {
    business: {
      type: mongoose.Types.ObjectId,
      ref: 'businesses',
      required: true
    },
    customer: {
      type: mongoose.Types.ObjectId,
      ref: 'customers',
      required: true
    },
    source: {
      type: mongoose.Types.ObjectId,
      ref: 'chat_platforms'
    },
    order_id: String,
    order_number: String,
    order_email: String,
    title: {
      type: String,
      required: true
    },
    priority: {
      type: String,
      enum: Object.values(TICKET_PRIORITY_ENUM),
      default: TICKET_PRIORITY_ENUM.MEDIUM
    },
    description: {
      type: String,
      required: true
    },
    column_id: {
      type: Number,
      default: 1
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

schema.virtual('column').get(function () {
  return columns.find(column => column.id === this.column_id)
})

export default schema
