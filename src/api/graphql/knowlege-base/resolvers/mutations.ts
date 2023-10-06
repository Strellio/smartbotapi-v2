'use strict'

import knowlegeBaseService from '../../../../services/knowlege-base'

export default {
  Mutation: {
    createOrUpdateKnowlegeBase: async (parent: any, { input }: any, { business }: any) => {
      return knowlegeBaseService.upsert({ query: { business: business.id }, update: { ...input, business: business.id } })
    }
  }
}
