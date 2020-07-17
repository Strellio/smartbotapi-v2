'use strict'

import PlanModel from '../../../models/plans'

export default async function getAllPlans () {
  return PlanModel.getAll()
}
