"use strict";

import gql from "graphql-tag";

export default gql`
  type Customer {
    id: ID!
    external_id: String
    source: MessageSource!
    email: EmailAddress
    is_chat_with_live_agent:Boolean!
    name: String
    profile_url: URL
    subscribed: Boolean
    last_subscribe_asked: DateTime
    locale: String
    created_at: DateTime
    updated_at: DateTime
  }

  type CustomerList {
    next_item_cursor: ObjectID
    count: Int
    data: [Customer!]
  }
  input ListCustomersInput {
    name: String
  }

  input CreateCustomerInput {
    name: String!
    email: EmailAddress
    external_id: String
    source: ObjectID!
    profile_url: String
  }


  input UpdateCustomerInput {
    customer_id: ID!
    is_chat_with_live_agent:Boolean
    name: String
    email: EmailAddress
    profile_url: String
  }
`;
