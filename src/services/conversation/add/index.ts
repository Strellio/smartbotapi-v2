'use strict'

import messageModel from '../../../models/messages'
import { validate } from '../../../lib/utils'
import schema from './schema'


interface addMessageParams {
    customer_id:string
    business_id:string
    agent_id?:string
    external_id?:string
    source:string,
    type:string
    media_url?:string
    text?:string
    is_message_from_admin:boolean

}

export default function addMessage(params:addMessageParams){
    validate(schema, params)

}

