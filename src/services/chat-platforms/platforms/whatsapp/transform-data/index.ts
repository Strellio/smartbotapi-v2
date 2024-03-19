"use strict";
import {
  generateLongAccessToken,
  generatePageAccessToken,
  deletePersona,
  createPersona,
  updateMessengerProfile,
  subscribeAppToPage,
  generateCodeAccessToken,
} from "../../../../../lib/facebook";
import { required } from "../../../../../lib/utils";
import { ChatPlatform } from "../../../../../models/businesses/types";
import { ACTION_TYPE_TO_MONGODB_FIELD } from "../../../../../models/common";

const defaultBotAgent = {
  is_person: false,
  name: "SmartBot",
  profile_url:
    "https://res.cloudinary.com/strellio/image/upload/v1596998837/smartbot-assets/smartbot-logo_hfkihs.png",
};

export default async function transformData({
  payload = required("payload"),
  dbPayload,
}: {
  payload: any;
  dbPayload?: ChatPlatform;
}) {
  try {
    // if (!dbPayload) {
    //   payload.agent = defaultBotAgent;
    // }

    if (payload.external_user_access_token) {
      const { access_token } = await generateLongAccessToken(
        payload.external_user_access_token
      );
      payload.external_user_access_token = access_token;
    }
    if (payload.external_auth_code) {
      const { access_token } = await generateCodeAccessToken(
        payload.external_auth_code
      );

      payload.external_access_token = access_token;
    }

    return payload;
  } catch (error) {
    console.log(error.response?.data);
    throw error;
  }
}
