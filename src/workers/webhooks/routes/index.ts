"use strict";
import { Router } from "express";
import {
  intercomWebhook,
  facebookHubVerify,
  facebookWebhook,
  hubspotWebhook,
  customActionWebhook,
} from "./actions";
import { isAuthenticatedMiddleware, verifyWebhook } from "./middlewares";
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
    .post("/hubspot/message", hubspotWebhook)
    .post("/custom/message", isAuthenticatedMiddleware, customActionWebhook);
}
