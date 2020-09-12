'use strict'
import joi from 'joi'
import { MESSAGE_TYPE, MESSAGE_MEDIA_TYPE } from '../../../models/messages/schema'
import { objectId } from '../../../lib/joi'
const messageTypes = Object.values(MESSAGE_TYPE)
const messageMediaTypes = Object.values(MESSAGE_MEDIA_TYPE)

export default joi.object({
  customer_id: objectId().required(),
  business_id: objectId().required(),
  external_id: joi.string(),
  agent_external_id: joi.string(),
  agent_id: objectId(),
  source: objectId().required(),
  type: joi
    .string()
    .valid(...messageTypes)
    .required(),
  text: joi
    .string()
    .allow("", " ")
    .when('type', { is: MESSAGE_TYPE.TEXT, then: joi.required() }),
  media: joi.array().items(joi.object({
    url: joi.string().uri().required(),
    type: joi.string().valid(...messageMediaTypes).required()
  }))
    .when('type', { is: MESSAGE_TYPE.MEDIA, then: joi.required() }),
  is_message_from_customer: joi
    .boolean()
    .required(),
  generic_templates: joi.array().items(joi.object({
    image_url: joi.string().uri().required(),
    title: joi.string().required(),
    subtitle: joi.string().required()
  })),
  is_chat_with_live_agent: joi.boolean().required(),
  is_message_read: joi.boolean(),
  is_message_sent: joi.boolean()
})
