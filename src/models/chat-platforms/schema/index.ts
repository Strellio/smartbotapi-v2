'use strict'

import mongoose from 'mongoose'
import agent from './agents'
import { STATUS_MAP } from '../../common'

export enum CHAT_PLATFORMS {
  CUSTOM = 'custom',
  FACEBOOK = 'facebook',
  INTERCOM = 'intercom',
  HUBSPOT = 'hubspot',
  WHATSAPP = 'whatsapp'
}

export enum CHAT_TYPE {
  ON_SITE = 'on_site',
  OFF_SITE = 'off_site'
}

export default new mongoose.Schema({
  business: {
    type: mongoose.Types.ObjectId,
    ref: 'businesses',
    required: true
  },
  platform: {
    type: String,
    required: true,
    enum: Object.values(CHAT_PLATFORMS)
  },
  external_id: {
    type: String,
    required: true,
    unique: true,
    sparse: true,
    index: true
  },
  agents: {
    type: [agent],
    default: []
  },
  external_user_id: String,
  external_user_access_token: String,
  external_user_name: String,
  external_access_token: String,
  external_refresh_token: String,
  type: {
    type: String,
    enum: Object.values(CHAT_TYPE),
    required: true
  },
  status: {
    type: String,
    enum: Object.values(STATUS_MAP),
    default: STATUS_MAP.DEACTIVATED
  }
})
