"use strict";

import gql from "graphql-tag";

export default gql`
  type User {
    id: ID!
    email: EmailAddress!
    full_name: String
    country: String
    created_at: DateTime!
    updated_at: DateTime!
    businesses: [Business!]
  }
`;
