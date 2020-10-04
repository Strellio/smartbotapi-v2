'use strict'
import agentService from '../../../../services/agents'

export default {
  Mutation: {
    createAgent: async (
      parent: any,
      { input: { profile_url, ...rest } }: any,
      { business }: any
    ) => {
      return agentService.create({
        ...rest,
        profile_url: profile_url.href,
        business_id: business.id
      })
    },

    updateAgent: async (
      parent: any,
      { input: { profile_url, ...rest } }: any,
      { business }: any
    ) => {
      return agentService.update({
        ...rest,
        profile_url: profile_url.href,
        business_id: business.id
      })
    }
  }
}
