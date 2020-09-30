'use strict'
import mongoose from 'mongoose'

export const columns = [
    {
        id: 1,
        title: "New"
    },
    {
        id: 2,
        title: "Waiting on Us"
    },
    {
        id: 3,
        title: "Waiting on Customer"
    },
    {
        id: 4,
        title: "Completed"
    }

]

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
        title: {
            type: String,
            required: true,
        },
        priority: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true,
        },

        column_id: {
            type: Number,
            default: 1,
            required: true,
        },
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
