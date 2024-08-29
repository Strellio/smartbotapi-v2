"use strict";
import {
  CHAT_PLATFORMS,
  CHAT_TYPE,
} from "../../../models/chat-platforms/schema";
import { STATUS_MAP } from "../../../models/common";
import { objectId, joi } from "../../../lib/joi";

const statusMap = Object.values(STATUS_MAP);

const chatTypes = Object.values(CHAT_TYPE);

export default joi.object({
  id: objectId().required(),
  business_id: objectId().required(),
  status: joi.string().valid(...statusMap),
  external_page_name: joi.string().allow(""),
  external_user_access_token: joi.string(),
  external_user_id: joi.string(),
  external_user_name: joi.string(),
  external_access_token: joi.string(),
  logged_in_greetings: joi.string(),
  logged_out_greetings: joi.string(),
  theme_color: joi.string(),
  type: joi.string().valid(...chatTypes),
  external_id: joi.string(),
  workspace_id: joi.string(),
  agent: joi
    .object({
      id: objectId(),
      external_id: joi.string(),
      name: joi.string().required(),
      profile_url: joi.string(),
      is_person: joi.boolean().required(),
      action_type: joi.string(),
      main_agent_id: joi.string(),
    })
    .optional(),
});
