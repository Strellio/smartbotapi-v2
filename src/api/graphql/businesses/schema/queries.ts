"use strict";
import gql from "graphql-tag";

export default gql`
  extend type Query {
    listIntercomAgents(input: ListIntercomAgents!): [IntercomAgent!]
    listChatPlatforms(input: ListChatPlatformsInput): [ChatPlatform!]
    getBusiness: Business!
    getWidgetSettings: ChatPlatform
  }
`;
