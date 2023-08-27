'use strict'

import { ConversationPart, IntercomWebhookPayload } from '../types'
import chatPlatformService from '../../../../../services/chat-platforms'
import { ChatPlatform } from '../../../../../models/businesses/types'
import getBotResponse, {
  BotResponseCustomData
} from '../../../../../lib/bot-api'
import intercomLib from '../../../../../lib/intercom'
import { formatAndSaveMessage } from '../common'
import * as customerService from '../../../../../services/customers'
import { MESSAGE_MEDIA_TYPE } from '../../../../../models/messages/schema'

const stripTags = require('striptags')

const MAXIMUM_ITEMS_PER_REPLY = 5

const replyWithTemplate = (intercomPayload: any = {}) => (
  templates: Array<any>,
  recipientId: string
) =>
  Promise.all(
    templates
      .slice(0, MAXIMUM_ITEMS_PER_REPLY)
      .map((template: BotResponseCustomData) => {
        return intercomLib().conversations.create({
          ...intercomPayload,
          recipientId,
          text: `<span>  ${template.title} <br> ${template.subtitle} <br/> <a href="${template.buttons[1]?.url}"> Buy </a>  <a href="${template.default_action.url}">See product</a>   <a href='${template.default_action.url}'> <img src='${template.image_url}'  /> </a> </span>`
        })
      })
  )

const handleAsBot = async ({
  intercomPayload,
  chatPlatform,
  customer,
  conversation
}: {
  chatPlatform: ChatPlatform
  intercomPayload: IntercomWebhookPayload
  customer: any
  conversation: any
}) => {
  const agent = chatPlatform.agents.find(agent => !agent.is_person)
  const response = await getBotResponse({
    senderId: intercomPayload.data.item.source.author.id,
    message: stripTags(conversation?.body),
    metadata: {
      business_id: String(chatPlatform.business.id),
      chat_platform_id: String(chatPlatform.id)
    }
  })
  const doReplyWithTemplate = replyWithTemplate({
    conversationId: intercomPayload.data.item.id,
    accessToken: chatPlatform.external_access_token,
    personaId: agent?.external_id as string
  })

  for (let i = 0; i < response.length; i++) {
    const singleEntity = response[i]
    if (singleEntity.text) {
      await intercomLib().conversations.create({
        conversationId: intercomPayload.data.item.id,
        recipientId: singleEntity.recipient_id,
        accessToken: chatPlatform.external_access_token,
        personaId: agent?.external_id as string,
        text: singleEntity.text
      })
      await formatAndSaveMessage({
        customer,
        chatPlatform,
        isChatWithLiveAgent: false,
        isCustomerMessage: false,
        text: singleEntity.text
      })
    } else if (singleEntity.custom?.data) {
      await formatAndSaveMessage({
        customer,
        chatPlatform,
        isChatWithLiveAgent: false,
        isCustomerMessage: false,
        customGenericTemplate: singleEntity.custom.data
      })
      await doReplyWithTemplate(
        singleEntity.custom?.data,
        singleEntity.recipient_id
      )
    }
  }
}

const extractImageFromConversationBody = (body?: string) => {
  const imageTag: string = stripTags(body, '<img>')
  const image = imageTag.match(/\bhttps?:\/\/\S+/gi)
  if (!image) return []
  const imageUrl = image[0]?.replace('">', '')
  return [
    {
      url: imageUrl,
      type: MESSAGE_MEDIA_TYPE.IMAGE
    }
  ]
}

export default async function intercomWebhookController (
  intercomPayload: IntercomWebhookPayload
) {

  const chatPlatform = await chatPlatformService().getByWorkSpaceId(
    intercomPayload.app_id
  )

  const conversation = intercomPayload.data.item.conversation_parts.conversation_parts.pop() as ConversationPart

  const customer = await customerService.createOrUpdate({
    external_id: conversation.author.id,
    source: chatPlatform.id,
    business_id: chatPlatform.business.id,
    name: conversation.author.name?? 'Guest'
  })


  await formatAndSaveMessage({
    customer,
    chatPlatform,
    isChatWithLiveAgent: customer.is_chat_with_live_agent,
    isCustomerMessage: true,
    text: stripTags(conversation?.body),
    externalId: conversation?.id,
    media: extractImageFromConversationBody(conversation?.body).length
      ? extractImageFromConversationBody(conversation?.body)
      : (conversation?.attachments || []).map(attachment => ({
          type: /video/gi.test(attachment.content_type)
            ? MESSAGE_MEDIA_TYPE.VIDEO
            : MESSAGE_MEDIA_TYPE.RAW,
          url: attachment.url
        }))
  })

  return handleAsBot({ intercomPayload, chatPlatform, customer, conversation })
}
