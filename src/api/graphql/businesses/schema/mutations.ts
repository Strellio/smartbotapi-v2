"use strict";
import gql from "graphql-tag";

export default gql`
  extend type Mutation {
    addIntercom: String!
    updateChatPlatform(input: UpdateChatPlatformInput!): ChatPlatform!
    createChatPlatform(input: CreateChatPlatformInput!): ChatPlatform!
  }
`;
