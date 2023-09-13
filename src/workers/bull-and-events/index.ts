'use strict'
import * as db from '../../lib/db'
import syncProductsWorker from "./sync-product"
import syncOrdersWorker from "./sync-order"
import pubsub from '../../lib/pubsub'
import config from '../../config'
import handleEvent from './events'


db.connect().then(() => {
    syncProductsWorker()
    syncOrdersWorker()
    pubsub.subscribe(config.SHOPIFY_GOOGLE_PUB_SUB_SUBSCRIPTION_NAME,
     handleEvent
      )
})