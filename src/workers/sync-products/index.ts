"use strict";
import { SandboxedJob } from "bullmq";
import * as db from "../../lib/db";
// import * as redis from "../../lib/redis";
import { Business } from "../../models/businesses/types";
import { PLATFORM_MAP } from "../../models/businesses/schema/enums";
import shopifyService  from "../../services/external-platforms/shopify"
import logger from "../../lib/logger";
import { createVectoreStore } from "../../lib/vectorstore/create-vectorstore";

const mapPlatformToHandler = {
  "shopify": shopifyService().syncProducts
}

export default async function syncProductsWorker(job: SandboxedJob<any>) {
  
  await Promise.all([db.connect()]);
  const business = job.data.business as Business

  const handler = mapPlatformToHandler[business.platform]


  if (handler) {

    const documents = await handler({ business })

      if(documents.length === 0)  return    logger().info(`No products found for ${business.domain}`);

      await createVectoreStore({ dbName: business.account_name, indexName: "products-retriever", collectionName: "products-store", documents })
          
  }
  
  logger().info(`Done syncing products for ${business.domain}`);
}


