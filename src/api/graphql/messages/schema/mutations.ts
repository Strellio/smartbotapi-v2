'use strict'

import { gql } from 'apollo-server-express'

export default gql`
  extend type Mutation {
    addMessage(input: AddMessageInput!): Message!
  }
`
