'use strict'

import { FaceBookWebhookPayload } from "../types";
import chatPlatformService from "../../../../../services/chat-platforms";
import { CHAT_PLATFORMS } from "../../../../../models/chat-platforms/schema";
import { ChatPlatform } from "../../../../../models/businesses/types";
import getBotResponse from "../../../../../lib/bot-api";
import { sendTextMessage, sendGenericTemplate } from "../../../../../lib/facebook";




const handleAsBot = async ({ facebookPayload, chatPlatform }: {
    facebookPayload: FaceBookWebhookPayload
    chatPlatform: ChatPlatform
}) => {
    if (facebookPayload.read) return

    const agent = chatPlatform.agents.find(agent => !agent.is_person)
    const textMessage = facebookPayload.message?.text

    const response = await getBotResponse({
        senderId: facebookPayload.sender.id,
        message: textMessage as any,
        metadata: {
            business_id: String(chatPlatform.business.id),
            chat_platform_id: String(chatPlatform.id)
        }
    })
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
                        content_type: 'text',
                        title: reply.title,
                        payload: reply.payload
                    }))
                }
            }
            await sendTextMessage(payload)
        } else if (singleEntity.custom?.type == 'list') {
            await sendGenericTemplate({
                accessToken: chatPlatform.external_access_token,
                recipientId: singleEntity.recipient_id,
                personaId: agent?.external_id,
                elements: singleEntity.custom.data
            })
        }
    }


}

export default async function facebookWebhookController(facebookPayload: FaceBookWebhookPayload) {
    const chatPlatform = await chatPlatformService().getByExternalIdAndPlatform(CHAT_PLATFORMS.FACEBOOK, undefined, facebookPayload.recipient.id)
    return handleAsBot({ facebookPayload, chatPlatform })
}