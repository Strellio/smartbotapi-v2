'use strict'

import schema from './schema'
import { validate } from '../../../lib/utils'
import agentsModel from "../../../models/agents";

type CreateAgentParams = {
    name: string
    business_id: string,
    profile_url: string
}

export default function create(data: CreateAgentParams) {
    const { business_id: business, ...rest }: CreateAgentParams = validate(schema, data)
    return agentsModel.create({
        ...rest,
        business
    })
}   