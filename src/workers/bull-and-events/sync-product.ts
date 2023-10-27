"use strict";
import { Worker } from "bullmq";
import { Business } from "../../models/businesses/types";
import shopifyService from "../../services/external-platforms/shopify";
import logger from "../../lib/logger";
import { createVectoreStore } from "../../lib/vectorstore/create-vectorstore";
import { BULL_QUEUES_NAMES, ioredis } from "../../lib/queues";
import { PLATFORM_MAP } from "../../models/businesses/schema/enums";
import { createSearchIndex } from "../../lib/db/atlas";
import businessService from "../../services/businesses";

const mapPlatformToHandler = {
  [PLATFORM_MAP.SHOPIFY]: shopifyService().syncProducts,
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
      })
        .then(async (res) => {
          await businessService().updateById({
            id: business.id,
            onboarding: {
              is_product_vector_store_created: true,
            },
          });
          logger().info(
            "Done adding products to vectore store for ",
            business.business_name
          );
        })
        .catch((err) => {
          logger().error(
            "Error creating products-retriever index for ",
            business.account_name,
            err
          );
        });

      await createSearchIndex({
        dbName: business.account_name,
        indexName: "products-retriever",
        collectionName: "products-store",
      })
        .then(async () => {
          await businessService().updateById({
            id: business.id,
            onboarding: {
              is_product_index_created: true,
            },
          });

          logger().info(
            "Done adding products-retriever index for ",
            business.business_name
          );
        })
        .catch((err) => {
          logger().error("Error creating products-retriever index ", err);
        });

      logger().info("Done adding indexes for ", business.business_name);
    }
  }

  new Worker(BULL_QUEUES_NAMES.SYNC_STORE_PRODUCTS, processorFn, {
    connection: ioredis,
  });
}
