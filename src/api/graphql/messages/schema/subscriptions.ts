'use strict'

import { gql } from 'apollo-server-express'

export default gql`
  extend type Subscription {
    onNewAdminMessage: Message!
    onNewCustomerMessage(input: NewCustomerMessageInput!): Message!
  }
`
