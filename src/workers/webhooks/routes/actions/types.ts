import { MESSAGE_MEDIA_TYPE } from "../../../../models/messages/schema"

export type IntercomWebhookPayload = {
    type: string
    app_id: string
    data: {
        id: string
        topic: string
        item: {
            type: string
            id: string
            created_at: number
            updated_at: number
            user: {
                type: string
                id: string
                user_id: string
                name: string
                email: string
            }
            conversation_message: {
                type: string
                id: string
                url: string
                subject: string
                body: string
                author: string
            }
            conversation_parts: {
                type: string
                total_count: 1
                conversation_parts: [
                    {
                        type: string
                        id: string
                        part_type: "comment" | "note"
                        body: string
                    }
                ]
            }
        }
    }
}


export type FaceBookWebhookPayload = {
    sender: { id: string }
    recipient: { id: string }
    timestamp: number
    message?: {
        mid: string
        text: string
        tags: { source: string }
        attachments?: {
            type: MESSAGE_MEDIA_TYPE,
            payload: { url: string }
        }[]
    }
    read?: { watermark: number }
}

export type HubspotWebhookPayload = {
    portalId: number
    userMessage: { message: string, quickReply: any }
    parsedResult: any
    bot: { nickname: string, conversationChannelType: string }
    module: {
        botNickname: string
        fallbackNextModuleNickname: any
        failureNextModuleNickname: any
        moduleType: string
        nickname: string
        prompt: null
        promptHtml: null
        config: {
            id: number
            timeout: number
            customPayload: string
            expectingResponse: boolean
        }
    },
    session: {
        vid: string
        conversationId: number
        botNickname: string
        currentModuleNickname: string
        sessionStartedAt: number
        lastInteractionAt: number
        state: string
        customState: any
        responseExpected: boolean
        parsedResponses: any
        properties: any
    },
}