"use strict";

import gql from "graphql-tag";
import { TICKET_PRIORITY_ENUM } from "../../../../models/tickets/schema";

const priorityEnum = Object.values(TICKET_PRIORITY_ENUM);

export default gql`
  type Ticket {
    id: ID!
    customer: Customer!
    source: MessageSource!
    title: String!
    description: String!
    priority: String!
    ticket_number: String!
    created_at: DateTime
    column_id: Int!
    column: TicketColumn
  }

  type TicketColumn {
    title: String
    id: Int
  }

  type TicketBoard {
    id: Int!
    title: String!
    cards: [Ticket!]
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
    source: ObjectID
    title: String
    description: String
    priority: TicketPriorityEnum
    customer_id: ObjectID
  }

input GetTicketsInput{
  customer: ObjectID
}

  enum TicketPriorityEnum {
    ${priorityEnum}
  }
`;
