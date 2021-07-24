'use strict'

import { gql } from 'apollo-server-express'

export default gql`
  type AuthUser {
    user: User!
    token: String!
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
    password: String!
  }
`
