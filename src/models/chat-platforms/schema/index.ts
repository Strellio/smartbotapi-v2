"use strict";

import mongoose from "mongoose";
import agent from "./agents";
import { STATUS_MAP } from "../../common";

export enum CHAT_PLATFORMS {
  CUSTOM = "custom",
  FACEBOOK = "facebook",
  INTERCOM = "intercom",
  HUBSPOT = "hubspot",
  WHATSAPP = "whatsapp",
  INSTAGRAM = "instagram",
}

export enum CHAT_TYPE {
  ON_SITE = "on_site",
  OFF_SITE = "off_site",
  BOTH = "both",
}

export default new mongoose.Schema(
  {
    business: {
      type: mongoose.Types.ObjectId,
      ref: "businesses",
      required: true,
    },
    platform: {
      type: String,
      required: true,
      enum: Object.values(CHAT_PLATFORMS),
    },
    external_id: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    agents: {
      type: [agent],
      default: [],
    },
    external_phone_number_id: String,
    external_auth_code: String,
    external_name: String,
    linked_page_id: String,

    external_user_id: String,
    external_user_access_token: String,
    external_user_name: String,
    external_access_token: String,
    external_refresh_token: String,
    workspace_id: String,
    logged_in_greetings: {
      type: String,
      default: "Have any questions?",
      maxlength: 80,
    },
    logged_out_greetings: {
      type: String,
      default: "See you soon",
      maxlength: 80,
    },
    theme_color: {
      type: String,
      default: "#0084FF",
    },
    type: {
      type: String,
      enum: Object.values(CHAT_TYPE),
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(STATUS_MAP),
      default: STATUS_MAP.DEACTIVATED,
    },
    is_external_agent_supported: {
      type: Boolean,
      default: function () {
        return (
          this.platform === CHAT_PLATFORMS.FACEBOOK ||
          this.platform === CHAT_PLATFORMS.INTERCOM ||
          this.platform === CHAT_PLATFORMS.INSTAGRAM
        );
      },
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
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
