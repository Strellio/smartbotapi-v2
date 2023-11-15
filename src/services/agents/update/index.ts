"use strict";

import schema, { updateAvailabilitySchema } from "./schema";
import { validate } from "../../../lib/utils";
import agentsModel from "../../../models/agents";
import userService from "../../users";
import chatPlatformService from "../../chat-platforms";
import { ChatPlatform } from "../../../models/businesses/types";
import { ACTION_TYPE_TO_MONGODB_FIELD } from "../../../models/common";
import { uploadProfile } from "../../users/create";
import { AGENT_AVAILABILTY_STATUS } from "../../../models/agents/schema";

type UpdateAgentParams = {
  id: string;
  name: string;
  business_id: string;
  profile_url: string;
  is_person: boolean;
  email?: string;
  linked_chat_agents: [string];
};

type UpdateAvailabilityParams = {
  id: string;
  availability_status: AGENT_AVAILABILTY_STATUS;
};

export default async function update(data: UpdateAgentParams) {
  const payload = validate(schema, data);

  const chatPlatforms = await chatPlatformService().list({
    business_id: payload.business_id,
  });

  const profileUrl = await uploadProfile(payload);

  if (profileUrl) {
    payload.profile_url = profileUrl;
  }

  const { id, business_id: business, ...rest }: UpdateAgentParams = payload;

  await Promise.all(
    chatPlatforms
      .filter(
        (chatPlatform: ChatPlatform) => chatPlatform.is_external_agent_supported
      )
      .map(async (chatPlatform: ChatPlatform) => {
        const agent = chatPlatform.agents.find((agent) =>
          rest.linked_chat_agents.includes(agent.id)
        );

        if (agent) {
          return chatPlatformService().update({
            id: chatPlatform.id,
            business_id: business,
            type: chatPlatform.type,

            agent: {
              ...rest,
              id: agent.id,
              action_type: ACTION_TYPE_TO_MONGODB_FIELD.EDIT,
            },
          });
        }
      })
  );

  if (rest.is_person && rest.email) {
    await userService().updateOrCreate({
      ...rest,
      full_name: rest.name,
      email: rest.email as string,
    });
  }
  if (!rest.is_person) {
    rest["bot_info"] = {
      name: rest.name,
      profile_url: rest.profile_url,
    } as any;
  }

  return agentsModel.update(id, business, rest);
}

export function updateAvailability(data: UpdateAvailabilityParams) {
  const payload = validate(updateAvailabilitySchema, data);

  const { id, availability_status, business_id } = payload;

  return agentsModel.update(id, business_id, { availability_status });
}
