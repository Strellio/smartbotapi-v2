'use strict'

import messageModel from '../../../models/messages'
import { validate } from '../../../lib/utils'
import schema from './schema'
import chatPlatformService from "../../chat-platforms"
import { getCustomer } from "../../customers"
import agentService from "../../agents"
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
  agent_external_id?: string
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

  if (!rest.is_chat_with_live_agent) {
    redisPubSub().publish(config.get("NEW_MESSAGE_TOPIC"), {
      onNewMessage: message
    })
  }

  if (rest.is_chat_with_live_agent && !rest.is_message_from_customer) {
    const chatPlatform = await chatPlatformService().getById({ _id: rest.source })
    const customerData = await getCustomer({ _id: customer })
    const agentData = await agentService.getAgentById(agent)
    // Add conversation_id to params for intercom
    await chatPlatformService().sendMessageToCustomer({ ...params, receipient_id: customerData.external_id, platform: chatPlatform.platform, access_token: chatPlatform.external_access_token, agent_external_id: rest.agent_external_id })
  }


  return message
}
