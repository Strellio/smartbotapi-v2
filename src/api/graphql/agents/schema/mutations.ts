'use strict'
import { gql } from 'apollo-server-express'

export default gql`
  extend type Mutation {
    createAgent(input: CreateAgentInput!): Agent!
    updateAgent(input: UpdateAgentInput!): Agent!

  }
`
