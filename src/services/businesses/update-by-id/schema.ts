"use strict";
import joi from "joi";
import { STATUS_MAP } from "../../../models/common";
import { PLATFORM_MAP } from "../../../models/businesses/schema/enums";
import { objectId } from "../../../lib/joi";
const statusMap = Object.values(STATUS_MAP).join(",");

export default joi.object({
  id: objectId().required(),
  status: joi.string().valid(...statusMap),
  plan_id: joi.string(),
  business_name: joi.string(),
  external_created_at: joi.date(),
  external_updated_at: joi.date(),
  external_access_token: joi.string(),
  currency: joi.string(),
  shop: joi.object({
    external_created_at: joi.date(),
    external_updated_at: joi.date(),
    external_access_token: joi.string(),
    external_refresh_token: joi.string(),
    external_platform_secret: joi.string(),
    external_platform_client: joi.string(),
    money_format: joi.string(),
  }),
  onboarding: joi.object({
    is_product_index_created: joi.boolean(),
    is_order_index_created: joi.boolean(),
    is_knowledge_base_index_created: joi.boolean(),
    is_product_vector_store_created: joi.boolean(),
    is_order_vector_store_created: joi.boolean(),
    is_knowledge_base_vector_store_created: joi.boolean(),
  }),
});
