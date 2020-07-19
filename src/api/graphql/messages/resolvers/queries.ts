'use strict'

import conversationService from '../../../../services/conversations'
import H from 'highland'
export default {
  Query: {
    listConversations: async (parent: any, { input }: any) => {
      return conversationService().listByBusiness(input)
    }
  }
}
