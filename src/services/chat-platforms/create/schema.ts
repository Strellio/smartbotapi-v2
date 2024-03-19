"use strict";
import { objectId, joi } from "../../../lib/joi";
import {
  CHAT_PLATFORMS,
  CHAT_TYPE,
} from "../../../models/chat-platforms/schema";

const chatPlatforms = Object.values(CHAT_PLATFORMS);
const chatTypes = Object.values(CHAT_TYPE);

export default joi.object({
  business_id: objectId().required(),
  platform: joi
    .string()
    .valid(...chatPlatforms)
    .required(),
  external_page_name: joi.string().when("platform", {
    is: CHAT_PLATFORMS.FACEBOOK,
    then: joi.required(),
  }),
  external_user_access_token: joi.string().when("platform", {
    is: CHAT_PLATFORMS.FACEBOOK,
    then: joi.required(),
  }),
  external_user_id: joi.string().when("platform", {
    is: CHAT_PLATFORMS.FACEBOOK,
    then: joi.required(),
  }),
  external_user_name: joi.string(),
  external_access_token: joi.string(),
  external_id: joi.string(),
  linked_page_id: joi.string().when("platform", {
    is: CHAT_PLATFORMS.INSTAGRAM,
    then: joi.required(),
  }),
  workspace_id: joi.string(),
  type: joi
    .string()
    .valid(...chatTypes)
    .required(),
  external_phone_number_id: joi.string(),
  external_auth_code: joi.string(),
});
