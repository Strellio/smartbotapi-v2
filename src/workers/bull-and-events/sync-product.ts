"use strict";
import { Worker } from "bullmq";
import { Business } from "../../models/businesses/types";
import shopifyService from "../../services/external-platforms/shopify";
import logger from "../../lib/logger";
import { createVectoreStore } from "../../lib/vectorstore/create-vectorstore";
import { BULL_QUEUES_NAMES, ioredis } from "../../lib/queues";

const mapPlatformToHandler = {
  shopify: shopifyService().syncProducts,
};

export default async function syncProductsWorker() {
  async function processorFn(job) {
    const business = job.data.business as Business;

    const handler = mapPlatformToHandler[business.platform];

    if (handler) {
      const documents = await handler({ business });

      if (documents.length === 0)
        return logger().info(`No products found for ${business.domain}`);

      await createVectoreStore({
        dbName: business.account_name,
        indexName: "products-retriever",
        collectionName: "products-store",
        documents,
      });
    }
  }

  new Worker(BULL_QUEUES_NAMES.SYNC_STORE_PRODUCTS, processorFn, {
    connection: ioredis,
  });
}
