'use strict'

import * as intercomService from '../../../../services/chat-platforms/platforms/intercom'
import chatPlatformService from '../../../../services/chat-platforms'

export default {
  Mutation: {
    addIntercom: async (parent: any, { input }: any, { business }: any) => {
      return intercomService.add(business.id)
    },
    updateChatPlatform: (parent: any, { input }: any, { business }: any) => {
      return chatPlatformService().update({
        ...input,
        business_id: business.id,
      })
    },
    createChatPlatform: (parent: any, { input }: any, { business }: any) => {
      return chatPlatformService().create({
        ...input,
        business_id: business.id,
      })
    }
  }
}
