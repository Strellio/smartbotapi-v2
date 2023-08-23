'use strict'

import * as customerService from '../../../../services/customers'

export default {
  Mutation: {
    createCustomer: (parent: any, { input }: any, { business }: any) => {

      console.log(input)
      return customerService.createOrUpdate({
        ...input,
        business_id: business.id
      })
    }
  }
}
