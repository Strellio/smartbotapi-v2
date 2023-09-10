'use strict'

import { required } from "../../../../../lib/utils"
import { ChatPlatform } from "../../../../../models/businesses/types";
import intercomLib from "../../../../../lib/intercom";
import { ACTION_TYPE_TO_MONGODB_FIELD } from "../../../../../models/common";








export default async function transformData({
    payload = required("payload"),
    dbPayload,
}: {
    payload: any;
    dbPayload: ChatPlatform;
}) {
    if (!payload.agent?.is_person) {
        const [agent] = await intercomLib().admins.get(payload.external_access_token)
        payload.agent = {
            name: agent.name,
            is_person: false,
            external_id: agent.id
        }
    }

    return payload
}