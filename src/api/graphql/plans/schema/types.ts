'use strict'

import { gql } from 'apollo-server-express'

export default gql`
  type Plan {
    name: String!
    display_name: String!
    price: PositiveFloat!
    features: JSONObject
  }
`
