import { listAgents } from '../../../../services/chat-platforms/platforms/intercom'
import chatPlatformService from '../../../../services/chat-platforms'

export default {
  Query: {
    listIntercomAgents: (parent: any, { input }: any) => {
      return listAgents(input.business_id, input.chat_platform_id)
    },
    listChatPlatforms: (parent: any, { input }: any) => {
      return chatPlatformService().list(input)
    }
  }
}
