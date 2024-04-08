"use strict";
import transformData from "./transform-data";
import { sendTextMessage } from "../../../../lib/whatsapp";
import { MESSAGE_TYPE } from "../../../../models/messages/schema";

export { transformData };

export async function sendMessage(params: any) {
  if (params.type === MESSAGE_TYPE.TEXT)
    return sendTextMessage({
      body: params.text,
      to: params.receipient_id,
      phoneNumber: params.external_phone_number_id,
    });
  if (params.type === MESSAGE_TYPE.MEDIA) return;
  // return sendMediaMessage({
  //   accessToken: params.access_token,
  //   type: params.media[0]?.type,
  //   recipientId: params.receipient_id,
  //   personaId: params.agent_external_id,
  //   url: params.media[0]?.url
  // })
}
