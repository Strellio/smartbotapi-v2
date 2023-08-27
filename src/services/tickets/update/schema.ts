'use strict'
import joi from 'joi'
import { objectId } from '../../../lib/joi'
import { TICKET_PRIORITY_ENUM } from '../../../models/tickets/schema'

export default joi.object({
  id: objectId().required(),
  column_id: joi
    .number()
    .integer()
    .min(1)
    .max(4)
    .required(),
  business_id: objectId().required(),
  customer_id: objectId(),
  agent_id: objectId(),
  source: objectId(),
  title: joi.string(),
  description: joi.string(),
  priority: joi.string().valid(...Object.values(TICKET_PRIORITY_ENUM))
})
