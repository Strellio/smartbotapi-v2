"use strict";
import { PubSub } from '@google-cloud/pubsub'
import { redisPubSub } from "../redis";
import config from '../../config';

const pubSubClient = new PubSub({
    projectId: config.GOOGLE_CLOUD_PROJECT
})

const subscribe = ({
  subscriberName,
  handler
}: {
  subscriberName: string
  handler: (...args: any[]) => void
    }) => {
    console.log(subscriberName)
  const subscription = pubSubClient.subscription(subscriberName)
  return subscription.on('message', handler)
}


export default {
    redisPubSub: redisPubSub(),
    googlePubSub: {
        subscribe
    }
};
