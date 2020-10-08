'use strict'

import ticketsService from '../../../../services/tickets'

export default {
  Mutation: {
    createTicket: (parent: any, { input }: any, { business }: any) => {
      return ticketsService().create({ ...input, business_id: business.id })
    },
    updateTicket: async (parent: any, { input }: any, { business }: any) => {
      return ticketsService().update({
        ...input,
        business_id: business.id
      })
    }
  }
}
