'use strict'
import { gql } from 'apollo-server-express'

export default gql`
  extend type Mutation {
    changePlan(input: ChangePlanInput!): Business!
    charge(input: ChargeInput!): String!
  }
`
