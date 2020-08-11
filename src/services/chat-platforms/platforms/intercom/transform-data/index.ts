'use strict'

import { required } from "../../../../../lib/utils"
import { ChatPlatform } from "../../../../../models/businesses/types";
import intercomLib from "../../../../../lib/intercom";








export default async function transformData({
    payload = required("payload"),
    dbPayload,
}: {
    payload: any;
    dbPayload: ChatPlatform;
}) {
    if (!dbPayload) {
        const [agent] = await intercomLib().admins.get(payload.external_access_token)
        payload.agents = {
            name: agent.name,
            is_person: false,
            external_id: agent.id
        }
    }

    return payload
}