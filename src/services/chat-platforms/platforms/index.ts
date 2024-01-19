"use strict";
import * as facebook from "./facebook";
import * as intercom from "./intercom";
import { required } from "../../../lib/utils";

export const chatPlatforms = { facebook, intercom };

export const transformByPlatform = async ({
  payload = required("payload"),
  dbPayload,
}: {
  payload: any;
  dbPayload?: any;
}) => {
  const platforms: any = chatPlatforms;
  const transformer = platforms[payload.platform];
  if (!transformer) return payload;
  const result = await transformer.transformData({ payload, dbPayload });
  return result;
};

export async function sendMessageToCustomer(
  payload: any = required("payload")
) {
  const platforms: any = chatPlatforms;
  const sendMessageHandler = platforms[payload.platform];
  return sendMessageHandler.sendMessage(payload);
}
