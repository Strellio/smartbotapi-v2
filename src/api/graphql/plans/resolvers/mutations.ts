'use strict'

import planService from '../../../../services/plans'

export default {
  Mutation: {
    activateCharge: async (parent: any, { input }: any) => {
      return planService().activeCharge(input)
    },
    charge: async (parent: any, { input }: any) =>
      planService().charge(input?.business_id, input?.plan_id)
  }
}
