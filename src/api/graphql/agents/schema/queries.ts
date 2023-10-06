"use strict";
import gql from "graphql-tag";

export default gql`
  extend type Query {
    listAgents: [Agent!]
    getAgent: Agent!
    getBotAgent: Agent!

  }
`;
