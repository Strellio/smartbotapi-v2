'use strict'

import { ChatPlatform } from '../../../../../../models/businesses/types'
import { BotResponseCustomData } from '../../../../../../lib/bot-api'
import {
  MESSAGE_MEDIA_TYPE,
  MESSAGE_TYPE
} from '../../../../../../models/messages/schema'
import conversationsService from '../../../../../../services/conversations'

type MessageMedia = {
  url: string
  type: MESSAGE_MEDIA_TYPE
}

export default function formatAndSaveMessage ({
  customer,
  isCustomerMessage,
  isChatWithLiveAgent,
  chatPlatform,
  text,
  media,
  customGenericTemplate = [],
  externalId,
  buttons
}: {
  text?: string
  customer: any
  media?: MessageMedia[]
  customGenericTemplate?: BotResponseCustomData[]
  externalId?: string
  chatPlatform: ChatPlatform
  isCustomerMessage: boolean
  isChatWithLiveAgent: boolean
  buttons?: {
    payload: string
    title: string
  }[]
}) {
  return conversationsService().create({
    business_id: chatPlatform.business.id,
    source: chatPlatform.id,
    customer_id: customer.id,
    external_id: externalId,
    is_message_from_customer: isCustomerMessage,
    is_chat_with_live_agent: isChatWithLiveAgent,
    media,
    type: media?.length
      ? MESSAGE_TYPE.MEDIA
      : customGenericTemplate.length
      ? MESSAGE_TYPE.GENERIC_TEMPLATE
      : MESSAGE_TYPE.TEXT,
    text,
    generic_templates: customGenericTemplate?.map(customData => ({
      image_url: customData.image_url,
      title: customData.title,
      subtitle: customData.subtitle,
      link: customData.default_action.url
    })),
    buttons
  })
}
