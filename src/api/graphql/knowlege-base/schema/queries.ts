"use strict";
import gql from "graphql-tag";

export default gql`
  extend type Query {
    getKnowlegeBase: KnowledgeBase
  }
`;
