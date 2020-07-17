'use strict'
import got from 'got'

const maxRetryAfterInSeconds = 5000
const retryLimit = 3

export default got.extend({
  retry: {
    limit: retryLimit,
    maxRetryAfter: maxRetryAfterInSeconds,
    methods: ['POST']
  }
})
