"use strict";

import { required } from "../../../../../lib/utils";
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
  if (payload.agent && !payload.agent?.is_person) {
    if (!payload.agent?.external_id) {
      const [agent] = await intercomLib().admins.get(
        dbPayload?.external_access_token || payload.external_access_token
      );
      payload.agent.external_id = `${agent.id}`;
    }
    payload.agent = {
      ...payload.agent,
      action_type: payload.agent.action_type,
      is_person: false,
    };
  }

  return payload;
}
