"use strict";

import gql from "graphql-tag";

export default gql`
  extend type Mutation {
    addMessage(input: AddMessageInput!): Message!
  }
`;
