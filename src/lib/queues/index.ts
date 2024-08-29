import { Queue } from "bullmq";
import config from "../../config";

import IORedis from "ioredis";

export const ioredis = new IORedis(config.REDIS_URL);

export enum BULL_QUEUES_NAMES {
  SYNC_STORE_PRODUCTS = "SYNC_STORE_PRODUCTS",
  SYNC_STORE_ORDERS = "SYNC_STORE_ORDERS",
  KNOWLEDGE_BASE_UPDATE = "KNOWLEDGE_BASE_UPDATE",
}

const productSyncQueue = () => {
  const queue = new Queue(BULL_QUEUES_NAMES.SYNC_STORE_PRODUCTS, {
    connection: ioredis,
  });

  return {
    add<T>({
      data,
      jobId,
      repeat,
    }: {
      data: T;
      jobId?: string;
      repeat?: number;
    }) {
      return queue.add("NEW_PRODUCT_SYNC_QUEUE_JOB", data, {
        jobId,
      });
    },
    queue,
  };
};

const orderSyncQueue = () => {
  const queue = new Queue(BULL_QUEUES_NAMES.SYNC_STORE_ORDERS, {
    connection: ioredis,
  });

  return {
    add<T>({
      data,
      jobId,
      repeat,
    }: {
      data: T;
      jobId?: string;
      repeat?: number;
    }) {
      return queue.add("NEW_ORDER_SYNC_QUEUE_JOB", data, {
        jobId,
      });
    },
    queue,
  };
};

const knowledgeBaseUpdateQueue = () => {
  const queue = new Queue(BULL_QUEUES_NAMES.KNOWLEDGE_BASE_UPDATE, {
    connection: ioredis,
  });

  return {
    add<T>({
      data,
      jobId,
      repeat,
    }: {
      data: T;
      jobId?: string;
      repeat?: number;
    }) {
      return queue.add("UPDATE_KNOWLEDGE_BASE_JOB", data, {
        jobId,
      });
    },
    queue,
  };
};

export default {
  productSyncQueue,
  orderSyncQueue,
  knowledgeBaseUpdateQueue,
};
