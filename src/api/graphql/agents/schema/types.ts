"use strict";

import gql from "graphql-tag";

export default gql`
  type Agent {
    id: ID!
    user: User
    is_person: Boolean
    availability_status: String!
    linked_chat_agents: [ChatAgent!]
    created_at: DateTime!
    updated_at: DateTime!
  }

  input CreateAgentInput {
    name: String!
    profile_url: URL!
    email: EmailAddress!
  }

  input UpdateAgentInput {
    id: ID!
    name: String!
    profile_url: URL!
    email: String!
    linked_chat_agents: [ID]!
  }
`;
