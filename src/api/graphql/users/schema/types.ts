"use strict";

import gql from "graphql-tag";

export default gql`
  type User {
    id: ID!
    email: EmailAddress!
    full_name: String
    country: String
    profile_url: URL
    is_online: Boolean
    created_at: DateTime!
    updated_at: DateTime!
    businesses: [Business!]
  }
`;
