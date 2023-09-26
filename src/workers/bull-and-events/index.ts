"use strict";
import * as db from "../../lib/db";
import syncProductsWorker from "./sync-product";
import syncOrdersWorker from "./sync-order";
import pubsub from "../../lib/pubsub";
import config from "../../config";
import handleEvent from "./events";
import planService from "../../services/plans";
import H from "highland"

db.connect().then(() => {
  syncProductsWorker();
    syncOrdersWorker();
   H(planService().getAll()).collect().toPromise(Promise)
  pubsub.googlePubSub.subscribe({
    subscriberName: config.SHOPIFY_GOOGLE_PUB_SUB_SUBSCRIPTION_NAME,
    handler: handleEvent,
  });
});
