"use strict";

import { required, calculateTrialDays } from "../../../lib/utils";
import businessModel from "../../../models/businesses";
import planModel from "../../../models/plans";
import shopifyLib from "../../../lib/shopify";
import config from "../../../config";

export default async function charge(
  businessId: string = required("business"),
  planId: string = required("planId")
) {
  const business = await businessModel().getById(businessId);
  const plan = await planModel().getById(planId);
  const client = shopifyLib.api({
    platformDomain: business.shop.external_platform_domain,
    accessToken: business.shop.external_access_token,
  });

  const recurringCharge = await client.recurringApplicationCharge.create({
    name: plan.display_name,
    price: plan.price,
    trial_days: calculateTrialDays(
      plan.free_trial_days,
      business.trial_expiry_date
    )?.days,
    return_url: `${config.APP_URL}/plans/charge?business_id=${business.id}&plan_id=${plan.id}&platform=${business.platform}`,
  });

  return recurringCharge.confirmation_url;
}
