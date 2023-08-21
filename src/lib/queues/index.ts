import { Queue, Worker } from "bullmq";
import path from "path";
import config from "../../config";

import "../../workers/sync-products/index.ts";

export enum BULL_QUEUES_NAMES {
  SYNC_STORE_PRODUCTS = "SYNC_STORE_PRODUCTS",
}

const repeatProductSyncQueue = () => {
  const queue = new Queue(BULL_QUEUES_NAMES.SYNC_STORE_PRODUCTS);

  if (config.get("NODE_ENV") !== "test") {
    new Worker(
      BULL_QUEUES_NAMES.SYNC_STORE_PRODUCTS,
      path.join(__dirname, "../../workers/sync-products/index.ts")
    );
  }

  return {
    add<T>({
      data,
      jobId,
      repeat,
    }: {
      data: T;
      jobId?: string;
      repeat: number;
    }) {
      return queue.add("NEW_PRODUCT_SYNC_QUEUE_JOB", data, {
        jobId,
        repeat: {
          every: repeat,
        },
      });
    },
    queue,
  };
};

export default {
  repeatProductSyncQueue,
};
