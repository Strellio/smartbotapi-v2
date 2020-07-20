'use strict'

import conversationsService from '../../../../services/conversations'

export default {
  Mutation: {
    addMessage: ({ input }: any) => {
      return conversationsService().addMessage(input)
    }
  }
}
