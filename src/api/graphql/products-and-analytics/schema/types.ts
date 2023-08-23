"use strict";

import gql from "graphql-tag";

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

  type ProductAnalytic {
    product: [Product!]
    id: ID!
    geo_location: GeoLocationSchema
    device: String
    user_agent: JSONObject
  }

  type LL {
    coordinates: [String]
  }

  type GeoLocationSchema {
    range: [String!]
    country: String
    region: String
    eu: String
    timezone: String
    city: String
    ll: LL
    metro: Int
    area: Int
  }
`;
