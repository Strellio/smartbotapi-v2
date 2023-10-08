"use strict";

import gql from "graphql-tag";

export default gql`
  type KnowledgeBase {
    id: ID!
    return_refund_policy: String
    privacy_policy: String,
    faq: [FAQ]
    terms_of_service: String
    shipping_policy: String
    cancellation_policy: String
    promotions_discounts: String
    contacts: String
  }

  # input
  input KnowledgeBaseInput {
    return_refund_policy: String
    privacy_policy: String,
    faq: [FAQInput]
    terms_of_service: String
    shipping_policy: String
    cancellation_policy: String
    promotions_discounts: String  
    contacts: String
  }


  type FAQ {
    question: String
    answer: String
  }

  input FAQInput {
    question: String
    answer: String
  }
`;
