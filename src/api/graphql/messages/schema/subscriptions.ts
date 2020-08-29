'use strict'

import { gql } from 'apollo-server-express'

export default gql`
  extend type Subscription {
    onNewMessage: Message!
  }
`
