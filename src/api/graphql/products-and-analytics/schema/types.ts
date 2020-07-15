'use strict'

import { gql } from 'apollo-server-express'

export default gql`
  type Product {
    id: ID!
    external_id: String!
    title: String!
    image_url: URL!
    price: String!
    url: URL!
    description: String
    email_sent: Boolean
    created_at: DateTime!
    updated_at: DateTime!
  }


  type ProductAnalytic{
    product: [Product!]
    id: ID!
    geo_location: geoLocationSchema
    device:String
    user_agent: JSONObject
  }

  type geoLocationSchema  {
  range: Array
  country: String
  region: String
  eu: String
  timezone: String
  city: String
  ll: {
    type: String,
    coordinates: []
  },
  metro: Number
  area: Number
}
`
