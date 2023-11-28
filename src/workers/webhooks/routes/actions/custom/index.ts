"use strict";

import {
  MESSAGE_MEDIA_TYPE,
  MESSAGE_TYPE,
} from "../../../../../models/messages/schema";
import joi from "joi";
import { objectId } from "../../../../../lib/joi";
import chatPlatformService from "../../../../../services/chat-platforms";
import { CHAT_PLATFORMS } from "../../../../../models/chat-platforms/schema";
import { validate } from "../../../../../lib/utils";
import { formatAndSaveMessage } from "../common";
import * as customerService from "../../../../../services/customers";
import { Media } from "../../../../../services/conversations";
import { ChatPlatform } from "../../../../../models/businesses/types";
import { Customer } from "../../../../../models/customers/types";
import getBotResponse from "../../../../../lib/bot-api";

type CustomWidgetParams = {
  customer_id: string;
  type: MESSAGE_TYPE;
  media?: Media[];
  text?: string;
  business_id: string;
};

const messageTypes = Object.values(MESSAGE_TYPE);
const messageMediaTypes = Object.values(MESSAGE_MEDIA_TYPE);

const handleAsBot = async ({
  chatPlatform,
  customer,
  payload,
}: {
  chatPlatform: ChatPlatform;
  customer: Customer;
  payload: CustomWidgetParams;
}) => {
  if (payload.media?.length) return; // i done accept attachments
  const response = await getBotResponse({
    senderId: customer.id,
    message: payload.text as string,
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
        buttons: singleEntity.buttons,
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
};

export default async function customAction(params: CustomWidgetParams) {
  const validated: CustomWidgetParams = validate(
    joi.object({
      customer_id: objectId().required(),
      business_id: objectId().required(),
      text: joi
        .string()
        .allow("", " ")
        .when("type", { is: MESSAGE_TYPE.TEXT, then: joi.required() }),
      type: joi
        .string()
        .required()
        .valid(...messageTypes),
      media: joi
        .array()
        .items(
          joi.object({
            url: joi.string().uri().required(),
            type: joi
              .string()
              .valid(...messageMediaTypes)
              .required(),
          })
        )
        .when("type", { is: MESSAGE_TYPE.MEDIA, then: joi.required() }),
    }),
    params
  );

  const chatPlatform = await chatPlatformService().getByExternalIdAndPlatform(
    CHAT_PLATFORMS.CUSTOM,
    validated.business_id
  );
  const customer = await customerService.getById(validated.customer_id);

  const [message] = await Promise.all([
    formatAndSaveMessage({
      customer,
      chatPlatform,
      isChatWithLiveAgent: customer.is_chat_with_live_agent,
      isCustomerMessage: true,
      text: validated?.text,
      media: validated.media,
    }),

    ...(!customer.is_chat_with_live_agent && [
      handleAsBot({ chatPlatform, customer, payload: params }),
    ]),
  ]);

  // if (customer.is_chat_with_live_agent) return message;
  // await handleAsBot({ chatPlatform, customer, payload: params });
  return message;
}
