'use strict'
import PlanModel from '../../models/plans'

export default function planService () {
  return {
    getAll: PlanModel.getAll,
    getById: PlanModel.getById
  }
}
