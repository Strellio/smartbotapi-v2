"use strict";
import { Worker } from "bullmq";
import { Business } from "../../models/businesses/types";
import logger from "../../lib/logger";
import { BULL_QUEUES_NAMES, ioredis } from "../../lib/queues";
import createOrUpdateKnowledgeBaseVectorStore from "../../services/knowlege-base/create-vector-store";

export default async function updateKnowlegeBaseWorker() {
  async function processorFn(job) {
    try {
      const business = job.data.business as Business;

      const knowlegeBase = job.data.knowlegeBase;

      if (!knowlegeBase)
        return logger().info(`No knowlegeBase found for ${business.domain}`);

      await createOrUpdateKnowledgeBaseVectorStore({
        knowledgeBase: knowlegeBase,
        business,
      });
    } catch (error) {
      console.log(error);
      logger().error(
        "Error in creating or updating knowlegebase vectore store",
        error
      );
    }
  }

  new Worker(BULL_QUEUES_NAMES.KNOWLEDGE_BASE_UPDATE, processorFn, {
    connection: ioredis,
  });
}
