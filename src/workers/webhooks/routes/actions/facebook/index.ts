'use strict'

import { FaceBookWebhookPayload } from "../types";
import chatPlatformService from "../../../../../services/chat-platforms";
import { CHAT_PLATFORMS } from "../../../../../models/chat-platforms/schema";
import { ChatPlatform } from "../../../../../models/businesses/types";
import getBotResponse from "../../../../../lib/bot-api";
import { sendTextMessage, sendGenericTemplate, getChatUserProfile } from "../../../../../lib/facebook";
import * as customerService from "../../../../../services/customers";
import conversationsService from '../../../../../services/conversations'
import { MESSAGE_TYPE } from "../../../../../models/messages/schema";

const ATTACHMENT_MESSAGE = "Sorry i cannot process attachments"


const handleAsBot = async ({ facebookPayload, chatPlatform }: {
    facebookPayload: FaceBookWebhookPayload
    chatPlatform: ChatPlatform
}) => {
    const agent = chatPlatform.agents.find(agent => !agent.is_person)
    if (facebookPayload.message?.attachments) {
        return sendTextMessage({
            recipientId: facebookPayload.sender.id,
            text: ATTACHMENT_MESSAGE,
            personaId: agent?.external_id,
            accessToken: chatPlatform.external_access_token
        })
    }
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

const createNewMessage = ({ customer, chatPlatform, facebookPayload }: {
    facebookPayload: FaceBookWebhookPayload
    chatPlatform: ChatPlatform
    customer: any
}) => {
    const media = (facebookPayload.message?.attachments || []).map(attachment => ({
        type: attachment.type,
        url: attachment.payload.url
    }))

    const payload = {
        business_id: chatPlatform.business.id,
        source: chatPlatform.id,
        customer_id: customer.id,
        external_id: facebookPayload.message?.mid,
        is_message_from_admin: false,
        media,
        type: media.length ? MESSAGE_TYPE.MEDIA : MESSAGE_TYPE.TEXT,
        text: facebookPayload.message?.text
    }

    return conversationsService().create(payload)
}

export default async function facebookWebhookController(facebookPayload: FaceBookWebhookPayload) {
    const chatPlatform = await chatPlatformService().getByExternalIdAndPlatform(CHAT_PLATFORMS.FACEBOOK, undefined, facebookPayload.recipient.id)
    // message reads should not be handled yet
    if (facebookPayload.read) return //console.log("handle message reads")
    const userProfile = await getChatUserProfile({ accessToken: chatPlatform.external_access_token, userId: facebookPayload.sender.id })
    const customer = await customerService.createOrUpdate({
        external_id: facebookPayload.sender.id,
        source: chatPlatform.id,
        business_id: chatPlatform.business.id,
        name: userProfile.name,
        profile_url: userProfile.profile_pic
    })

    await createNewMessage({ customer, chatPlatform, facebookPayload })

    return handleAsBot({ facebookPayload, chatPlatform })
}