'use strict'

import { gql } from 'apollo-server-express'

export default gql`
  type Plan {
    id: ID!
    name: String!
    display_name: String!
    price: NonNegativeFloat!
    duration: String
    icon_class: String
    features: JSONObject
  }

  # input
  input ActivateChargeInput {
    business_id: ObjectID!
    plan_id: ObjectID!
    charge_id: String
  }

  input ChargeInput {
    business_id: ObjectID!
    plan_id: ObjectID!
  }
`
