"use strict";
import { PubSub } from "@google-cloud/pubsub";
import { redisPubSub } from "../redis";
import config from "../../config";

import { GooglePubSub } from "@axelspringer/graphql-google-pubsub";
import { parseString } from "../utils";

const pubsub = new GooglePubSub(
  {
    projectId: config.GOOGLE_CLOUD_PROJECT,
  },
  (topicName) => {
    return `${topicName}-sub`;
  },
  ({ data }) => {
    return parseString(data.toString());
  }
);

// export default pubsub

const pubSubClient = new PubSub({
  projectId: config.GOOGLE_CLOUD_PROJECT,
  keyFilename: config.GOOGLE_APPLICATION_CREDENTIALS,
});

const subscribe = ({
  subscriberName,
  handler,
}: {
  subscriberName: string;
  handler: (...args: any[]) => void;
}) => {
  const subscription = pubSubClient.subscription(subscriberName);
  return subscription.on("message", handler);
};

export default {
  redisPubSub: redisPubSub(),
  graphqlGooglePubSub: pubsub,
  googlePubSub: {
    subscribe,
  },
};
