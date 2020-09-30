'use strict'
import ticketModel from '../../../models/tickets'
import { columns } from "../../../models/tickets/schema"
import H from "highland"

export default async function getTicketBoard(businessId: string) {
    const tickets = await H(ticketModel().listByBusiness(businessId)).collect().toPromise(Promise)
    const board = columns.map(column => {
        const columnTickets = tickets.filter((ticket: any) => ticket.column_id === column.id)

        return {
            id: column.id,
            title: column.title,
            cards: columnTickets
        }
    })

    return board

}