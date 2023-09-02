"use strict";

import { ShopifyResource } from "../../../lib/loaders/shopify";
import * as auth from "./auth";
import * as subscription from "./subscription";
import  syncData from "./sync-data"

export default function shopifyService() {
  return {
    auth,
    subscription,
    syncProducts : syncData(ShopifyResource.PRODUCTS),
    syncOrders : syncData(ShopifyResource.ORDERS)

  };
}
