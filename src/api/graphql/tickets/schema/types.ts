'use strict'

import { gql } from 'apollo-server-express'

export default gql`
  type Ticket {
    id: ID!
    customer: Customer!
    source: MessageSource!
    title: String!
    description: String!
    priority: String!
    created_at: DateTime
  }

  type TickekBoard {
    id: Int!
    title: String!
    cards: [Ticket]!
  }

  input CreateTicketInput{
    customer_id:ObjectID!
    source:ObjectID
    title:String!
    description:String!
    priority:String! 
   }

   input UpdateTicketInput{
    id: ID!
    column_id: Int
   }
`
