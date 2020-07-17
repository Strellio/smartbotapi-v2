'use strict'
import joi from 'joi'
import {
  CHAT_PLATFORMS,
  CHAT_TYPE
} from '../../../models/chat-platforms/schema'

const chatPlatforms = Object.values(CHAT_PLATFORMS)
const chatTypes = Object.values(CHAT_TYPE)

export default joi.object({
  business_id: joi
    .string()
    .guid()
    .required(),
  platform: joi
    .string()
    .valid(...chatPlatforms)
    .required(),
  external_page_name: joi.string().when('platform', {
    is: CHAT_PLATFORMS.FACEBOOK,
    then: joi.required()
  }),
  external_user_access_token: joi.string().when('platform', {
    is: CHAT_PLATFORMS.FACEBOOK,
    then: joi.required()
  }),
  external_user_id: joi.string().when('platform', {
    is: CHAT_PLATFORMS.FACEBOOK,
    then: joi.required()
  }),
  external_user_name: joi.string().when('platform', {
    is: CHAT_PLATFORMS.FACEBOOK,
    then: joi.required()
  }),
  external_access_token: joi.string(),
  external_id: joi.string().required(),
  type: joi
    .string()
    .valid(...chatTypes)
    .required()
})
