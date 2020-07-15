'use strict'

import { gql } from 'apollo-server-express'

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
`
