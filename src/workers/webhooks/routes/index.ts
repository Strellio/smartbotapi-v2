'use strict'
import { Router } from "express";
import { intercomWebhook } from "./actions";
import { verifyWebhook } from "./middlewares";
import config from "../../../config";


export default function routes() {
    return Router().post("/intercom/message", verifyWebhook({ path: "headers.x-hub-signature", secret: config.get("INTERCOM_CLIENT_SECRET") as any, hasSplit: true }), intercomWebhook)
}