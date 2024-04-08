"use strict";
import { NextFunction, Request, Response, Router } from "express";
import {
  intercomWebhook,
  facebookHubVerify,
  facebookWebhook,
  hubspotWebhook,
  customActionWebhook,
  shopifyWebhook,
  instagramWebhook,
  whatsappWebhook,
} from "./actions";
import {
  isAuthenticatedMiddleware,
  validateShopifyHmac,
  verifyWebhook,
} from "./middlewares";
import config from "../../../config";
import "../../../services/plans";

export default function routes() {
  return Router()
    .post(
      "/intercom/message",
      verifyWebhook({
        path: "headers.x-hub-signature",
        secret: config.INTERCOM_CLIENT_SECRET,
        hasSplit: true,
      }),
      intercomWebhook
    )
    .get("/facebook/message", facebookHubVerify)
    .post(
      "/facebook/message",
      verifyWebhook({
        path: "headers.x-hub-signature",
        secret: config.FB_CLIENT_SECRET,
        hasSplit: true,
      }),
      facebookWebhook
    )
    .get("/instagram/message", facebookHubVerify)
    .post(
      "/instagram/message",
      verifyWebhook({
        path: "headers.x-hub-signature",
        secret: config.FB_CLIENT_SECRET,
        hasSplit: true,
      }),
      instagramWebhook
    )
    .post("/hubspot/message", hubspotWebhook)
    .post("/custom/message", isAuthenticatedMiddleware, customActionWebhook)
    .get("/whatsapp/message", facebookHubVerify)
    .post(
      "/whatsapp/message",
      verifyWebhook({
        path: "headers.x-hub-signature",
        secret: config.FB_CLIENT_SECRET,
        hasSplit: true,
      }),
      whatsappWebhook
    )
    .use("/shopify", validateShopifyHmac, shopifyWebhook());
}
