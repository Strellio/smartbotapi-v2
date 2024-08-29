"use strict";

import gql from "graphql-tag";

export default gql`
  extend type Mutation {
    createAccount(input: CreateAccountInput!): AuthUser!
    login(input: LoginInput!): String!
    verifyCode(input: VerifyCodeInput!): AuthUser!
  }
`;
