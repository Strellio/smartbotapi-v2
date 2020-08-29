'use strict'

import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';
import config from '../../config';

const REDIS_URL = config.get("REDIS_URL")

const redisClient = () => new Redis(REDIS_URL)

export const redisPubSub = () => {
    return new RedisPubSub({
        publisher: redisClient(),
        subscriber: redisClient()
    });
}