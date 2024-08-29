"use strict";
import config from "../../../config";
import { woocommerce } from "../../../lib/wordpress";
const topics = [
  "product.created",
  "order.created",
  "order.updated",
  "product.updated",
  "product.deleted",
  "order.deleted",
  "product.restored",
  "order.restored",
];

const registerWebhooks = ({ domain, consumerKey, consumerSecret }) => {
  return Promise.all(
    topics.map((topic) => {
      const path = topic.replace(".", "s/");
      return woocommerce({ domain, consumerKey, consumerSecret }).postAsync(
        "webhooks",
        {
          name: topic,
          topic,
          delivery_url: `${config.WEBHOOK_URL}/v1/wordpress/${path}`,
          secret: config.APP_KEY,
        }
      );
    })
  );
};

export default registerWebhooks;
