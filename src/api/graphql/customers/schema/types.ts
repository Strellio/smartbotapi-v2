'use strict'

import { gql } from 'apollo-server-express'

export default gql`
  type Customer {
    id: ID!
    external_id: String!
    source: ChatPlatform!
    email: EmailAddress
    name: String
    profile_url: URL
    subscribed: Boolean
    last_subscribe_asked: DateTime
    locale: String
  }
`
