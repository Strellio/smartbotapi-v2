'use strict'

import { Router } from 'express'
import {
  shopifyAuthCallback,
  shopifyAuthInstall,
  intercomAuthCallback,
  activePlatformCharge
} from './actions'

export default function router () {
  return Router()
    .get('/shopify/install', shopifyAuthInstall)
    .get('/shopify/callback', shopifyAuthCallback)
    .get('/plans/charge', activePlatformCharge)
    .get('/intercom/callback', intercomAuthCallback)
}
