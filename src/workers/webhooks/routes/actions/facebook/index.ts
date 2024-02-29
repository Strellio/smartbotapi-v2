"use strict";

import { FaceBookWebhookPayload } from "../types";
import chatPlatformService from "../../../../../services/chat-platforms";
import { CHAT_PLATFORMS } from "../../../../../models/chat-platforms/schema";
import { ChatPlatform } from "../../../../../models/businesses/types";
import getBotResponse from "../../../../../lib/bot-api";
import {
  sendTextMessage,
  sendGenericTemplate,
  getChatUserProfile,
  sendSenderAction,
} from "../../../../../lib/facebook";
import * as customerService from "../../../../../services/customers";
import { formatAndSaveMessage } from "../common";
import logger from "../../../../../lib/logger";
import { Customer } from "../../../../../models/customers/types";

const ATTACHMENT_MESSAGE = "Sorry i cannot process attachments";

const handleAsBot = async ({
  facebookPayload,
  chatPlatform,
  customer,
}: {
  facebookPayload: FaceBookWebhookPayload;
  chatPlatform: ChatPlatform;
  customer: any;
}) => {
  try {
    const agent = chatPlatform.agents.find((chatAgent) => !chatAgent.is_person);
    if (facebookPayload.message?.attachments) {
      return sendTextMessage({
        recipientId: facebookPayload.sender.id,
        text: ATTACHMENT_MESSAGE,
        personaId: agent?.external_id,
        accessToken: chatPlatform.external_access_token,
      });
    }
    const textMessage = facebookPayload.message?.text;

    const [response] = await Promise.all([
      getBotResponse({
        senderId: facebookPayload.sender.id,
        message: textMessage as any,
        metadata: {
          business_id: String(chatPlatform.business.id),
          chat_platform_id: String(chatPlatform.id),
        },
      }),
      sendSenderAction({
        accessToken: chatPlatform.external_access_token,
        recipientId: facebookPayload.sender.id,
        action: "typing_on",
      }),
    ]);
    for (let i = 0; i < response.length; i++) {
      const singleEntity = response[i];
      if (singleEntity.text) {
        const payload = {
          recipientId: singleEntity.recipient_id,
          text: singleEntity.text,
          personaId: agent?.external_id,
          accessToken: chatPlatform.external_access_token,
          options: singleEntity.buttons && {
            quick_replies: singleEntity.buttons.map((reply: any) => ({
              content_type: "text",
              title: reply.title,
              payload: reply.payload,
            })),
          },
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
          sendGenericTemplate({
            accessToken: chatPlatform.external_access_token,
            recipientId: singleEntity.recipient_id,
            personaId: agent?.external_id,
            elements: singleEntity.custom.data,
          }),
        ]);
      }
    }
    logger().info("Successfully Handled as bot for facebook");
  } catch (error) {
    logger().info("Error while handling as bot for facebook");
    logger().error(error);
  }
};

export default async function facebookWebhookController(
  facebookPayload: FaceBookWebhookPayload
) {
  logger().info("Webhook received from Facebook");
  const chatPlatform = await chatPlatformService().getByExternalIdAndPlatform(
    CHAT_PLATFORMS.FACEBOOK,
    undefined,
    facebookPayload.recipient.id
  );

  console.log("chatPlatform", chatPlatform);

  // message reads should not be handled yet
  if (facebookPayload.read) return; //console.log("handle message reads")

  let customer = (await customerService.getByExternalId({
    externalId: facebookPayload.sender.id,
    source: chatPlatform.id,
  })) as any;

  if (!customer) {
    const userProfile = await getChatUserProfile({
      accessToken: chatPlatform.external_access_token,
      userId: facebookPayload.sender.id,
    });
    customer = await customerService.create({
      data: {
        external_id: facebookPayload.sender.id,
        source: chatPlatform.id,
        business: chatPlatform.business.id,
        name: userProfile.name,
        profile_url: userProfile.profile_pic,
      },
    });
  }

  const [_, response] = await Promise.all([
    formatAndSaveMessage({
      customer,
      chatPlatform,
      isChatWithLiveAgent: customer.is_chat_with_live_agent,
      isCustomerMessage: true,
      text: facebookPayload.message?.text,
      externalId: facebookPayload.message?.mid,
      media: (facebookPayload.message?.attachments || []).map((attachment) => ({
        type: attachment.type,
        url: attachment.payload.url,
      })),
    }),
    ...(!customer.is_chat_with_live_agent
      ? [handleAsBot({ facebookPayload, chatPlatform, customer })]
      : []),
  ]);

  return response;
}
