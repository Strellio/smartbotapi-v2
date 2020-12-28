'use strict'
import ticketModel from '../../../models/tickets'
import { columns } from '../../../models/tickets/schema'
import H from 'highland'

export default async function getTicketBoard ({
  businessId,
  ...rest
}: {
  businessId: string
  [x: string]: any
}) {
  const tickets = await H(
    ticketModel().listByBusiness({
      business: businessId,
      ...rest
    })
  )
    .collect()
    .toPromise(Promise as any)
  const board = columns.map(column => {
    const columnTickets = tickets.filter(
      (ticket: any) => ticket.column_id === column.id
    )

    return {
      id: column.id,
      title: column.title,
      cards: columnTickets
    }
  })

  return board
}
