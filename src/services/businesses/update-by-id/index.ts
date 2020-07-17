'use strict'

import { validate } from '../../../lib/utils'
import schema from './schema'
import BusinessModel from '../../../models/businesses'

interface UpdateParams {
  id: string
  status?: string
  plan_id?: string
  business_name?: string
  external_created_at?: string
  external_access_token?: string
  external_refresh_token?: string
  currency?: string
  external_platform_secret?: string
  external_platform_client?: string
}

export default async function updateById (params: UpdateParams) {
  validate(schema, params)
  await BusinessModel().getById(params.id)
  return BusinessModel().updateById(params.id, params)
}
