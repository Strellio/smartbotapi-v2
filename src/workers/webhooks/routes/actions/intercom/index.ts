'use strict'

import { IntercomWebhookPayload } from "../types";
import chatPlatformService from "../../../../../services/chat-platforms";
import { ChatPlatform } from "../../../../../models/businesses/types";
import getBotResponse, { BotResponseCustomData } from "../../../../../lib/bot-api";
import intercomLib from "../../../../../lib/intercom";
const stripTags = require('striptags');


const MAXIMUM_ITEMS_PER_REPLY = 5

const replyWithTemplate = (intercomPayload: any = {}) => (templates: Array<any>, recipientId: string) => Promise.all(
    templates.slice(0, MAXIMUM_ITEMS_PER_REPLY).map((template: BotResponseCustomData) => {
        return intercomLib().conversations.create({
            ...intercomPayload,
            recipientId,
            text: `<span>  ${template.title} <br> ${template.subtitle} <br/> <a href="${template.buttons[1]?.url}"> Buy </a>  <a href="${template.default_action.url}"> View site </a>   <a href='${template.default_action.url}'> <img src='${template.image_url}'  /> </a> </span>`
        })
    })
)

const handleAsBot = async ({ intercomPayload, chatPlatform }: {
    chatPlatform: ChatPlatform
    intercomPayload: IntercomWebhookPayload
}) => {
    const agent = chatPlatform.agents.find(agent => !agent.is_person)
    const conversation = intercomPayload.data.item.conversation_parts.conversation_parts.pop()
    const response = await getBotResponse({
        senderId: intercomPayload.data.item.user.id,
        message: stripTags(conversation?.body),
        metadata: {
            business_id: String(chatPlatform.business.id),
            intercom_id: String(chatPlatform.id)
        }
    })
    const doReplyWithTemplate = replyWithTemplate({
        conversationId: intercomPayload.data.item.id,
        accessToken: chatPlatform.external_access_token,
        personaId: agent?.external_id as string,
    })

    for (let i = 0; i < response.length; i++) {
        const singleElement = response[i];
        if (singleElement.text) {
            await intercomLib().conversations.create({
                conversationId: intercomPayload.data.item.id,
                recipientId: singleElement.recipient_id,
                accessToken: chatPlatform.external_access_token,
                personaId: agent?.external_id as string,
                text: singleElement.text,
            })
        } else if (singleElement.custom?.data) {
            await doReplyWithTemplate(singleElement.custom?.data, singleElement.recipient_id)
        }


    }
}


export default async function intercomWebhookController(intercomPayload: IntercomWebhookPayload) {
    const chatPlatform = await chatPlatformService().getByWorkSpaceId(intercomPayload.app_id)

    return handleAsBot({ intercomPayload, chatPlatform })
}