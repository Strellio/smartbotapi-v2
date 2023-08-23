"use strict";
import mongoose from "mongoose";
import shop from "./shop";
import { PLATFORM_MAP } from "./enums";
import { STATUS_MAP } from "../../common";

const schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },
    domain: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
    },
    email: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(STATUS_MAP),
      default: STATUS_MAP.ACTIVE,
    },
    is_external_platform: {
      type: Boolean,
      default: true,
    },
    external_id: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    platform: {
      type: String,
      enum: Object.values(PLATFORM_MAP),
      required: true,
    },
    plan: {
      type: mongoose.Types.ObjectId,
      ref: "plans",
    },
    business_name: String,
    location: {
      country: String,
      city: String,
    },
    trial_expiry_date: Date,
    date_upgraded: Date,
    shop,
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

schema.virtual("chat_platforms", {
  ref: "chat_platforms",
  localField: "_id",
  foreignField: "business",
  options: { sort: { created_at: -1 } },
});

export default schema;
