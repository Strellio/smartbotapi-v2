"use strict";
import gql from "graphql-tag";

export default gql`
  extend type Mutation {
    createOrUpdateKnowlegeBase(input: KnowledgeBaseInput!): KnowledgeBase!
    }
`;
