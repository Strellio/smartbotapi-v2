'use strict'

import errors from '../../../lib/errors'
import customError from '../../../lib/errors/custom-error'
import shopify from '../shopify'
import flutterwave from './flutterwave'

const platformApis = {
  shopify: shopify(),
  flutterwave: flutterwave()
}

const wrongPlatformError = () => {
  //  eslint-disable-next-line
  throw customError({
    name: errors.ValidationError,
    message: 'platform is not supported'
  })
}

export default function platforms (platform) {
  return platformApis[platform] || wrongPlatformError()
}
