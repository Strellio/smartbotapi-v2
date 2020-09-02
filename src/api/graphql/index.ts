'use strict'
import { gql } from 'apollo-server-express'
import {
  typeDefs as scalarTypeDefs,
  resolvers as scalarResolvers
} from 'graphql-scalars'
// common
import customSchema from './common/schema'
// users
import usersSchema from './users/schema'

// Business
import businessesSchema from './businesses/schema'
import businessResolvers from './businesses/resolvers'
//Plan

import planSchema from './plans/schema'
import planResolver from './plans/resolvers'

//message
import messageSchema from './messages/schema'
import messageResolver from './messages/resolvers'

//customers
import customerSchema from './customers/schema'
import customerResolver from './customers/resolvers'
// product and analytics
import productAndAnalytics from './products-and-analytics/schema'

// agents (persons)
import agentsResolver from "./agents/resolvers";
import agentsSchema from './agents/schema'

const baseSchema = gql`
  type Query {
    welcome: String
  }
  type Mutation {
    _: Boolean
  }
  type Subscription {
    _: Boolean
  }
`

export const schemas = [
  baseSchema,
  ...customSchema,
  ...scalarTypeDefs,
  ...usersSchema,
  ...businessesSchema,
  ...planSchema,
  ...messageSchema,
  ...customerSchema,
  ...productAndAnalytics,
  ...agentsSchema
] as any
export const resolvers = [
  scalarResolvers,
  ...businessResolvers,
  ...planResolver,
  ...messageResolver,
  ...customerResolver,
  ...agentsResolver
]
