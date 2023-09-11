'use strict'

import { validate } from "../../../lib/utils"
import schema from './schema'
import customerModel from "../../../models/customers"

type UpdateParameters = {
    business_id: string
    customer_id: string

    external_id?: string
    source?: string
    email?: string
    name?: string
    profile_url?: string
    subscribed?: boolean
    locale?: string
    is_chat_with_live_agent?: boolean
}



export default async function update(params: UpdateParameters) {
    const { business_id, customer_id,  ...validated }: UpdateParameters = validate(schema)(params)
    return customerModel().update({
        query: { business: business_id, _id: customer_id},
        update: validated
    })
}