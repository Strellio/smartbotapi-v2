'use strict'
import ticketModel from '../../models/tickets'
import create from './create'
import getTicketBoard from "./list"
import update from "./update"

export default function conversationsService() {
    return {
        listByBusiness: ticketModel().listByBusiness,
        create,
        getTicketBoard,
        update
    }
}