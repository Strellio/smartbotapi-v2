"use strict";

import mongoose from "mongoose";
export const TYPES = {
  RETURN_POLICY: "return-policy",
  REFUND_POLICY: "refund-policy",
  FAQ: "faq",
};

const Schema = new mongoose.Schema(
  {
    business: {
      type: mongoose.Types.ObjectId,
      ref: "businesses",
      required: true,
    },
    return_policy: {
      type: String,
    },
    refund_policy: {
      type: String,
    },
    privacy_policy: {
      type: String,
    },

    faq: [
      {
        question: {
          type: String,
        },
        answer: {
          type: String,
        },
      },
    ],
    terms_of_service: {
      type: String,
    },
    shipping_policy: {
      type: String,
    },
    cancellation_policy: {
      type: String,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);
export default Schema;
