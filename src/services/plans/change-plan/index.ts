"use strict";
import businessModel from "../../../models/businesses";
import planModel from "../../../models/plans";
import { required } from "../../../lib/utils";
import chatPlatformModel from "../../../models/chat-platforms";
import { STATUS_MAP } from "../../../models/common";
import agentService from "../../agents";
import agentModel from "../../../models/agents";
import H from "highland";
import { Agent } from "../../../models/businesses/types";

export default async function changePlan({
  business_id = required("business_id"),
  plan_id = required("plan_id"),
  charge_id,
}: {
  business_id: string;
  plan_id: string;
  charge_id?: string;
}) {
  await businessModel().ensureExists({ _id: business_id });
  const plan = await planModel().ensureExists({ _id: plan_id });

  if (plan.features.max_number_of_live_agent !== "unlimited") {
    const agents = (await H(
      agentModel.fetch({
        query: {
          business: business_id,
          is_person: true,
          status: STATUS_MAP.ACTIVE,
        },
        sort: {
          _id: 1,
        },
      })
    )
      .collect()
      .toPromise(Promise as any)) as Agent[];

    if (agents.length > plan.features.max_number_of_live_agent) {
      const agentsToDeactivate = agents
        .filter(
          (agent, index) => index >= plan.features.max_number_of_live_agent
        )
        .map((agent) => agent.id);
      agentModel.updateMany({
        query: {
          business: business_id,
          is_person: true,
          status: STATUS_MAP.ACTIVE,
          _id: { $in: agentsToDeactivate },
        },
        update: {
          status: STATUS_MAP.DEACTIVATED,
        },
      });
    }
  }

  await chatPlatformModel().updateMany({
    query: {
      business: business_id,
      platform: { $nin: plan.features.allowed_external_platforms },
    },
    update: {
      status: STATUS_MAP.DEACTIVATED,
    },
  });

  const upgrade = {
    plan: plan_id,
    "shop.charge_id": charge_id,
    date_upgraded: new Date(),
  };
  return businessModel().updateById(business_id, upgrade);
}
