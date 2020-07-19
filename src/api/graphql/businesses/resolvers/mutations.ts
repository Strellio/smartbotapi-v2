'use strict'

import * as intercomService from '../../../../services/chat-platforms/platforms/intercom'
import chatPlatformService from '../../../../services/chat-platforms'

export default {
  Mutation: {
    addIntercom: async (parent: any, { input }: any) => {
      return intercomService.add(input.business_id)
    },
    updateChatPlatform: (parent: any, { input }: any) => {
      return chatPlatformService().update(input)
    },
    createChatPlatform: (parent: any, { input }: any) => {
      return chatPlatformService().create(input)
    }
  }
}
