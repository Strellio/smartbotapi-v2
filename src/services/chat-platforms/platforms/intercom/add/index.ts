'use strict'

import { required } from '../../../../../lib/utils'
import businessModel from '../../../../../models/businesses'
import intercomLib from '../../../../../lib/intercom'

export default async function add (businessId = required('businessId')) {
  const business = await businessModel().getById(businessId)
  return intercomLib().getAuthRedirect(business.id)
}
