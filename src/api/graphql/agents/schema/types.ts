'use strict'

import { gql } from 'apollo-server-express'

export default gql`
  type Agent {
    id: ID!
    name: String!
    profile_url: URL!
    is_online: Boolean 
    linked_chat_agents: [ChatAgent!] 
    created_at: DateTime!
    updated_at: DateTime!
  }

  input CreateAgentInput{
    name: String!
    profile_url: URL!
  }

  input UpdateAgentInput{
    id: ID!
    name: String!
    profile_url: URL!
    linked_chat_agents: [ID]!
  }

`

