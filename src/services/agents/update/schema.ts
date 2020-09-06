'use strict'
import joi from 'joi'
import { objectId } from '../../../lib/joi'


export default joi.object({
    id: objectId().required(),
    name: joi.string().max(20).required(),
    profile_url: joi.string().uri().required(),
    business_id: objectId().required(),
    linked_chat_agents: joi.array().items(objectId()).required()
})
