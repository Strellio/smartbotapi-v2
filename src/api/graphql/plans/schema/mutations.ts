"use strict";
import gql from "graphql-tag";

export default gql`
  extend type Mutation {
    activateCharge(input: ActivateChargeInput!): String!
    charge(input: ChargeInput!): String!
  }
`;
