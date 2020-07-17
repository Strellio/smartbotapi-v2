'use strict'
import * as db from '../lib/db'

db.connect().then(() => {
  require('./server')
})
