'use strict'

import conversationService from '../../../../services/conversation'

export default {
  Query: {
    getConversation: async ({ input }: any) => {
      return conversationService().getCustomerConversation(input)
    }
  }
}
