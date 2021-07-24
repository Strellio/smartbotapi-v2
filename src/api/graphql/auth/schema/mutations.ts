'use strict'

import { gql } from 'apollo-server-express'

export default gql`
  extend type Mutation {
    createAccount(input: CreateAccountInput!): AuthUser!
    login(input: LoginInput!): AuthUser!
  }
`
