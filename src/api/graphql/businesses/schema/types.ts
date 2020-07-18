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
    currency: String
  }

  type Business {
    domain: String!
    email: EmailAddress!
    status: StatusEnum!
    external_id: String!
    platform: PlatformEnum!
    plan: Plan!
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
    external_user_access_token: String
    external_user_name: String
    external_access_token: String
    external_refresh_token: String
    type: ChatTypeEnum!
    status: StatusEnum!
  }

  # inputs
  input AddIntercomInput {
    business_id: ObjectID!
  }
`
