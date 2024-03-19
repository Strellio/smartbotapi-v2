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
import { PLATFORM_MAP } from "../../../models/businesses/schema/enums";

const defaultBotAgent = {
  is_person: false,
  name: "SmartBot",
  profile_url:
    "https://res.cloudinary.com/strellio/image/upload/v1596998837/smartbot-assets/smartbot-logo_hfkihs.png",
};

interface CreateParams {
  business_id: string;
  platform: string;
  external_name?: string;
  external_user_access_token?: string;
  external_user_id?: string;
  external_user_name?: string;
  external_access_token?: string;
  external_id?: string;
  linked_page_id?: string;
  type: string;
  workspace_id?: string;
  external_phone_number_id?: string;
  external_auth_code?: string;
}

async function ensureChatPlatformNotAddedByExternalId(
  platform: string,
  businessId: string,
  externalId?: string
) {
  const chatPlatform = await chatPlatformModel().getByExternalIdAndPlatform(
    platform,
    externalId ? undefined : businessId,
    externalId
  );
  if (chatPlatform) {
    throw errors.throwError({
      name: errors.MissingFunctionParamError,
      message: externalId
        ? "External chat platform account already in use"
        : "Platform already exists",
    });
  }
}

export default async function create(params: CreateParams) {
  // Validate the input parameters
  const payload = validate(schema, params);

  console.log("payload", payload);

  // Retrieve the business details
  const business = await businessModel().getById(params.business_id);

  // Ensure a chat platform with the same external ID doesn't already exist
  await ensureChatPlatformNotAddedByExternalId(
    params.platform,
    business.id,
    params?.external_id
  );

  // Get a list of agents associated with the business
  const agents: Agent[] = (
    await H(agentService.listByBusinessId(params.business_id))
      .collect()
      .toPromise(Promise)
  ).map((agent: any) => agent.toObject()) as any;

  // Find or create a default bot agent if it doesn't exist
  const botAgent = agents.find((agent) => !agent.is_person);

  if (!botAgent) {
    const botAgentResult = await agentService.create({
      ...defaultBotAgent,
      business_id: params.business_id,
    });
    agents.push(botAgentResult);
  }

  // Transform the payload for the chat platform
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

  console.log("transformedPayload", transformedPayload);

  // Create a chat platform
  const chatPlatform = await chatPlatformModel().create({
    ...transformedPayload,
    business: business.id,
  });

  // Update linked agents and their external IDs
  await Promise.all(
    agents.map(async function (agent) {
      let transformedPayload = await chatPlatforms.transformByPlatform({
        payload: {
          agent: {
            ...(agent.is_person
              ? {
                  name: agent.user.full_name,
                  email: agent.user.email,
                  profile_url: agent.user.profile_url,
                }
              : {
                  name: agent.bot_info.name,
                  profile_url: agent.bot_info.profile_url,
                }),
            is_person: agent.is_person,
            action_type: ACTION_TYPE_TO_MONGODB_FIELD.CREATE,
          },
          platform: chatPlatform.platform,
        },
        dbPayload: chatPlatform,
      });

      const agentExternalId = transformedPayload?.agent?.external_id;

      if (agentExternalId) {
        // create agent in chat platorm
        const result = await chatPlatformModel().updateById(
          chatPlatform.id,
          transformedPayload
        );

        const createdAgent = result.agents.findLast(
          (chatPlatformAgent) =>
            chatPlatformAgent.external_id === agentExternalId
        );

        const newLinkedAgents: [string] = [
          ...agent.linked_chat_agents.map((id) => id.toString()),
          createdAgent.id,
        ] as any;

        // console.log(agent.to)

        await agentService.update({
          id: agent.id.toString(),
          ...(agent.is_person
            ? {
                name: agent.user.full_name,
                email: agent.user.email,
                profile_url: agent.user.profile_url,
              }
            : {
                name: agent.bot_info.name,
                profile_url: agent.bot_info.profile_url,
              }),
          is_person: agent.is_person,
          business_id: params.business_id,
          linked_chat_agents: newLinkedAgents,
          status: agent.status,
        });
      }
    })
  );

  // Return the created chat platform
  return chatPlatformModel().getById(chatPlatform.id);
}
