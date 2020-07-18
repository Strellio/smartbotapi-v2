'use strict'
import joi from 'joi'
import {
  CHAT_PLATFORMS,
  CHAT_TYPE
} from '../../../models/chat-platforms/schema'
import { STATUS_MAP } from '../../../models/common'

const statusMap = Object.values(STATUS_MAP)

const chatPlatforms = Object.values(CHAT_PLATFORMS)
const chatTypes = Object.values(CHAT_TYPE)

export default joi.object({
  chat_platform_id: joi
    .string()
    .guid()
    .required(),
  status: joi.string().valid(...statusMap),
  external_page_name: joi.string().allow(''),
  external_user_access_token: joi.string(),
  external_user_id: joi.string(),
  external_user_name: joi.string(),
  external_access_token: joi.string(),
  external_id: joi.string()
})
