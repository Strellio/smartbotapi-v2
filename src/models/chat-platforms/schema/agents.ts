"use strict";

import mongoose from "mongoose";

export enum AGENT_TYPE {
  PERSON = "person",
  BOT = "bot",
}

export default new mongoose.Schema(
  {
    external_id: {
      required: false,
      unique: true,
      index: true,
      sparse: true,
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    profile_url: String,
    is_person: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
