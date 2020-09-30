"use strict"
import ticketModel from '../../../models/tickets'
import { validate } from '../../../lib/utils'
import schema from './schema'
type CreateTicketParams = {
    customer_id: string
    business_id: string
    source: string
    priority: string
    title: string
    description: string
}

export default async function create(params: CreateTicketParams) {
    const validated: CreateTicketParams = validate(schema, params)
    const {
        customer_id: customer,
        business_id: business,
        ...rest
    } = validated
    return ticketModel().create({
        business,
        customer,
        ...rest
    })



}