'use strict'
import joi from 'joi'
import { objectId } from '../../../lib/joi'
import { defaultProfilePic } from '../create/schema'


export default joi.object({
    id: objectId().required(),
    name: joi.string().max(20).required(),
    profile_url: joi.string().default(defaultProfilePic),
    business_id: objectId().required(),
    email: joi.string().email(),
    is_person: joi.boolean().default(true),
    linked_chat_agents: joi.array().items(objectId()).required()
})
