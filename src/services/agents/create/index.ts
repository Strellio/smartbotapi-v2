"use strict";

import schema from "./schema";
import { validate } from "../../../lib/utils";
import agentsModel from "../../../models/agents";
import userService from "../../users";
import chatPlatformService from "../../chat-platforms";
import { Business, ChatPlatform } from "../../../models/businesses/types";
import { ACTION_TYPE_TO_MONGODB_FIELD } from "../../../models/common";
import { uploadProfile } from "../../users/create";
import businessService from "../../businesses";
import H from "highland";
import { Plan } from "../../../models/plans/types";
import { STATUS_MAP } from "../../../models/common";

type CreateAgentParams = {
  name: string;
  email?: string;
  is_person: boolean;
  business_id: string;
  profile_url?: string;
  country?: string;
};

const ensureCanAddMoreLiveAgents = async (business: Business) => {
  const businessAgents = await H(
    agentsModel.fetch({
      query: {
        business: business.id,
        is_person: true,
        status: STATUS_MAP.ACTIVE,
      },
    })
  )
    .collect()
    .toPromise(Promise as any);

  if (!(business.plan as Plan)) {
    if (businessAgents.length >= 1) {
      throw new Error("You have to subscribe to a plan to add more agents");
    }
  } else {
    if (
      (business.plan as Plan).features.max_number_of_live_agent !==
        "unlimited" &&
      businessAgents.length >=
        ((business.plan as Plan).features.max_number_of_live_agent as number)
    ) {
      throw new Error(
        "You have reached the maximum number of agents for your plan"
      );
    }
  }
};

export default async function create(data: CreateAgentParams) {
  const payload = validate(schema, data);

  const business = await businessService().getById(payload.business_id);

  await ensureCanAddMoreLiveAgents(business);

  const profileUrl = await uploadProfile(payload);

  if (profileUrl) {
    payload.profile_url = profileUrl;
  }

  const {
    business_id,
    email,
    profile_url,
    name,
    is_person = true,
  }: CreateAgentParams = payload;

  const user =
    is_person &&
    (await userService().updateOrCreate({
      email,
      full_name: name,
      profile_url,
    }));

  const chatPlatforms = await chatPlatformService().list({
    business_id,
  });

  const linkedChatAgents = await Promise.all(
    chatPlatforms
      .filter(
        (chatPlatform: ChatPlatform) => chatPlatform.is_external_agent_supported
      )
      .map(async (chatPlatform: ChatPlatform) => {
        const result = await chatPlatformService().update({
          id: chatPlatform.id,
          business_id,
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
    business: business_id,
    user: user?.id,
    is_person,
    ...(!is_person && {
      bot_info: {
        name,
        profile_url,
      },
    }),
    linked_chat_agents: linkedChatAgents
      .filter((agent) => agent)
      .map((agent) => agent.id),
  });
}
