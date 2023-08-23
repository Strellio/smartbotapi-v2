"use strict";

import { withFilter } from "graphql-subscriptions";
import pubsub from "../../../../lib/pubsub";
import config from "../../../../config";

export default {
  Subscription: {
    onNewAdminMessage: {
      subscribe: withFilter(
        (_, args) => pubsub.asyncIterator(config.NEW_ADMIN_MESSAGE_TOPIC),
        (payload, variables, { business }) => {
          return payload.onNewAdminMessage.business === business.id;
        }
      ),
    },
    onNewCustomerMessage: {
      subscribe: withFilter(
        (_, args) => pubsub.asyncIterator(config.NEW_CUSTOMER_MESSAGE_TOPIC),
        (payload, variables, { business }) => {
          return (
            payload.onNewCustomerMessage.business === business.id &&
            variables?.input.customer_id ===
              payload.onNewCustomerMessage.customer.id
          );
        }
      ),
    },
  },
};
