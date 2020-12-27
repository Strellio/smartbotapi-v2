'use strict'

import { gql } from 'apollo-server-express'

export default gql`
  extend type Query {
    counts(input: CountsInput): Counts!
  }
`
