'use strict'
import joi from 'joi'
import { MESSAGE_TYPE, MESSAGE_MEDIA_TYPE } from '../../../models/messages/schema'
import { objectId } from '../../../lib/joi'
const messageTypes = Object.values(MESSAGE_TYPE)
const messageMediaTypes = Object.values(MESSAGE_MEDIA_TYPE)

export default joi.object({
    customer_id: objectId().required(),
    business_id: objectId().required(),
    agent_id: objectId(),
    source: objectId(),
    title: joi.string().required(),
    description: joi.string().required(),
    priority: joi.string().required()
})
