'use strict'
import customersModel from '../../models/customers'
import conversationModel from '../../models/messages'
import ticketsModel from '../../models/tickets'

const customersCount = ({
  fromDate,
  toDate,
  businessId
}: {
  fromDate?: Date
  toDate?: Date
  businessId: string
}) =>
  customersModel().countByBusinessId(
    businessId,
    fromDate || toDate
      ? {
          created_at: {
            ...(fromDate ? { $gte: fromDate } : {}),
            ...(toDate ? { $lte: toDate } : {})
          }
        }
      : {}
  )

const messagesCount = ({
  fromDate,
  toDate,
  businessId
}: {
  fromDate?: Date
  toDate?: Date
  businessId: string
}) =>
  conversationModel().countByBusinessId(
    businessId,
    fromDate || toDate
      ? {
          created_at: {
            ...(fromDate ? { $gte: fromDate } : {}),
            ...(toDate ? { $lte: toDate } : {})
          }
        }
      : {}
  )

const ticketsCount = ({
  fromDate,
  toDate,
  businessId
}: {
  fromDate?: Date
  toDate?: Date
  businessId: string
}) =>
  ticketsModel().countByBusinessId(
    businessId,
    fromDate || toDate
      ? {
          created_at: {
            ...(fromDate ? { $gte: fromDate } : {}),
            ...(toDate ? { $lte: toDate } : {})
          }
        }
      : {}
  )

export { ticketsCount, customersCount, messagesCount }
