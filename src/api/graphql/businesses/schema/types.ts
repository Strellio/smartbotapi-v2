'use strict'

import { gql } from 'apollo-server-express'

export default gql`
  type Location {
    country: String!
    city: String!
  }

  type Shop {
    external_created_at: DateTime
    external_updated_at: DateTime
    external_platform_domain: String!
    money_format: String
  }

  type Business {
    id: ID!
    domain: URL!
    email: EmailAddress!
    status: StatusEnum!
    external_id: String!
    platform: PlatformEnum!
    plan: Plan
    business_name: String!
    location: Location!
    trial_expiry_date: DateTime
    date_upgraded: DateTime
    shop: Shop
    chat_platforms: [ChatPlatform!]
  }

  type Agent {
    id: ID!
    name: String!
    profile_url: URL
    is_online: Boolean
    is_person: Boolean
    linked_chat_agents: [ChatAgent!] # to be changed to platforms
    created_at: DateTime!
    updated_at: DateTime!
  }

  type ChatAgent {
    external_id: String!
    name: String!
    profile_url: URL
    is_person: Boolean
    created_at: DateTime!
    updated_at: DateTime!
  }

  type ChatPlatform {
    id: ID!
    platform: ChatPlatformEnum!
    external_id: String
    agents: [ChatAgent!]
    external_user_id: String
    external_user_name: String
    type: ChatTypeEnum!
    status: StatusEnum!
  }
  type IntercomAgent {
    id: ID!
    email: EmailAddress!
    type: String
    name: String
    away_mode_enabled: String
    away_mode_reassign: String
    has_inbox_seat: String
  }

  # inputs
  input ListIntercomAgents {
    chat_platform_id: ObjectID!
  }
  input CreateChatPlatformInput {
    platform: ChatPlatformEnum!
    external_page_name: String
    external_user_access_token: String
    external_user_id: String
    external_user_name: String
    external_id: String
    type: ChatTypeEnum
  }

  input UpdateChatPlatformInput {
    id: ID!
    status: String
    external_page_name: String
    external_user_access_token: String
    external_user_id: String
    external_user_name: String
    external_id: String
    agents: [ChatAgentInput!]
  }

  input ChatAgentInput {
    external_id: String!
    name: String!
    is_person: Boolean!
    profile_url: String
  }

  input ListChatPlatformsInput {
    status: StatusEnum
    type: ChatTypeEnum
    platform: ChatPlatformEnum
  }
`
