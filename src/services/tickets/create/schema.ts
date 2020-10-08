'use strict'
import joi from 'joi'
import { objectId } from '../../../lib/joi'
import { TICKET_PRIORITY_ENUM } from '../../../models/tickets/schema'

export default joi.object({
  customer_id: objectId().required(),
  business_id: objectId().required(),
  agent_id: objectId(),
  source: objectId().required(),
  title: joi.string().required(),
  description: joi.string().required(),
  column_id: joi.number(),
  priority: joi
    .string()
    .valid(...Object.values(TICKET_PRIORITY_ENUM))
    .default(TICKET_PRIORITY_ENUM.MEDIUM)
})
