'use strict'
import planService from '../../../../services/plans'
import H from 'highland'
export default {
  Query: {
    getPlans: () => {
      return H(planService().getAll())
        .collect()
        .toPromise(Promise as any)
    }
  }
}
