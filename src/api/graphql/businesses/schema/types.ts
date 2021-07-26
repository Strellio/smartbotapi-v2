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
    external_id: String
    platform: PlatformEnum!
    plan: Plan
    business_name: String
    location: Location!
    trial_expiry_date: DateTime
    date_upgraded: DateTime
    shop: Shop
    chat_platforms: [ChatPlatform!]
    is_external_platform: Boolean
  }

  type ChatAgent {
    id: ID!
    external_id: String!
    name: String!
    profile_url: URL
    is_person: Boolean
    created_at: DateTime!
    updated_at: DateTime!
    platform: String
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
    logged_in_greetings: String
    logged_out_greetings: String
    theme_color: String
    workspace_id: String
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
    external_page_name: String
    external_user_access_token: String
    external_user_id: String
    external_user_name: String
    external_id: String
    agent: ChatAgentInput
    workspace_id: String
    logged_in_greetings: String
    logged_out_greetings: String
    theme_color: String
    type: ChatTypeEnum
    status: StatusEnum
  }

  input ChatAgentInput {
    id: ID
    external_id: String
    name: String!
    is_person: Boolean!
    profile_url: String
    action_type: ActionTypes = CREATE
  }

  input ListChatPlatformsInput {
    status: StatusEnum
    type: ChatTypeEnum
    platform: ChatPlatformEnum
  }
`
