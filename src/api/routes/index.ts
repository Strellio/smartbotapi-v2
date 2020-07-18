'use strict'

import { Router } from 'express'
import {
  shopifyAuthCallback,
  shopifyAuthInstall,
  intercomAuthCallback
} from './actions'

export default function router () {
  return Router()
    .get('/shopify/install', shopifyAuthInstall)
    .get('/shopify/callback', shopifyAuthCallback)
    .get('/intercom/callback', intercomAuthCallback)
}
