"use strict";
import * as db from "../../lib/db";
import syncProductsWorker from "./sync-product";
import syncOrdersWorker from "./sync-order";
import pubsub from "../../lib/pubsub";
import config from "../../config";
import handleEvent from "./events";
import planService from "../../services/plans";
import H from "highland";
import express from "express";
import cors from "cors";
import loggerMaker from "../../lib/logger";
import updateKnowlegeBaseWorker from "./update-knowlege-base";

const app = express();

function startServer() {
  const PORT = config.PORT;

  const reqLogger = require("express-pino-logger")({
    logger: loggerMaker(),
  });

  app
    .use(cors())
    .use(express.json())
    .use(express.urlencoded({ extended: false }))
    // .use(reqLogger)
    .get("/health", (req, res) => res.sendStatus(200))
    .listen(PORT, () => {
      loggerMaker().info(`Server started on http://localhost:${PORT}`);
    });
}

db.connect().then(() => {
  syncProductsWorker();
  syncOrdersWorker();
  updateKnowlegeBaseWorker();
  H(planService().getAll()).collect().toPromise(Promise);
  pubsub.googlePubSub.subscribe({
    subscriberName: config.SHOPIFY_GOOGLE_PUB_SUB_SUBSCRIPTION_NAME,
    handler: handleEvent,
  });

  startServer();
});
