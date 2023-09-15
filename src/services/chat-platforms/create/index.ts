"use strict";
import H from "highland";
import businessModel from "../../../models/businesses";
import { validate } from "../../../lib/utils";
import schema from "./schema";
import * as chatPlatforms from "../platforms";
import chatPlatformModel from "../../../models/chat-platforms";
import errors from "../../../lib/errors";
import { compact } from "lodash";
import config from "../../../config";
import agentService from "../../agents";
import { Agent, ChatAgent } from "../../../models/businesses/types";
import { ACTION_TYPE_TO_MONGODB_FIELD } from "../../../models/common";

const defaultBotAgent = {
  is_person: false,
  name: "SmartBot",
  profile_url:
    "https://res.cloudinary.com/strellio/image/upload/v1596998837/smartbot-assets/smartbot-logo_hfkihs.png",
};

interface createParams {
  business_id: string;
  platform: string;
  external_page_name?: string;
  external_user_access_token?: string;
  external_user_id?: string;
  external_user_name?: string;
  external_access_token?: string;
  external_id?: string;
  type: string;
  workspace_id?: string;
}

const ensureChatPlatformNotAddedByExternalId = async (
  platform: string,
  businessId: string,
  externalId?: string
) => {
  const chatPlatform = await chatPlatformModel().getByExternalIdAndPlatform(
    platform,
    businessId,
    externalId
  );
  if (chatPlatform) {
    throw errors.throwError({
      name: errors.MissingFunctionParamError,
      message: "chat platform already exists",
    });
  }
};

export default async function create(params: createParams) {
  const payload = validate(schema, params);
  const business = await businessModel().getById(params.business_id);
  await ensureChatPlatformNotAddedByExternalId(
    params.platform,
    business.id,
    params?.external_id
  );

  const agents: Agent[] = (await H(
    agentService.listByBusinessId(params.business_id)
  )
    .collect()
    .toPromise(Promise)) as any;

  const botAgent = agents.find((agent) => !agent.is_person);

  if (!botAgent) {
    const botAgentReuslt = await agentService.create({
      ...defaultBotAgent,
      business_id: params.business_id,
    });
    agents.push(botAgentReuslt);
  }

  const transformedPayload = await chatPlatforms.transformByPlatform({
    payload: {
      ...payload,
      whitelistedDomains: compact([
        business.domain,
        business.shop.external_platform_domain,
        config.WIDGET_URL,
      ]),
    },
  });

  const chatPlatform = await chatPlatformModel().create({
    ...transformedPayload,
    business: business.id,
  });

  await Promise.all(
    agents.map(async (agent) => {
      const transformedPayload = await chatPlatforms.transformByPlatform({
        payload: {
          agent: {
            ...agent,
            action_type: ACTION_TYPE_TO_MONGODB_FIELD.CREATE,
          },

          platform: chatPlatform.platform,
        },
        dbPayload: chatPlatform,
      });

      if (transformedPayload.agent.external_id) {
        const result = await chatPlatformModel().updateById(
          chatPlatform.id,
          transformedPayload
        );

        const createdAgent = result.agents.find(
          (chatPlatformAgent) =>
            chatPlatformAgent.external_id ===
            transformedPayload.agent.external_id
        );

        const newLinkedAgents: [string] = [
          ...agent.linked_chat_agents,
          createdAgent.id,
        ] as any;

        await agentService.update({
          ...agent,
          id: agent.id,
          ...(agent.is_person
            ? { ...agent.user, name: agent.user.full_name }
            : agent.bot_info),
          is_person: agent.is_person,
          business_id: params.business_id,
          linked_chat_agents: newLinkedAgents,
        });
      }
    })
  );

  return chatPlatformModel().getById(chatPlatform.id);
}
