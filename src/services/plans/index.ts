'use strict'
import PlanModel from '../../models/plans'
import changePlan from './change-plan'
import charge from './charge'
import activeCharge from './activate-charge'

export default function planService () {
  return {
    getAll: PlanModel().getAll,
    getById: PlanModel().getById,
    changePlan,
    charge,
    activeCharge
  }
}
