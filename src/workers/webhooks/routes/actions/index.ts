'use strict'
import { Request, Response, NextFunction } from "express";
import config from "../../../../config";
import facebookWebhookController from "./facebook";
import { FaceBookWebhookPayload } from "./types";
import intercomWebhookController from "./intercom";


export const intercomWebhook = async (req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(200)
    return intercomWebhookController(req.body)
}


export const facebookHubVerify = async (req: Request, res: Response, next: NextFunction) => {
    if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === config.get('FB_VALIDATION_TOKEN')) {
        res.send(req.query['hub.challenge'])
    } else {
        res.sendStatus(401)
    }
}

export const facebookWebhook = async (req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(200)
    const body = req.body
    if (body.object !== 'page') return
    body.entry.forEach((singleEntry: { messaging: FaceBookWebhookPayload[] }) => {
        return singleEntry.messaging.map(facebookWebhookController)
    });
}