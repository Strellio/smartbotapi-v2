"use strict";

import chatPlatformModel from "../../../models/chat-platforms";
import schema from "./schema";
import { validate } from "../../../lib/utils";
import * as chatPlatforms from "../platforms";
import {
  ACTION_TYPE_TO_MONGODB_FIELD,
  STATUS_MAP,
} from "../../../models/common";
import H from "highland";
import {
  CHAT_TYPE,
  CHAT_PLATFORMS,
} from "../../../models/chat-platforms/schema";
import errors from "../errors";
import businessModel from "../../../models/businesses";
import { Plan } from "../../../models/plans/types";
import agentService from "../../agents";
import { Agent } from "../../../models/businesses/types";
import agentsModel from "../../../models/agents";
import { tr } from "date-fns/locale";

interface updateParams {
  id: string;
  status?: STATUS_MAP;
  business_id: string;
  external_page_name?: string;
  external_user_access_token?: string;
  external_user_id?: string;
  external_user_name?: string;
  external_access_token?: string;
  type: CHAT_TYPE;
  external_id?: string;
  agent?: {
    id?: string;
    external_id?: string;
    name: string;
    email?: string;
    profile_url: string;
    is_person: boolean;
    action_type: ACTION_TYPE_TO_MONGODB_FIELD;
    main_agent_id?: string;
  };
}

const ensureNoPlatformIsOnsiteAndActive = async (
  status: STATUS_MAP,
  businessId: string,
  platform: CHAT_PLATFORMS,
  type: CHAT_TYPE
) => {
  if (!status || status === STATUS_MAP.DEACTIVATED) return;
  const list: Array<any> = await H(
    chatPlatformModel().listByBusinessId(businessId, {
      status: STATUS_MAP.ACTIVE,
      type: { $in: [CHAT_TYPE.BOTH, CHAT_TYPE.ON_SITE] },
    })
  )
    .collect()
    .toPromise(Promise as any);
  const isTypeBothOrOnSite =
    type == CHAT_TYPE.BOTH || type === CHAT_TYPE.ON_SITE;
  if (list.length && list[0].platform !== platform && isTypeBothOrOnSite) {
    throw errors.onlyOneChatPlatformCanBeOnSiteAndActiveError(list[0].platform);
  }
};

const ensurePlanSupportPlatform = async (
  businessId: string,
  platform: CHAT_PLATFORMS,
  status: STATUS_MAP
) => {
  const business = await businessModel().getById(businessId);
  const isPlatformSupported = (
    business.plan as Plan
  )?.features?.allowed_external_platforms.includes(platform);
  if (!isPlatformSupported && status === STATUS_MAP.ACTIVE) {
    throw errors.upgradeToAccessChatPlatformError(platform);
  }
};

export default async function update(params: updateParams) {
  const {
    id,
    business_id: businessId,
    ...rest
  }: updateParams = validate(schema, params);
  const chatPlatform = await chatPlatformModel().getById(id);

  await ensurePlanSupportPlatform(
    businessId,
    chatPlatform.platform,
    rest.status
  );

  await ensureNoPlatformIsOnsiteAndActive(
    rest.status,
    businessId,
    chatPlatform.platform,
    rest.type
  );

  console.log("rest", rest);
  const transformedPayload = await chatPlatforms.transformByPlatform({
    payload: {
      ...rest,
      platform: chatPlatform.platform,
    },
    dbPayload: chatPlatform,
  });

  const result = await chatPlatformModel().updateById(chatPlatform.id, {
    ...transformedPayload,
  });

  const agentExternalId = transformedPayload?.agent?.external_id;

  const agentId = rest.agent?.main_agent_id;

  if (agentId) {
    const agent = (await agentService.getAgentById(agentId)) as never as Agent;

    let newLinkedAgents: string[] = [
      ...agent.linked_chat_agents.map((id) => id.toString()),
    ];

    if (rest?.agent?.action_type === ACTION_TYPE_TO_MONGODB_FIELD.CREATE) {
      const agentToUpdate = result.agents.find(
        (chatPlatformAgent) => chatPlatformAgent.external_id === agentExternalId
      );
      newLinkedAgents = [...newLinkedAgents, agentToUpdate.id] as any;
    } else if (
      rest?.agent?.action_type === ACTION_TYPE_TO_MONGODB_FIELD.DELETE
    ) {
      newLinkedAgents = newLinkedAgents.filter((id) => id !== rest.agent.id);
    }

    console.log("newLinkedAgents", newLinkedAgents);

    await agentsModel.update(
      agent.id.toString(),
      businessId,

      {
        linked_chat_agents: newLinkedAgents,
      }
    );
  }

  return result;
}
