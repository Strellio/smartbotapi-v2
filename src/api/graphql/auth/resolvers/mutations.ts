'use strict'

import authService from '../../../../services/auth'

export default {
  Mutation: {
    createAccount: async (parent: any, { input }: any, context: any) => {
      return authService.register({
        ...input,
        country: context?.useragent?.country,
        city: context?.useragent?.city
      })
    },
    login: async (parent, { input }) => {
      return authService.login(input)
    },
    verifyCode: async (parent, { input }) => {
      return authService.verifyCode(input)
    }
  }
}
