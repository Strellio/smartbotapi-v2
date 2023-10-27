"use strict";

import { Router } from "express";
import {
  shopifyAuthCallback,
  shopifyAuthInstall,
  intercomAuthCallback,
  activePlatformCharge,
  insertSeeds,
  checkWordpressStatus,
  wordpressCallback,
  wordpressInstall,
} from "./actions";

export default function router() {
  return Router()
    .get("/shopify/install", shopifyAuthInstall)
    .get("/shopify/callback", shopifyAuthCallback)
    .get("/plans/charge", activePlatformCharge)
    .get("/intercom/callback", intercomAuthCallback)
    .get("/wordpress/status", checkWordpressStatus)
    .post("/wordpress/install", wordpressInstall)
    .post("/wordpress/callback", wordpressCallback)
    .get("/seeds", insertSeeds);
}
