"use strict";

import { HubspotWebhookPayload } from "../types";
import chatPlatformService from "../../../../../services/chat-platforms";
import { CHAT_PLATFORMS } from "../../../../../models/chat-platforms/schema";
import { STATUS_MAP } from "../../../../../models/common";
import logger from "../../../../../lib/logger";
import { ChatPlatform } from "../../../../../models/businesses/types";
import getBotResponse from "../../../../../lib/bot-api";
import * as customerService from "../../../../../services/customers";
import { Customer } from "../../../../../models/customers/types";
import { formatAndSaveMessage } from "../common";

const handleAsBot = async ({
  hubspotPayload,
  chatPlatform,
  customer,
}: {
  hubspotPayload: HubspotWebhookPayload;
  chatPlatform: ChatPlatform;
  customer: Customer;
}) => {
  const response = await getBotResponse({
    senderId: `${hubspotPayload.session.vid}`,
    message: hubspotPayload.userMessage.message,
    metadata: {
      business_id: String(chatPlatform.business.id),
      chat_platform_id: String(chatPlatform.id),
    },
  });

  for (let i = 0; i < response.length; i++) {
    const singleEntity = response[i];
    if (singleEntity.text) {
      await formatAndSaveMessage({
        customer,
        chatPlatform,
        isChatWithLiveAgent: false,
        isCustomerMessage: false,
        text: singleEntity.text,
      });
    } else if (singleEntity.custom?.data) {
      await formatAndSaveMessage({
        customer,
        chatPlatform,
        isChatWithLiveAgent: false,
        isCustomerMessage: false,
        customGenericTemplate: singleEntity.custom.data,
      });
    }
  }

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
      nextModuleNickname: "",
      responseExpected: true,
      botMessage: "",
      quickReplies: [],
      botMedia: null,
    }
  );

  return result;
};

export default async function hubSpotController(
  payload: HubspotWebhookPayload
) {
  const chatPlatform = await chatPlatformService().getByExternalIdAndPlatform(
    CHAT_PLATFORMS.HUBSPOT,
    undefined,
    `${payload.portalId}`
  );
  if (!chatPlatform || chatPlatform.status !== STATUS_MAP.ACTIVE)
    return logger().info("hubspot not enabled");

  const customer = await customerService.createOrUpdate({
    external_id: `${payload.session.vid}`,
    source: chatPlatform.id,
    business_id: chatPlatform.business.id,
    name: `Guest ${payload.session.vid}`,
  });

  const [_, response] = await Promise.all([
    formatAndSaveMessage({
      customer,
      chatPlatform,
      isChatWithLiveAgent: customer.is_chat_with_live_agent,
      isCustomerMessage: true,
      text: payload.userMessage.message,
    }),
    handleAsBot({ hubspotPayload: payload, chatPlatform, customer }),
  ]);
  return response;
}
