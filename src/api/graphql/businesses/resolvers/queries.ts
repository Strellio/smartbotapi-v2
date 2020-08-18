import { listAgents } from '../../../../services/chat-platforms/platforms/intercom'
import chatPlatformService from '../../../../services/chat-platforms'
import businessService from '../../../../services/businesses'

export default {
  Query: {
    listIntercomAgents: (parent: any, { input }: any, {business}: any) => {
      return listAgents(business.id, input.chat_platform_id)
    },
    listChatPlatforms: (parent: any, { input }: any, {business}: any) => {
      return chatPlatformService().list({ ...input,business_id: business.id })
    },
    getBusiness: (parent:any, {input}: any, {business}: any)=>business,
    
    getWidgetSettings:  (parent:any, {input}: any, {business}: any)=>{
      return businessService().getSettings(business.id)
    }
  }
}
