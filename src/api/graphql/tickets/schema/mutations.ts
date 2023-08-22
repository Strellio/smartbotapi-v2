"use strict";

import gql from "graphql-tag";

export default gql`
  extend type Mutation {
    createTicket(input: CreateTicketInput!): Ticket!
    updateTicket(input: UpdateTicketInput!): Ticket!
  }
`;
