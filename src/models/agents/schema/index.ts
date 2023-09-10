"use strict";

import mongoose from "mongoose";

enum AGENT_AVAILABILTY_STATUS {
  AVAILABLE = "available",
  NOT_AVAILABLE = "not_available",
}

const schema = new mongoose.Schema(
  {
    business: {
      type: mongoose.Types.ObjectId,
      ref: "businesses",
      required: true,
    },
    is_person: {
      type: Boolean,
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: function () {
        return this.is_person;
      },
    },
    bot_info: {
      type: {
        name: String,
        profile_url: String,
      },

      required: function () {
        return !this.is_person;
      },
    },

    availability_status: {
      type: String,
      enum: Object.values(AGENT_AVAILABILTY_STATUS),
      default: AGENT_AVAILABILTY_STATUS.NOT_AVAILABLE,
    },

    linked_chat_agents: {
      type: [
        {
          type: mongoose.Types.ObjectId,
        },
      ],
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

schema.virtual("linked_chat_agents_platforms", {
  ref: "chat_platforms",
  localField: "linked_chat_agents",
  foreignField: "agents._id",
});

export default schema;
