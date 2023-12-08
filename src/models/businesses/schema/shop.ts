"use strict";

import mongoose from "mongoose";
import { PLATFORM_MAP, SUBSCRIPTION_PLATFORM_MAP } from "./enums";

export default {
  external_created_at: Date,
  external_updated_at: Date,
  external_platform_domain: {
    type: String,
    unique: true,
    sparse: true,
  },
  external_access_token: {
    type: String,
    required: function () {
      const that = this as any;
      return that?.platform === PLATFORM_MAP.SHOPIFY && !that?.is_deleted;
    },
  },
  external_refresh_token: {
    type: String,
  },
  money_format: String,
  external_platform_secret: {
    type: String,
    required: function () {
      const that = this as any;
      return that?.platform === PLATFORM_MAP.WORDPRESS;
    },
  },
  external_platform_client: {
    type: String,
    required: function () {
      const that = this as any;
      return that?.platform === PLATFORM_MAP.WORDPRESS;
    },
  },
  charge_id: String,
  subscription_platform: {
    type: String,
    enum: Object.values(SUBSCRIPTION_PLATFORM_MAP),
  },
};
