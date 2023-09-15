'use strict'
import joi from 'joi'
import { objectId } from '../../../lib/joi'


export default joi.object({
    name: joi.string().required().max(20),
    profile_url: joi.string().uri().required(),
    business_id: objectId().required(),
    email: joi.string().email(),
    is_person: joi.boolean().default(true),
})
