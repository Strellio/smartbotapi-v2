"use strict";

import gql from "graphql-tag";

export default gql`
  extend type Subscription {
    onNewAdminMessage: Message!
    onNewCustomerMessage(input: NewCustomerMessageInput!): Message!
  }
`;
