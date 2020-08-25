'use strict'
import { gql } from 'apollo-server-express'

export default gql`
  extend type Mutation {
    activateCharge(input: ActivateChargeInput!): String!
    charge(input: ChargeInput!): String!
  }
`
