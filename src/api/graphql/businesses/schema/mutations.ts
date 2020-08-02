'use strict'
import { gql } from 'apollo-server-express'

export default gql`
  extend type Mutation {
    addIntercom: String!
    updateChatPlatform(input: UpdateChatPlatformInput!): ChatPlatform!
    createChatPlatform(input: CreateChatPlatformInput!): ChatPlatform!
  }
`
