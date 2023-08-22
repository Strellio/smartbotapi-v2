"use strict";

import gql from "graphql-tag";

export default gql`
  extend type Mutation {
    createCustomer(input: CreateCustomerInput!): Customer!
  }
`;
