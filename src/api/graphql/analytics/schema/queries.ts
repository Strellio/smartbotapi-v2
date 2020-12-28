'use strict'

import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    counts(input: AnalyticsCountsInput): AnalyticsCounts!
    groups(input: AnalyticsCountsInput): AnalyticsGroups!
    lists(input: AnalyticsListsInput): AnalyticsLists!
  }
`
