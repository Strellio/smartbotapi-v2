"use strict";

import gql from "graphql-tag";
import { AGENT_AVAILABILTY_STATUS } from "../../../../models/agents/schema";

const agentAvailabilityStatus = Object.values(AGENT_AVAILABILTY_STATUS)

export default gql`
  type Agent {
    id: ID!
    user: User
    bot_info: BotInfo
    is_person: Boolean
    availability_status: AgentAvailabiltiyStatusEnum!
    linked_chat_agents: [ChatAgent!]
    created_at: DateTime!
    updated_at: DateTime!
  }

  input CreateAgentInput {
    name: String!
    profile_url: String
    email: EmailAddress!
  }

  enum AgentAvailabiltiyStatusEnum{
    ${agentAvailabilityStatus}

  }

  input UpdateAgentInput {
    id: ID!
    name: String!
    profile_url: String
    email: String!
    linked_chat_agents: [ID]!
    is_person: Boolean
    availability_status:AgentAvailabiltiyStatusEnum
  }

  type BotInfo{
    name: String!
    profile_url: String
  }


  input UpdateAgentAvailabilityInput {
    id: ID!
    availability_status:AgentAvailabiltiyStatusEnum!
  }
`;
