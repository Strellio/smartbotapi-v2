"use strict";

import gql from "graphql-tag";

export default gql`
  extend type Query {
    listConversations(input: ListConversationsInput!): ListMessages!
  }
`;
