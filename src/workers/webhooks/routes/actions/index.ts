"use strict";
import { Request, Response, NextFunction, Router } from "express";
import config from "../../../../config";
import facebookWebhookController from "./facebook";
import { FaceBookWebhookPayload } from "./types";
import intercomWebhookController from "./intercom";
import hubSpotController from "./hubspot";
import customController from "./custom";
import logger from "../../../../lib/logger";
import { handleGdpr, handleUninstall } from "./shopify";
import { TYPES } from "../../../../models/gdpr/schema";

export const intercomWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.sendStatus(200);
  return intercomWebhookController(req.body).catch((error) =>
    logger().error(error)
  );
};

export const facebookHubVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (
    req.query["hub.mode"] === "subscribe" &&
    req.query["hub.verify_token"] === config.FB_VALIDATION_TOKEN
  ) {
    res.send(req.query["hub.challenge"]);
  } else {
    res.sendStatus(401);
  }
};

export const facebookWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.sendStatus(200);
  const body = req.body;
  if (body.object !== "page") return;
  try {
    body.entry.forEach(
      (singleEntry: { messaging: FaceBookWebhookPayload[] }) => {
        return singleEntry.messaging.map(facebookWebhookController);
      }
    );
  } catch (error) {
    logger().error(error);
  }
};

export const hubspotWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return hubSpotController(req.body).then((data) => res.json(data));
};

export const customActionWebhook = (
  req: Request,
  res: Response,
  next: NextFunction
) =>
  customController(req.body)
    .then((message) => res.json(message))
    .catch((error) => res.status(400).json(error));

export function shopifyWebhook() {
  const customerRedact = (req: Request, res: Response, next: NextFunction) =>
    handleGdpr({ payload: req.body, type: TYPES.CUSTOMERS_REDACT })
      .then(() => res.sendStatus(200))
      .catch(next);

  const shopRedact = (req: Request, res: Response, next: NextFunction) =>
    handleGdpr({ payload: req.body, type: TYPES.SHOP_REDACT })
      .then(() => res.sendStatus(200))
      .catch(next);

  const customerRequest = (req: Request, res: Response, next: NextFunction) =>
    handleGdpr({ payload: req.body, type: TYPES.CUSTOMER_DATA_REQUEST })
      .then(() => res.sendStatus(200))
      .catch(next);

  const uninstallRequest = (req: Request, res: Response, next: NextFunction) =>
    handleUninstall((req as any).shop)
      .then(() => res.sendStatus(200))
      .catch(console.error);

  return Router()
    .post("/shop/redact", shopRedact)
    .post("/customers/redact", customerRedact)
    .post("/customers/data_request", customerRequest)
    .post(
      "/uninstall",
      (req, res, nex) => {
        logger().info("uninstalling request");
        nex();
      },
      uninstallRequest
    );
}
