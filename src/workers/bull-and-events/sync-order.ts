"use strict";
import { Worker, tryCatch } from "bullmq";
// import * as redis from "../../lib/redis";
import { Business } from "../../models/businesses/types";
import shopifyService  from "../../services/external-platforms/shopify"
import logger from "../../lib/logger";
import { createVectoreStore } from "../../lib/vectorstore/create-vectorstore";
import { BULL_QUEUES_NAMES, ioredis } from "../../lib/queues";
import { PLATFORM_MAP } from "../../models/businesses/schema/enums";

const mapPlatformToHandler = {
  [PLATFORM_MAP.SHOPIFY]: shopifyService().syncOrders
}

export default async function syncOrdersWorker() {
  async function processorFn(job) {
    try {

      const business = job.data.business as Business

      const handler = mapPlatformToHandler[business.platform]
            
      if (handler) {
      
        const documents = await handler({ business })
      
        if (documents.length === 0) return logger().info(`No orders found for ${business.domain}`);
      
        await createVectoreStore({ dbName: business.account_name, indexName: "orders-retriever", collectionName: "orders-store", documents })

        logger().info(`vetcorestore orders found for ${business.domain}`);
                
      }
      
    } catch (error) {
      console.log(error)
    }
    }



  new Worker(BULL_QUEUES_NAMES.SYNC_STORE_ORDERS, processorFn, {
    connection : ioredis
    });


  

}


