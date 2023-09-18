"use strict";

import schema from "./schema";
import { validate } from "../../../lib/utils";
import agentsModel from "../../../models/agents";
import userService from "../../users";
import chatPlatformService from "../../chat-platforms";
import { ChatPlatform } from "../../../models/businesses/types";
import { ACTION_TYPE_TO_MONGODB_FIELD } from "../../../models/common";
import { CHAT_PLATFORMS } from "../../../models/chat-platforms/schema";
import { uploadProfile } from "../../users/create";

type CreateAgentParams = {
  name: string;
  email?: string;
  is_person: boolean;
  business_id: string;
    profile_url?: string;
    country?:string
};

export default async function create(data: CreateAgentParams) {
  const payload=  validate(schema, data);
        
  const profileUrl = await uploadProfile(payload)

  if (profileUrl) {
    payload.profile_url = profileUrl

  }
    
  const {
    business_id: business,
    email,
    profile_url,
    name,
    is_person = true,
  }: CreateAgentParams = payload
    
  const user = is_person && await userService().updateOrCreate({
    email,
    full_name: name,
    profile_url,
  });

  const chatPlatforms = await chatPlatformService().list({
    business_id: business,
  });

  const linkedChatAgents = await Promise.all(
    chatPlatforms.filter((chatPlatform:ChatPlatform)=> chatPlatform.platform !== CHAT_PLATFORMS.CUSTOM).map(async (chatPlatform: ChatPlatform) => {
      const result = await chatPlatformService().update({
        id: chatPlatform.id,
        business_id: business,
        type: chatPlatform.type,

        agent: {
            is_person,
            email,
          name,
          profile_url,
          action_type: ACTION_TYPE_TO_MONGODB_FIELD.CREATE,
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
      user: user?.id,
      is_person,
      ...(!is_person && {
          bot_info: {
              name,
              profile_url
          }
      }),
    linked_chat_agents: linkedChatAgents.map((agent) => agent.id),
  })
    
    
}
