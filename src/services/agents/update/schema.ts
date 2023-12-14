"use strict";
import joi from "joi";
import { objectId } from "../../../lib/joi";
import { defaultProfilePic } from "../create/schema";
import { AGENT_AVAILABILTY_STATUS } from "../../../models/agents/schema";
import { STATUS_MAP } from "../../../models/common";
const statuses = Object.values(STATUS_MAP);

export default joi.object({
  id: objectId().required(),
  name: joi.string().max(20).required(),
  profile_url: joi.string().default(defaultProfilePic),
  business_id: objectId().required(),
  email: joi.string().email(),
  is_person: joi.boolean().default(true),
  linked_chat_agents: joi.array().items(objectId()).required(),
  status: joi
    .string()
    .valid(...statuses)
    .required(),
});

export const updateAvailabilitySchema = joi.object({
  id: objectId().required(),
  business_id: objectId().required(),
  availability_status: joi
    .string()
    .allow(...Object.values(AGENT_AVAILABILTY_STATUS))
    .required(),
});
