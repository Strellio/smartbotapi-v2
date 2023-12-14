"use strict";
import joi from "joi";
import { objectId } from "../../../lib/joi";

export const defaultProfilePic =
  "https://storage.googleapis.com/egs-images/profile-pics/Test-agaent-9810451392219100.jpeg";

export default joi.object({
  name: joi.string().required().max(40),
  profile_url: joi.string().default(defaultProfilePic),
  business_id: objectId().required(),
  email: joi.string().email(),
  is_person: joi.boolean().default(true),
  country: joi.string(),
});
