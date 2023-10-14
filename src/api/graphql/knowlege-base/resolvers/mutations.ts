'use strict'

import knowlegeBaseService from '../../../../services/knowlege-base'

export default {
  Mutation: {
    createOrUpdateKnowlegeBase: async (parent: any, { input }: any, { business }: any) => {
      return knowlegeBaseService.createOrUpdateKnowlegeBase( { ...input, businessId: business.id })
    }
  }
}
