'use strict'

import conversationsService from '../../../../services/conversations'

export default {
  Mutation: {
    addMessage: (parent: any, { input }: any, { business }: any) => {
      return conversationsService().create({ ...input, business_id: business.id })

    }
  }
}
