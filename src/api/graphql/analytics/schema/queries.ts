"use strict";

import gql from "graphql-tag";

export default gql`
  extend type Query {
    counts(input: AnalyticsCountsInput): AnalyticsCounts!
    groups(input: AnalyticsCountsInput): AnalyticsGroups!
    lists(input: AnalyticsListsInput): AnalyticsLists!
  }
`;
