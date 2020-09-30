'use strict'

import ticketService from '../../../../services/tickets'
export default {
    Query: {
        getTicketsBoard: async (parent: any, { input }: any, { business }: any) => {
            return ticketService().getTicketBoard(business.id)
        }
    }
}
