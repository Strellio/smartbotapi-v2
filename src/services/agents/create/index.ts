"use strict";

import schema from "./schema";
import { validate } from "../../../lib/utils";
import agentsModel from "../../../models/agents";
import userService from "../../users";
import chatPlatformService from "../../chat-platforms";
import { ChatPlatform } from "../../../models/businesses/types";

type CreateAgentParams = {
  name: string;
  email?: string;
  is_person: boolean;
  business_id: string;
  profile_url: string;
};

export default async function create(data: CreateAgentParams) {
  const {
    business_id: business,
    email,
    profile_url,
    name,
    is_person=true,
  }: CreateAgentParams = validate(schema, data);

  const user = await userService().updateOrCreate({
    email,
    full_name: name,
    profile_url,
  });

  const chatPlatforms = await chatPlatformService().list({
    business_id: business,
  });

  const linkedChatAgents = await Promise.all(
    chatPlatforms.map(async (chatPlatform: ChatPlatform) => {
      const result = await chatPlatformService().update({
        id: chatPlatform.id,
        business_id: business,
        type: chatPlatform.type,

        agent: {
          is_person,
          name,
          profile_url,
        },
      });
      // find a better way to retrie
      const sortedAgents = result.agents
        .filter((agent) => agent.name === name)
        .sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
      return sortedAgents[0];
    })
  );

  return agentsModel.create({
     business,
      user: user.id,
      linked_chat_agents: linkedChatAgents.map(agent=>agent.id)

  });
}
