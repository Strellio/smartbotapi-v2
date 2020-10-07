'use strict'

import { withFilter } from 'graphql-subscriptions'
import { redisPubSub } from '../../../../lib/redis'
import config from '../../../../config'

export default {
  Subscription: {
    onNewMessage: {
      subscribe: withFilter(
        (_, args) =>
          redisPubSub().asyncIterator(config.get('NEW_MESSAGE_TOPIC')),
        (payload, variables, { business }) => {
          return payload.onNewMessage.business === business.id
        }
      )
    }
  }
}
