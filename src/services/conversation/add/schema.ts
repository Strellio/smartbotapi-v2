"use strict"
import joi from 'joi'
import { MESSAGE_TYPE } from '../../../models/messages/schema'
import { text } from 'body-parser'
const messageTypes = Object.values(MESSAGE_TYPE)

export default joi.object({
    customer_id: joi
        .string()
        .guid()
        .required(),
    business_id: joi.string().guid().required,
    source: joi.string().guid().required,
    agent_id: joi.string().guid(),
    type: joi.string().valid(...messageTypes).required(),
    text: joi.string().when("type", { is: MESSAGE_TYPE.TEXT, then: joi.required() }),
    media_url: joi.string().when("type", { is: MESSAGE_TYPE.IMAGE, then: joi.required() }).when("type", { is: MESSAGE_TYPE.VIDEO, then: joi.required() }),
    is_message_from_admin:joi.boolean().default(false).required()


})
