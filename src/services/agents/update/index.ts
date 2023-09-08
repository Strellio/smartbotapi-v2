'use strict'

import schema from './schema'
import { validate } from '../../../lib/utils'
import agentsModel from "../../../models/agents";

type UpdateAgentParams = {
    id: string
    name: string
    business_id: string,
    profile_url: string
    linked_chat_agents: [string]
}

export default function update(data: UpdateAgentParams) {
    const { id, business_id: business, ...rest }: UpdateAgentParams = validate(schema, data)
    return agentsModel.update(id, business, rest)
}   