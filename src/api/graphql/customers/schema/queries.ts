'use strict'

import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    listCustomers(input: ListCustomersInput): CustomerList!
  }
`
