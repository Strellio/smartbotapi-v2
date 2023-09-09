"use strict";

import schema from "./schema";
import { validate } from "../../../lib/utils";
import agentsModel from "../../../models/agents";

import chatPlatformService from "../../chat-platforms";
import { ChatPlatform } from "../../../models/businesses/types";
import { ACTION_TYPE_TO_MONGODB_FIELD } from "../../../models/common";
import { CHAT_PLATFORMS } from "../../../models/chat-platforms/schema";

type UpdateAgentParams = {
  id: string;
  name: string;
  business_id: string;
  profile_url: string;
    is_person: boolean;
  email?:string
  linked_chat_agents: [string];
};

export default async function update(data: UpdateAgentParams) {
  const {
    id,
    business_id: business,
    ...rest
  }: UpdateAgentParams = validate(schema, data);

  const chatPlatforms = await chatPlatformService().list({
    business_id: business,
  });

  await Promise.all(
    chatPlatforms
      .filter(
        (chatPlatform: ChatPlatform) =>
          chatPlatform.platform !== CHAT_PLATFORMS.CUSTOM
      )
      .map(async (chatPlatform: ChatPlatform) => {
        return chatPlatformService().update({
          id: chatPlatform.id,
          business_id: business,
          type: chatPlatform.type,

          agent: {
            ...rest,
            action_type: ACTION_TYPE_TO_MONGODB_FIELD.EDIT,
          },
        });
      })
  );

  return agentsModel.update(id, business, rest);
}
