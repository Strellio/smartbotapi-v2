'use strict'
import { Request, Response, NextFunction } from 'express'
import config from '../../../../config'
import facebookWebhookController from './facebook'
import { FaceBookWebhookPayload } from './types'
import intercomWebhookController from './intercom'
import hubSpotController from './hubspot'
import logger from '../../../../lib/logger'

export const intercomWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.sendStatus(200)
  return intercomWebhookController(req.body).catch(error =>
    logger().error(error)
  )
}

export const facebookHubVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === config.get('FB_VALIDATION_TOKEN')
  ) {
    res.send(req.query['hub.challenge'])
  } else {
    res.sendStatus(401)
  }
}

export const facebookWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.sendStatus(200)
  const body = req.body
  if (body.object !== 'page') return
  body.entry.forEach((singleEntry: { messaging: FaceBookWebhookPayload[] }) => {
    return singleEntry.messaging.map(facebookWebhookController)
  })
}

export const hubspotWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return hubSpotController(req.body).then(data => res.json(data))
}
