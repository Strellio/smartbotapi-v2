"use strict";

import gql from "graphql-tag";

export default gql`
  type AnalyticsCounts {
    total_customers: Int!
    total_tickets: Int!
    total_messages: Int!
  }

  type AnalyticsGroups {
    users_per_platform: [UsersPerPlatform!]
    engagements: Engagement!
    messages_by_date: [GroupsMessagesByDate!]
  }

  type AnalyticsLists {
    tickets: [Ticket!]
  }

  type GroupsMessagesByDate {
    count: Int
    period: GroupsMessagesByDatePeriod
  }

  type GroupsMessagesByDatePeriod {
    month: Int
    year: Int
    platform: String
  }

  type Engagement {
    current_engagement: SingleEngagement!
    previous_engagement: SingleEngagement!
    performance: Float!
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

  # inputs

  input AnalyticsListsInput {
    column_id: Int
  }

  input AnalyticsCountsInput {
    from_date: DateTime
    end_date: DateTime
  }
`;
