'use strict'

import messageModel from '../../../models/messages'
import { validate } from '../../../lib/utils'
import schema from './schema'
import chatPlatformService from "../../chat-platforms"
import { MESSAGE_TYPE, MESSAGE_MEDIA_TYPE } from '../../../models/messages/schema'
import { redisPubSub } from '../../../lib/redis'
import config from '../../../config'

type Media = { url: string, type: MESSAGE_MEDIA_TYPE }

type GenericTemplate = { image_url: string, title: string, subtitle?: string }

type CreateMessageParams = {
  customer_id: string
  business_id: string
  agent_id?: string
  external_id?: string
  source: string
  type: MESSAGE_TYPE
  media?: Media[]
  text?: string
  is_message_from_customer: boolean
  is_chat_with_live_agent: boolean
  generic_templates?: GenericTemplate[]
}

export default async function create(params: CreateMessageParams) {
  const validated: CreateMessageParams = validate(schema, params)
  const {
    customer_id: customer,
    business_id: business,
    agent_id: agent,
    ...rest
  } = validated
  const message = await messageModel().create({
    customer,
    business,
    agent,
    ...rest
  })

  if (rest.is_chat_with_live_agent && !rest.is_message_from_customer) {
    await chatPlatformService().sendMessageToCustomer(params)
  } else {
    if (!rest.is_message_from_customer) return;
    // notify admin here 
    redisPubSub().publish(config.get("NEW_MESSAGE_TOPIC"), {
      onNewMessage: message
    })
  }

  return message
}
