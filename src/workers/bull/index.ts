'use strict'
import * as db from '../../lib/db'
import syncProductsWorker from "./sync-product"
import syncOrdersWorker from "./sync-order"


db.connect().then(() => {
    syncProductsWorker()
    syncOrdersWorker()
})