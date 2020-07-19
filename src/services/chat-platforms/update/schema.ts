'use strict'
import {
  CHAT_PLATFORMS,
  CHAT_TYPE
} from '../../../models/chat-platforms/schema'
import { STATUS_MAP } from '../../../models/common'
import { objectId, joi } from '../../../lib/joi'

const statusMap = Object.values(STATUS_MAP)

const chatPlatforms = Object.values(CHAT_PLATFORMS)
const chatTypes = Object.values(CHAT_TYPE)

export default joi.object({
  id: objectId().required(),
  status: joi.string().valid(...statusMap),
  external_page_name: joi.string().allow(''),
  external_user_access_token: joi.string(),
  external_user_id: joi.string(),
  external_user_name: joi.string(),
  external_access_token: joi.string(),
  external_id: joi.string(),
  agents: joi
    .array()
    .items({
      external_id: joi.string().required(),
      name: joi.string().required(),
      profile_url: joi.string(),
      is_person: joi.boolean().required()
    })
    .optional()
})
