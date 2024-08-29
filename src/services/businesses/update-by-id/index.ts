"use strict";

import { validate, convertObjectToDotNotation } from "../../../lib/utils";
import schema from "./schema";
import BusinessModel from "../../../models/businesses";

interface UpdateParams {
  id: string;
  status?: string;
  plan_id?: string;
  business_name?: string;
  currency?: string;
  shop?: {
    external_access_token?: string;
    external_refresh_token?: string;
    money_format?: string;
    external_platform_secret?: string;
    external_platform_client?: string;
  };
  onboarding?: {
    is_product_index_created?: boolean;
    is_order_index_created?: boolean;
    is_knowledge_base_index_created?: boolean;
    is_product_vector_store_created?: boolean;
    is_order_vector_store_created?: boolean;
    is_knowledge_base_vector_store_created?: boolean;
  };
}

export default async function updateById(params: UpdateParams) {
  const {
    id,
    shop = {},
    onboarding = {},
    ...validedparams
  }: UpdateParams = validate(schema, params);

  await BusinessModel().getById(id);

  const shopQuery = convertObjectToDotNotation("shop", shop, "");
  const onboardingQuery = convertObjectToDotNotation(
    "onboarding",
    onboarding,
    ""
  );
  return BusinessModel().updateById(params.id, {
    ...validedparams,
    ...shopQuery,
    ...onboardingQuery,
  });
}
