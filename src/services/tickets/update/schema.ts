'use strict'
import joi from 'joi'
import { objectId } from '../../../lib/joi'


export default joi.object({
    id: objectId().required(),
    column_id: joi.number().integer().min(1).max(4),
    business_id:objectId().required()
})
