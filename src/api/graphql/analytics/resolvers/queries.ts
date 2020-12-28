'use strict'

import * as analyticsService from '../../../../services/analytics'
const delay = require('util').promisify(setTimeout)
export default {
  Query: {
    counts: async (parent: any, { input = {} }: any, { business }: any) => {
      const [usersCount, messagesCount, ticketsCount] = await Promise.all([
        analyticsService.counts.customersCount({
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
    },
    groups: async (parent: any, { input = {} }: any, { business }: any) => {
      const [usersByPlatform, engagements, messagesByDate] = await Promise.all([
        analyticsService.groups.customersByChatPlatform({
          // fromDate: input.from_date,
          // toDate: input.end_date,
          businessId: business.id
        }),
        analyticsService.groups.engagementPerMonth(business.id),
        analyticsService.groups.messagesByCreatedAt({
          fromDate: input.from_date,
          toDate: input.end_date,
          businessId: business.id
        })
      ])

      return {
        users_per_platform: usersByPlatform,
        engagements,
        messages_by_date: messagesByDate
      }
    },
    lists: async (parent: any, { input = {} }: any, { business }: any) => {
      const [tickets] = await Promise.all([
        analyticsService.lists.latestTickets({
          businessId: business.id,
          columnId: input.column_id
        })
      ])

      return {
        tickets
      }
    }
  }
}
