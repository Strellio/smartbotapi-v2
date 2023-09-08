'use strict'
import businessModel from '../../../models/businesses'
import { validate } from '../../../lib/utils'
import schema from './schema'
import chatPlatformModel from '../../../models/chat-platforms'
import H from 'highland'

interface createParams {
  business_id: string
  platform?: string
  type?: string
  status?: string
}

export default async function list (params: createParams) {
  const { business_id, ...rest } = validate(schema, params)
  const business = await businessModel().getById(business_id)
  return H(chatPlatformModel().listByBusinessId(business.id, rest))
    .collect()
    .toPromise(Promise as any)
}
