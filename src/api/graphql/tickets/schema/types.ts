'use strict'

import { gql } from 'apollo-server-express'
import { TICKET_PRIORITY_ENUM } from '../../../../models/tickets/schema'

const priorityEnum = Object.values(TICKET_PRIORITY_ENUM)

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

  input CreateTicketInput {
    customer_id: ObjectID!
    source: ObjectID!
    title: String!
    description: String!
    column_id: Int!
    priority: TicketPriorityEnum
  }

  input UpdateTicketInput {
    id: ID!
    column_id: Int!
  }

  enum TicketPriorityEnum {
    ${priorityEnum}
  }
`
