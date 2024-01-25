"use strict";

import schema, { updateAvailabilitySchema } from "./schema";
import { validate } from "../../../lib/utils";
import agentsModel from "../../../models/agents";
import userService from "../../users";
import chatPlatformService from "../../chat-platforms";
import { Business, ChatPlatform } from "../../../models/businesses/types";
import {
  ACTION_TYPE_TO_MONGODB_FIELD,
  STATUS_MAP,
} from "../../../models/common";
import { uploadProfile } from "../../users/create";
import { AGENT_AVAILABILTY_STATUS } from "../../../models/agents/schema";
import { Plan } from "../../../models/plans/types";
import H from "highland";
import businessService from "../../businesses";

type UpdateAgentParams = {
  id: string;
  name: string;
  business_id: string;
  profile_url: string;
  is_person: boolean;
  email?: string;
  linked_chat_agents: [string];
  status: STATUS_MAP;
};

type UpdateAvailabilityParams = {
  id: string;
  availability_status: AGENT_AVAILABILTY_STATUS;
};

const ensureCanAddMoreLiveAgents = async (
  business: Business,
  status: STATUS_MAP
) => {
  const businessAgents = await H(
    agentsModel.fetch({
      query: {
        business: business.id,
        is_person: true,
      },
    })
  )
    .collect()
    .toPromise(Promise as any);

  if (!(business.plan as Plan)) {
    if (businessAgents.length >= 1 && status === STATUS_MAP.ACTIVE) {
      throw new Error("You have to subscribe to a plan to add more agents");
    }
  } else {
    if (
      status === STATUS_MAP.ACTIVE &&
      (business.plan as Plan).features.max_number_of_live_agent !==
        "unlimited" &&
      businessAgents.length >
        ((business.plan as Plan).features.max_number_of_live_agent as number)
    ) {
      throw new Error(
        "You have reached the maximum number of agents for your plan"
      );
    }
  }
};

export default async function update(data: UpdateAgentParams) {
  const payload = validate(schema, data);

  const mainAgent = await agentsModel.getById(payload.id);

  const business = await businessService().getById(payload.business_id);

  await ensureCanAddMoreLiveAgents(business, payload.status as STATUS_MAP);

  const chatPlatforms = await chatPlatformService().list({
    business_id: payload.business_id,
  });

  const profileUrl = await uploadProfile(payload);

  if (profileUrl) {
    payload.profile_url = profileUrl;
  }

  const { id, business_id, ...rest }: UpdateAgentParams = payload;

  if (
    rest.name !== mainAgent.user.full_name ||
    rest.profile_url !== mainAgent.user.profile_url
  ) {
    await Promise.all(
      chatPlatforms
        .filter(
          (chatPlatform: ChatPlatform) =>
            chatPlatform.is_external_agent_supported
        )
        .map(async (chatPlatform: ChatPlatform) => {
          const chatPlatformAgent = chatPlatform.agents.find((agent) => {
            return mainAgent.linked_chat_agents
              .map((id) => id.toString())
              .includes(agent.id.toString());
          });

          if (chatPlatformAgent) {
            return chatPlatformService().update({
              id: chatPlatform.id,
              business_id,
              type: chatPlatform.type,

              agent: {
                ...rest,
                id: chatPlatformAgent.id,
                action_type: ACTION_TYPE_TO_MONGODB_FIELD.EDIT,
                main_agent_id: data.id,
              },
            });
          }
        })
    );
  }

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

  return agentsModel.update(id, business_id, rest);
}

export function updateAvailability(data: UpdateAvailabilityParams) {
  const payload = validate(updateAvailabilitySchema, data);

  const { id, availability_status, business_id } = payload;

  return agentsModel.update(id, business_id, { availability_status });
}
