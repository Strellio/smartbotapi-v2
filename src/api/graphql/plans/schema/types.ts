"use strict";

import gql from "graphql-tag";

export default gql`
  type Plan {
    id: ID!
    name: String!
    display_name: String!
    price: NonNegativeFloat!
    duration: String
    icon_class: String
    features: JSONObject
    display_features:[String]!
  }

  # input
  input ActivateChargeInput {
    business_id: ObjectID!
    plan_id: ObjectID!
    charge_id: String
    platform: String!
  }

  input ChargeInput {
    business_id: ObjectID!
    plan_id: ObjectID!
  }
`;
