'use strict'
import businessModel from '../../../models/businesses'
import planModel from '../../../models/plans'
import { required } from '../../../lib/utils'

export default async function changePlan({
  business_id = required('business_id'),
  plan_id = required('plan_id'),
  charge_id
}: {
  business_id: string
  plan_id: string
  charge_id?: string
}) {
  await businessModel().ensureExists({ _id: business_id })
  await planModel().getById(plan_id)

  const upgrade = {
    plan: plan_id,
    'shop.charge_id': charge_id,
    date_upgraded: new Date()
  }
  return businessModel().updateById(business_id, upgrade)
}
