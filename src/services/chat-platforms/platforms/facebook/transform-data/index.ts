"use strict";
import {
  generateLongAccessToken,
  generatePageAccessToken,
  deletePersona,
  createPersona,
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
  if (!dbPayload) {
    payload.agent = defaultBotAgent;
  }

  if (payload.external_user_access_token) {
    const { access_token } = await generateLongAccessToken(
      payload.external_user_access_token
    );
    payload.external_user_access_token = access_token;
  }
  if (payload.external_id) {
    const pageResponse = await generatePageAccessToken({
      pageId: payload.external_id,
      accessToken: payload.external_user_access_token,
    });
    payload.external_access_token = pageResponse.access_token;
  }


  if (payload.agent) {
    if (payload.agent.external_id) {
      await deletePersona({
        pageAccessToken:
          dbPayload?.external_access_token || payload.external_access_token,
        id: payload.agent.external_id,
      })
    }

    if (payload.agent.action_type !== ACTION_TYPE_TO_MONGODB_FIELD.DELETE) {
      const persona = await createPersona({
        pageAccessToken:
          dbPayload?.external_access_token || payload.external_access_token,
        name: payload.agent.name,
        profile_url: payload.agent.profile_url,
      })
      payload.agent.external_id = persona.id;
    }


  }

  return payload;
}
