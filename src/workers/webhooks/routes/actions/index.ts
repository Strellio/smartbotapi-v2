'use strict'
import { Request, Response, NextFunction } from "express";
import chatPlatformService from "../../../../services/chat-platforms";

type IntercomWebhookPayload = {
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
        }
    }
}

export const intercomWebhook = async (req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(200)

    const payload = req.body as IntercomWebhookPayload
    const chatPlatform = await chatPlatformService().getByWorkSpaceId(payload.app_id)
    console.log(chatPlatform);

}