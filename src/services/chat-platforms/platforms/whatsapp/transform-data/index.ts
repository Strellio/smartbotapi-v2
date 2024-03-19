"use strict";
import {
  generateLongAccessToken,
  generateCodeAccessToken,
  debugToken,
} from "../../../../../lib/facebook";
import { required } from "../../../../../lib/utils";
import { getWabaInfo } from "../../../../../lib/whatsapp";
import { ChatPlatform } from "../../../../../models/businesses/types";

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

      const tokenData = await debugToken(payload.external_access_token);

      if (tokenData.data?.user_id) {
        payload.external_user_id = tokenData.data.user_id;
      }

      const wabaIds = tokenData.data.granular_scopes.find(
        ({ scope }) => scope === "whatsapp_business_management"
      ).target_ids;
      const wabaId =
        wabaIds.find((id) => id === payload.external_id) || wabaIds[0];
      if (wabaId) {
        payload.external_id = wabaId;
      }

      const wabaInfo = await getWabaInfo({
        accessToken: payload.external_access_token,
        wabaId: payload.external_id,
      });

      payload.external_name = wabaInfo.name;
    }

    return payload;
  } catch (error) {
    console.log(error.response?.data);
    throw error;
  }
}
