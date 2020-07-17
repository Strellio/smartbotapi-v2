'use strict'

import { required, calculateTrialDays } from '../../../lib/utils'
import businessModel from '../../../models/businesses'
import planModel from '../../../models/plans'
import shopifyLib from '../../../lib/shopify'
import changePlan from '../change-plan'
import config from '../../../config'

export default async function activateCharge ({
  business_id = required('business_id'),
  charge_id = required('charge_id'),
  plan_id = required('plan_id')
}: {
  business_id: string
  charge_id: string
  plan_id: string
}) {
  try {
    const business = await businessModel().getById(business_id)
    const plan = await planModel().getById(plan_id)
    const client = shopifyLib().shopifyClient({
      shop: business.shop.external_platform_domain,
      accessToken: business.shop.external_access_token
    })
    if (business.shop?.charge_id) {
      await client.recurringApplicationCharge.delete(
        business.shop.charge_id as any
      )
    }
    const recurringCharge = await client.recurringApplicationCharge.activate(
      charge_id as any,
      {
        name: plan.display_name,
        price: plan.price,
        trial_days: calculateTrialDays(
          plan.free_trial_days,
          business.trial_expiry_date
        )?.days
      }
    )
    await changePlan({
      business_id,
      plan_id,
      charge_id: recurringCharge.id as any
    })
    return `${config.get('DASHBOARD_URL')}/plans?success=true`
  } catch (error) {
    return `${config.get('DASHBOARD_URL')}/plans?success=false&errorMessage=${
      error.message
    }`
  }
}
