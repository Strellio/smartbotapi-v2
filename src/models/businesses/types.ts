import { PLATFORM_MAP } from './schema/enums'
import { CHAT_PLATFORMS, CHAT_TYPE } from '../chat-platforms/schema'
import { STATUS_MAP } from '../common'

export type Business = {
  id: string
  domain: string
  email: string
  status: string
  external_id: String
  platform: PLATFORM_MAP
  business_name: String
  location: Location
  trial_expiry_date: Date
  date_upgraded: Date
  shop: Shop
  chat_platforms: [ChatPlatform]
}

export type ChatAgent = {
  external_id: string
  name: string
  profile_url: string
  is_person: boolean
  created_at: Date
  updated_at: Date
}

export type ChatPlatform = {
  id: string
  platform: [CHAT_PLATFORMS]
  external_id: string
  agents: [ChatAgent]
  external_user_id: string
  external_user_access_token: string
  external_user_name: string
  external_access_token: string
  external_refresh_token: string
  type: CHAT_TYPE
  status: STATUS_MAP
}

export type Location = {
  country: String
  city: String
}

export type Shop = {
  external_created_at: Date
  external_updated_at: Date
  external_platform_domain: string
  currency: String
  external_access_token: string
  charge_id: string
}

export type Agent = {
  id: string
  name: string
  profile_url: string
  is_online: Boolean
  is_person: Boolean
  linked_chat_agents: [ChatAgent]
  created_at: Date
  updated_at: Date
}
