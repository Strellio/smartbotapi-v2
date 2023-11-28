"use strict";

import { HubspotWebhookPayload } from "../types";
import chatPlatformService from "../../../../../services/chat-platforms";
import { CHAT_PLATFORMS } from "../../../../../models/chat-platforms/schema";
import { STATUS_MAP } from "../../../../../models/common";
import logger from "../../../../../lib/logger";
import { ChatPlatform } from "../../../../../models/businesses/types";
import getBotResponse from "../../../../../lib/bot-api";

const handleAsBot = async ({
  hubspotPayload,
  chatPlatform,
}: {
  hubspotPayload: HubspotWebhookPayload;
  chatPlatform: ChatPlatform;
}) => {
  const response = await getBotResponse({
    senderId: hubspotPayload.session.vid,
    message: hubspotPayload.userMessage.message,
    metadata: {
      business_id: String(chatPlatform.business.id),
      chat_platform_id: String(chatPlatform.id),
    },
  });

  const result = response.reduce(
    (
      acc: {
        nextModuleNickname: string;
        responseExpected: boolean;
        botMessage?: string;
        quickReplies?: Array<any>;
        botMedia?: any;
      },
      singleElement
    ) => {
      if (singleElement.text) {
        acc.botMessage += `. ${singleElement.text}`;
      }
      acc.quickReplies = singleElement.buttons?.map((button) => ({
        value: button.payload,
        label: button.title,
      }));

      return acc;
    },
    {
      nextModuleNickname: "PromptForCollectUserInput",
      responseExpected: true,
      botMessage:
        "<span> <hi> Title here </strong> <br /> <a target='_blank' rel='noopener' href='https://strellio.com'> <img style='width: 100%' src='https://i1.wp.com/crackedkey.org/wp-content/uploads/2019/08/UBot-Studio-Cracked.jpg?resize=592%2C229&ssl=1' />  </a> </span>",
      quickReplies: [],
    }
  );

  return result;
};

export default async function hubSpotController(
  payload: HubspotWebhookPayload
) {
  const chatPlatform = await chatPlatformService().getByExternalIdAndPlatform(
    CHAT_PLATFORMS.HUBSPOT
  );
  if (!chatPlatform || chatPlatform.status !== STATUS_MAP.ACTIVE)
    return logger().info("hubspot not enabled");
  return handleAsBot({ hubspotPayload: payload, chatPlatform });
}
