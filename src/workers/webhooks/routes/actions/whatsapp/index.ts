"use strict";

import { FaceBookWebhookPayload, WhatsAppWebhookPayload } from "../types";
import chatPlatformService from "../../../../../services/chat-platforms";
import { CHAT_PLATFORMS } from "../../../../../models/chat-platforms/schema";
import { ChatPlatform } from "../../../../../models/businesses/types";
import getBotResponse from "../../../../../lib/bot-api";
import {
  sendTextMessage,
  // sendGenericTemplate,
  // getChatUserProfile,
  // sendSenderAction,
} from "../../../../../lib/whatsapp";
import * as customerService from "../../../../../services/customers";
import { formatAndSaveMessage } from "../common";
import logger from "../../../../../lib/logger";

const ATTACHMENT_MESSAGE = "Sorry i cannot process attachments";

const handleAsBot = async ({
  whatsappPayload,
  chatPlatform,
  customer,
}: {
  whatsappPayload: WhatsAppWebhookPayload["entry"][0]["changes"][0] & {
    id: string;
  };
  chatPlatform: ChatPlatform;
  customer: any;
}) => {
  try {
    const agent = chatPlatform.agents.find((chatAgent) => !chatAgent.is_person);
    if (
      !whatsappPayload.value.messages.find((message) => message.type === "text")
    ) {
      return sendTextMessage({
        to: whatsappPayload.value.contacts[0].wa_id,
        body: ATTACHMENT_MESSAGE,
        phoneNumber: whatsappPayload.value.metadata.phone_number_id,
      });
    }
    const textMessage = whatsappPayload.value.messages.find(
      (message) => message.type === "text"
    ).text.body;

    const [response] = await Promise.all([
      getBotResponse({
        senderId: whatsappPayload.value.contacts[0].wa_id,
        message: textMessage as any,
        metadata: {
          business_id: String(chatPlatform.business.id),
          chat_platform_id: String(chatPlatform.id),
        },
      }),
    ]);
    for (let i = 0; i < response.length; i++) {
      const singleEntity = response[i];
      if (singleEntity.text) {
        const payload = {
          to: singleEntity.recipient_id,
          body: singleEntity.text,
          phoneNumber: whatsappPayload.value.metadata.phone_number_id,
          // accessToken: chatPlatform.external_access_token,
          // options: singleEntity.buttons && {
          //   quick_replies: singleEntity.buttons.map((reply: any) => ({
          //     content_type: "text",
          //     title: reply.title,
          //     payload: reply.payload,
          //   })),
          // },
        };
        await Promise.all([
          formatAndSaveMessage({
            customer,
            chatPlatform,
            isChatWithLiveAgent: false,
            isCustomerMessage: false,
            text: singleEntity.text,
          }),
          sendTextMessage(payload),
        ]);
      } else if (singleEntity.custom?.type == "list") {
        await Promise.all([
          formatAndSaveMessage({
            customer,
            chatPlatform,
            isChatWithLiveAgent: false,
            isCustomerMessage: false,
            customGenericTemplate: singleEntity.custom.data,
          }),
          // sendGenericTemplate({
          //   accessToken: chatPlatform.external_access_token,
          //   recipientId: singleEntity.recipient_id,
          //   personaId: agent?.external_id,
          //   elements: singleEntity.custom.data,
          // }),
        ]);
      }
    }
    logger().info("Successfully Handled as bot for facebook");
  } catch (error) {
    logger().info("Error while handling as bot for facebook");
    logger().error(error);
  }
};

export default async function whatsappWebhookController(
  whatsappPayload: WhatsAppWebhookPayload["entry"][0]["changes"][0] & {
    id: string;
  }
) {
  logger().info("Webhook received from Whatsapp");

  console.log("whatsappPayload", whatsappPayload);

  const chatPlatform = await chatPlatformService().getByExternalIdAndPlatform(
    CHAT_PLATFORMS.WHATSAPP,
    undefined,
    whatsappPayload.id
  );

  if (!whatsappPayload.value.contacts?.[0]) return;

  console.log(whatsappPayload.value.contacts?.[0]);

  let customer = (await customerService.getByExternalId({
    externalId: whatsappPayload.value.contacts[0].wa_id,
    source: chatPlatform.id,
  })) as any;

  if (!customer) {
    customer = await customerService.create({
      data: {
        external_id: whatsappPayload.value.contacts[0].wa_id,
        source: chatPlatform.id,
        business: chatPlatform.business.id,
        name: whatsappPayload.value.contacts[0].profile.name,
      },
    });
  }

  const [_, response] = await Promise.all([
    formatAndSaveMessage({
      customer,
      chatPlatform,
      isChatWithLiveAgent: customer.is_chat_with_live_agent,
      isCustomerMessage: true,
      text: whatsappPayload.value.messages.find(
        (message) => message.type === "text"
      ).text.body,
      externalId: whatsappPayload.value.contacts[0].wa_id,
    }),
    ...(!customer.is_chat_with_live_agent
      ? [handleAsBot({ whatsappPayload, chatPlatform, customer })]
      : []),
  ]);

  return response;
}
