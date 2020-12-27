'use strict'

import * as analyticsService from '../../../../services/analytics'
export default {
  Query: {
    counts: async (parent: any, { input = {} }: any, { business }: any) => {
      const [usersCount, messagesCount, ticketsCount] = await Promise.all([
        analyticsService.counts.usersCount({
          businessId: business.id,
          fromDate: input.from_date,
          toDate: input.end_date
        }),
        analyticsService.counts.messagesCount({
          fromDate: input.from_date,
          toDate: input.end_date,
          businessId: business.id
        }),
        analyticsService.counts.ticketsCount({
          fromDate: input.from_date,
          toDate: input.end_date,
          businessId: business.id
        })
      ])

      return {
        total_customers: usersCount,
        total_messages: messagesCount,
        total_tickets: ticketsCount
      }
    }
  }
}
