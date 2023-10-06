"use strict";

import gql from "graphql-tag";

export default gql`
  type KnowledgeBase {
    id: ID!
    return_policy: String
    refund_policy: String
    privacy_policy: String,
    faq: [FAQ]
    terms_of_service: String
    shipping_policy: String
    cancellation_policy: String
  }

  # input
  input KnowledgeBaseInput {
    return_policy: String
    refund_policy: String
    privacy_policy: String,
    faq: [FAQ]
    terms_of_service: String
    shipping_policy: String
    cancellation_policy: String
  }


  type FAQ {
    question: String
    answer: String
  }
`;
