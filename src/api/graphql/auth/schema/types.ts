"use strict";

import gql from "graphql-tag";

export default gql`
  type AuthUser {
    user: User!
    token: String!
    redirect_url: String!
  }

  input CreateAccountInput {
    email: EmailAddress!
    full_name: String!
    password: String!
    domain: URL!
    business_name: String!
  }
  input LoginInput {
    email: EmailAddress!
  }
  input VerifyCodeInput {
    email: EmailAddress!
    verification_code: String!
  }
`;
