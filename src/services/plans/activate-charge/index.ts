'use strict'

import { required, calculateTrialDays } from '../../../lib/utils'
import businessModel from '../../../models/businesses'
import planModel from '../../../models/plans'
import shopifyLib from '../../../lib/shopify'
import changePlan from '../change-plan'
import config from '../../../config'
import externalPlatforms from '../../external-platforms/subscriptions'

const PLANS_TO_IGNORE = new Set(['free'])

export default async function activateCharge ({
  business_id = required('business_id'),
  plan_id = required('plan_id'),
  charge_id,
  platform
}: {
  business_id: string
  charge_id?: string
  plan_id: string
  platform: string
}) {
  try {
    const business = await businessModel().getById(business_id)
    const plan = await planModel().getById(plan_id)
    const response = await externalPlatforms(
      platform
    ).subscription.activateCharge({
      shop: business.shop,
      plan,
      trailDays: calculateTrialDays(
        plan.free_trial_days,
        business.trial_expiry_date
      )?.days,
      oldChargeId: business.shop?.charge_id,
      isFree: PLANS_TO_IGNORE.has(plan.name),
      chargeId: charge_id
    })
    console.log(response)

    await changePlan({
      business_id,
      plan_id,
      charge_id: charge_id as any
    })
    return `${config.get('DASHBOARD_URL')}/plans?success=true`
  } catch (error) {
    return `${config.get('DASHBOARD_URL')}/plans?success=false&errorMessage=${
      error.message
    }`
  }
}
