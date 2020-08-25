'use strict'
import joi from 'joi'
import { objectId } from '../../../lib/joi'

export default joi.object({
    business_id: objectId().required(),
    external_id: joi.string().required(),
    source: joi.string(),
    email: joi.string().email(),
    name: joi.string(),
    profile_url: joi.string().uri(),
    subscribed: joi.boolean(),
    locale: joi.string()
})
