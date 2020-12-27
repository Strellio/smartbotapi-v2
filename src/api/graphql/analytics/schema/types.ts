'use strict'

import { gql } from 'apollo-server-express'

export default gql`
  type Counts {
    total_customers: Int!
    total_tickets: Int!
    total_messages: Int!
  }

  type Groups {
    users_per_platform: [UsersPerPlatform!]
    engagements: Engagement!
  }

  type Engagement {
    current_engagement: SingleEngagement!
    previous_engagement: SingleEngagement!
    performance: Int!
  }

  type SingleEngagement {
    total_messages: Float!
    total_replies: Float!
    engagement_score: Float!
  }

  type UsersPerPlatform {
    count: Int
    platform: String
  }

  input CountsInput {
    from_date: DateTime
    end_date: DateTime
  }
`
