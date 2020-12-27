'use strict'

import { gql } from 'apollo-server-express'

export default gql`
  type Counts {
    total_users: Int!
    total_tickets: Int!
    total_messages: Int!
  }

  input CountsInput {
    from_date: DateTime
    end_date: DateTime
  }
`
