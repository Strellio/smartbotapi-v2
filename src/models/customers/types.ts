import { Business, ChatPlatform } from '../businesses/types'

export type Customer = {
  id?: string
  business: Business
  external_id: string
  source: ChatPlatform
  email?: string
  name?: string
  profile_url?: string
  subscribed?: boolean
  locale?: string
  is_chat_with_live_agent: boolean
}
