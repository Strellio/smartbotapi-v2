'use strict'

import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    getConversation(input: GetConversationInput!): [Message]!
    getConversations(input: GetConversationsInput!): [Message]!
  }
`
