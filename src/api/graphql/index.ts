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

//Plan

import planSchema from './plans/schema'

//message

import messageSchema from './messages/schema'

//customers

import customerSchema from './customers/schema'

// product and analytics
import productAndAnalytics from './products-and-analytics/schema'

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
  ...productAndAnalytics
] as any
export const resolvers = [scalarResolvers]
