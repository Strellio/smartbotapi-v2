'use strict'

import ticketBoard from '../../models/tickets'

const latestTickets = ({
  businessId,
  columnId
}: {
  businessId: string
  columnId?: string
}) =>
  ticketBoard()
    .paginateByBusiness({
      business: businessId,
      ...(columnId ? { column_id: columnId } : {})
    })
    .then(response => response.data)

export { latestTickets }
