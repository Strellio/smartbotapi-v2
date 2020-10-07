'use strict'

import * as customerService from '../../../../services/customers'
export default {
  Query: {
    listCustomers: async (parent: any, { input }: any, { business }: any) => {
      return customerService.listByBusinessId({
        ...input,
        businessId: business.id
      })
    }
  }
}
