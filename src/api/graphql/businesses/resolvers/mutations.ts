'use strict'

import * as intercomService from '../../../../services/chat-platforms/platforms/intercom'

export default {
  Mutation: {
    addIntercom: async (parent: any, { input }: any) => {
      return intercomService.add(input.business_id)
    }
  }
}
