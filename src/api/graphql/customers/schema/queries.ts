"use strict";

import gql from "graphql-tag";

export default gql`
  extend type Query {
    listCustomers(input: ListCustomersInput): CustomerList!
  }
`;
