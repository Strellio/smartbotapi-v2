"use strict";

import { ShopifyResource } from "../../../lib/loaders/shopify";
import * as auth from "./auth";
import * as subscription from "./subscription";
import syncData from "./sync-data"
import getDocument from "./get-document";

export default function shopifyService() {
  return {
    auth,
    subscription,
    syncProducts : syncData(ShopifyResource.PRODUCTS),
    syncOrders: syncData(ShopifyResource.ORDERS),
    getProductDocument: getDocument(ShopifyResource.PRODUCTS),
    getOrderDocument: getDocument(ShopifyResource.ORDERS)

    

  };
}
