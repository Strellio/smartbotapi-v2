'use strict'
import joi from 'joi'
import { objectId } from '../../../lib/joi'

export default joi.object({
  business_id: objectId().required(),
  customer_id: objectId().required(),
  external_id: joi.string(),
  source: objectId(),
  email: joi.string().email(),
  name: joi.string(),
  profile_url: joi.string().uri(),
  subscribed: joi.boolean(),
  locale: joi.string(),
  is_chat_with_live_agent: joi.boolean()
})
