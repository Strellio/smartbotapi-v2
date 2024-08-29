'use strict'

import mongoose from 'mongoose'
export const TYPES = {
    SHOP_REDACT: "SHOP_REDACT",
    CUSTOMERS_REDACT: "CUSTOMERS_REDACT",
    CUSTOMER_DATA_REQUEST: "CUSTOMER_DATA_REQUEST"
}

const REQUEST = new mongoose.Schema({
    type: {
        type: String,
        enum: Object.values(TYPES)
    },
    resolved: {
        type: Boolean,
        default: false
    },
    payload: {
        type: String,
        set: JSON.stringify,
        get: JSON.parse
    }
},
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    })

const Schema = new mongoose.Schema(
    {
        business: {
            type: mongoose.Types.ObjectId,
            ref: 'businesses',
            required: true
          },
        requests: {
            type: [REQUEST],
            required: true
        }
    },
    {
        timestamps: {
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    }
)
export default Schema
