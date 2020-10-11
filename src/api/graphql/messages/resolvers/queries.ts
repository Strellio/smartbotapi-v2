'use strict'

import conversationService from '../../../../services/conversations'
export default {
  Query: {
    listConversations: async (
      parent: any,
      { input }: any,
      { business }: any
    ) => {
      return conversationService().listByBusiness({
        ...input,
        business_id: business.id
      })
    }
  }
}
