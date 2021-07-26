'use strict'

import config from '../../../config'
import shopifyLib from '../../../lib/shopify'
import { Shop } from '../../../models/businesses/types'

export const createCharge = async ({
  shop,
  plan,
  returnUrl,
  trialDays
}: {
  shop: Shop
  plan: any
  returnUrl: string
  trialDays: number
}) => {
  const client = shopifyLib().shopifyClient({
    shop: shop.external_platform_domain,
    accessToken: shop.external_access_token
  })

  const recurringCharge = await client.recurringApplicationCharge.create({
    name: plan.display_name,
    price: plan.price,
    trial_days: trialDays,
    return_url: returnUrl,
    test: config.get('NODE_ENV') !== 'production'
  })
  return recurringCharge.confirmation_url
}

export const activateCharge = async ({
  chargeId,
  shop,
  trialDays,
  isFree,
  plan,
  oldChargeId
}: {
  shop: Shop
  chargeId?: number
  plan
  trialDays: number
  isFree: boolean
  oldChargeId?: number
}) => {
  const client = shopifyLib().shopifyClient({
    shop: shop.external_platform_domain,
    accessToken: shop.external_access_token
  })
  if (oldChargeId) {
    await client.recurringApplicationCharge.delete(oldChargeId)
  }
  if (!isFree) {
    const recurringCharge = await client.recurringApplicationCharge.activate(
      chargeId as any,
      {
        name: plan.display_name,
        price: plan.price,
        trial_days: trialDays
      }
    )
    chargeId = recurringCharge.id
  }

  return {
    charge_id: chargeId
  }
}
