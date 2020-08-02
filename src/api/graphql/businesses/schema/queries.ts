'use strict'
import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    listIntercomAgents(input: ListIntercomAgents!): [IntercomAgent!]
    listChatPlatforms(input: ListChatPlatformsInput): [ChatPlatform!]
    getBusiness: Business!
  }
`
