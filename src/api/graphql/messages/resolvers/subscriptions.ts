'use strict'

import { withFilter } from 'graphql-subscriptions'
import { redisPubSub } from '../../../../lib/redis'
import config from '../../../../config'

export default {
  Subscription: {
    onNewAdminMessage: {
      subscribe: withFilter(
        (_, args) =>
          redisPubSub().asyncIterator(config.get('NEW_ADMIN_MESSAGE_TOPIC')),
        (payload, variables, { business }) => {
          return payload.onNewAdminMessage.business === business.id
        }
      )
    },
    onNewCustomerMessage: {
      subscribe: withFilter(
        (_, args) =>
          redisPubSub().asyncIterator(config.get('NEW_ADMIN_MESSAGE_TOPIC')),
        (payload, variables, { business }) => {
          return (
            payload.onNewCustomerMessage.business === business.id &&
            variables.customer_id === payload.onNewCustomerMessage.customer.id
          )
        }
      )
    }
  }
}
