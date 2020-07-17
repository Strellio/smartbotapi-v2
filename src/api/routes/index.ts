'use strict'

import { Router } from 'express'
import { shopifyAuthCallback, shopifyAuthInstall } from './actions'

export default function router () {
  return Router()
    .get('/shopify/install', shopifyAuthInstall)
    .get('/shopify/callback', shopifyAuthCallback)
}
