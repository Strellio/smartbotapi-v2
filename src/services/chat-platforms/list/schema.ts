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
  business_id: objectId().required(),
  status: joi.string().valid(...statusMap),
  platform: joi.string().valid(...chatPlatforms),
  type: joi.string().valid(...chatTypes)
})
