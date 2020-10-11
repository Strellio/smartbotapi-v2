import { Agent, ChatPlatform } from '../businesses/types'
import { Customer } from '../customers/types'
import { MESSAGE_MEDIA_TYPE, MESSAGE_TYPE } from './schema'

export type Message = {
  id: string
  customer: Customer
  agent: Agent
  external_id: string
  business: string
  type: MESSAGE_TYPE
  media: MessageMedia[]
  text: string
  is_chat_with_live_agent: boolean
  is_message_from_customer: boolean
  is_message_sent: boolean
  source: ChatPlatform
  created_at?: string
  generic_templates: MessageGenericTemplate[]
}

export type MessageMedia = {
  url: string
  type: MESSAGE_MEDIA_TYPE
}

export type MessageGenericTemplate = {
  title: string
  subtitle: string
  image_url: URL
}
