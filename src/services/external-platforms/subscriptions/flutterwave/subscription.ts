"use strict";

import { Shop } from "../../../../models/businesses/types";
import axios from "../../../../lib/request";
import config from "../../../../config";

const request = axios.create({
  baseURL: "https://api.flutterwave.com/v3",
});

const verifyTransaction = (chargeId) =>
  request.get(`/transactions/${chargeId}/verify`, {
    headers: {
      Authorization: `Bearer ${config.FLUTTERWAVE_SEC_KEY}`,
    },
  });

const cancelOldSubscription = (chargeId) =>
  request.get(`/subscriptions/${chargeId}/verify`, {
    headers: {
      Authorization: `Bearer ${config.FLUTTERWAVE_SEC_KEY}`,
    },
  });

const activateSubscription = (chargeId) =>
  request.get(`/subscriptions/${chargeId}/verify`, {
    headers: {
      Authorization: `Bearer ${config.FLUTTERWAVE_SEC_KEY}`,
    },
  });

export async function activateCharge({
  chargeId,
  shop,
  trialDays,
  isFree,
  plan,
  oldChargeId,
}: {
  shop: Shop;
  chargeId?: number;
  plan;
  trialDays: number;
  isFree: boolean;
  oldChargeId?: number;
}) {
  if (oldChargeId) {
    await cancelOldSubscription(oldChargeId);
  }
  if (!isFree) {
    const transaction = await verifyTransaction(chargeId);
  }
}
