'use strict'
import { gql } from 'apollo-server-express'

export default gql`
  extend type Mutation {
    addIntercom(input: AddIntercomInput!): String!
    updateChatPlatform(input: UpdateChatPlatformInput!): ChatPlatform!
    createChatPlatform(input: CreateChatPlatformInput!): ChatPlatform!
  }
`
