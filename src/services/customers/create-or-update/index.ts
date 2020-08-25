'use strict'

import { validate } from "../../../lib/utils"
import schema from './schema'
import customerModel from "../../../models/customers"

type CreateOrUpdateParameters = {
    business_id: string
    external_id: string
    source: string
    email?: string
    name?: string
    profile_url?: string
    subscribed?: boolean
    locale?: string
}



export default async function createOrUpdate(params: CreateOrUpdateParameters) {
    const { business_id, ...validated }: CreateOrUpdateParameters = validate(schema)(params)
    return customerModel().createOrUpdate({
        query: { business: business_id, external_id: validated.external_id, source: validated.source },
        update: {
            business: business_id,
            ...validated
        }
    })
}