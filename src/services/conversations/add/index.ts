'use strict'

import messageModel from '../../../models/messages'
import { validate } from '../../../lib/utils'
import schema from './schema'
// import sendMessageToCustomer from '../chat-platforms'

interface addMessageParams {
  customer_id: string
  business_id: string
  agent_id?: string
  external_id?: string
  chat_platform_id: string
  type: string
  media_url?: string
  text?: string
  is_message_from_admin: boolean
}

export default async function addMessage (params: addMessageParams) {
  validate(schema, params)
  const {
    customer_id,
    business_id,
    agent_id,
    chat_platform_id,
    ...rest
  } = params
  const message = await messageModel().create({
    data: {
      customer: customer_id,
      business: business_id,
      agent: agent_id,
      source: chat_platform_id,
      ...rest
    },
    populate: ['agent', 'source', 'business']
  })

  if (params.is_message_from_admin) {
    // sendMessageToCustomer(params)
  }
}
