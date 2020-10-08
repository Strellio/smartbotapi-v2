'use strict'

import schema from './schema'
import { validate } from '../../../lib/utils'
import ticketModel from '../../../models/tickets'

type UpdateTicketParams = {
  id: string
  column_id: number
  business_id: string
}

export default function update (data: UpdateTicketParams) {
  const { id, business_id: business, ...rest }: UpdateTicketParams = validate(
    schema,
    data
  )
  return ticketModel().update({ id, business, ...rest })
}
