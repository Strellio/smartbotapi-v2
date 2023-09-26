"use strict";
import gql from "graphql-tag";

export default gql`
  extend type Mutation {
    createAgent(input: CreateAgentInput!): Agent!
    updateAgent(input: UpdateAgentInput!): Agent!
    updateAgentAvailability(input: UpdateAgentAvailabilityInput!): Agent!

  }
`;
