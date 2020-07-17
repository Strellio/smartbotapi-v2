'use strict'

import * as db from '../../../src/lib/db'
import PLANS from '../../../src/models/plans/seeds'
import planModel from '../../../src/models/plans'

async function seedPlans () {
  await db.connect(),
    await Promise.all(
      PLANS.map(plan => {
        return planModel().updateOrCreateByName(plan.name, plan)
      })
    )

  process.exit()
}

seedPlans()
