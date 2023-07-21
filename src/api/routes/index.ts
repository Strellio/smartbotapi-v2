"use strict";

import { Router } from "express";
import {
  shopifyAuthCallback,
  shopifyAuthInstall,
  intercomAuthCallback,
  activePlatformCharge,
  insertSeeds,
} from "./actions";

export default function router() {
  return Router()
    .get("/shopify/install", shopifyAuthInstall)
    .get("/shopify/callback", shopifyAuthCallback)
    .get("/plans/charge", activePlatformCharge)
    .get("/intercom/callback", intercomAuthCallback)
    .get("/seeds", insertSeeds)
    .post("/ticket", (req, res) => {
      console.log("req.body", req.body);
      return res.json({
        id: "123",
        status: "pending",
        customer_id: req.body.customer_id,
        title: req.body.title,
        description: req.body.description,
        priority: "low",
        complete: false,
      });
    })

    .get("/ticket/:id", (req, res) => {
      return res.json({
        id: "123",
        status: "pending",
        customer_id: req.body.customer_id,
        title: req.body.title,
        description: req.body.description,
        priority: "low",
        complete: false,
      });
    });
}
