'use strict'
import agentService from '../../../../services/agents'
import { attachChatPlatform } from './queries'

export default {
  Mutation: {
    createAgent: async (
      parent: any,
      { input: { profile_url, ...rest } }: any,
      { business }: any
    ) => {
      const result = await agentService.create({
        ...rest,
        profile_url: profile_url.href,
        business_id: business.id
      })

      return attachChatPlatform(result)

    },

    updateAgent: async (
      parent: any,
      { input: { profile_url, ...rest } }: any,
      { business }: any
    ) => {
      const result = await agentService.update({
        ...rest,
        profile_url: profile_url.href,
        business_id: business.id
      })

      return attachChatPlatform(result)
    }
  }
}
