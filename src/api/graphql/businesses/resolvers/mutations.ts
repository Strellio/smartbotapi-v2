'use strict'

import * as intercomService from '../../../../services/chat-platforms/platforms/intercom'
import chatPlatformService from '../../../../services/chat-platforms'

export default {
  Mutation: {
    addIntercom: async (parent: any, { input }: any, { business }: any) => {
      return intercomService.add(business.id)
    },
    updateChatPlatform: async (parent: any, { input }: any, { business }: any) => {
      const result = await chatPlatformService().update({
        ...input,
        business_id: business.id,
      })

      return result
    },
    createChatPlatform: (parent: any, { input }: any, { business }: any) => {
      return chatPlatformService().create({
        ...input,
        business_id: business.id,
      })
    }
  }
}
