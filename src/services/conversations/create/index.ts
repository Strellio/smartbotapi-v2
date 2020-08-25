'use strict'

import messageModel from '../../../models/messages'
import { validate } from '../../../lib/utils'
import schema from './schema'
import chatPlatformService from "../../chat-platforms"
import { MESSAGE_TYPE, MESSAGE_MEDIA_TYPE } from '../../../models/messages/schema'

type Media = { url: string, type: MESSAGE_MEDIA_TYPE }

type CreateMessageParams = {
  customer_id: string
  business_id: string
  agent_id?: string
  external_id?: string
  source: string
  type: MESSAGE_TYPE
  media?: Media[]
  text?: string
  is_message_from_admin: boolean
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

  if (rest.is_message_from_admin) {
    await chatPlatformService().sendMessageToCustomer(params)
  } else {
    // notify admin here 
    console.log("notify business");
  }

  return message
}
