"use strict";

import { RedisPubSub } from "graphql-redis-subscriptions";
import Redis from "ioredis";
import config from "../../config";
import logger from "../logger";

const REDIS_URL = config.REDIS_URL;

const redisClient = () => new Redis(REDIS_URL);

export const connect = () => {
  return redisClient()
    .connect()
    .then(() => logger().info("Redis connection established"));
};

export const redisPubSub = () => {
  return new RedisPubSub({
    publisher: redisClient(),
    subscriber: redisClient(),
  });
};
