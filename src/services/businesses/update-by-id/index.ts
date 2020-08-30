'use strict'

import { validate, convertObjectToDotNotation } from '../../../lib/utils'
import schema from './schema'
import BusinessModel from '../../../models/businesses'

interface UpdateParams {
  id: string
  status?: string
  plan_id?: string
  business_name?: string
  currency?: string
  shop?: {
    external_access_token?: string
    external_refresh_token?: string
    money_format?: string
    external_platform_secret?: string
    external_platform_client?: string
  }
}

export default async function updateById(params: UpdateParams) {
  const { id, shop = {}, ...validedparams }: UpdateParams = validate(schema, params)

  await BusinessModel().getById(id)

  const shopQuery = convertObjectToDotNotation("shop", shop, "")
  return BusinessModel().updateById(params.id, {
    ...validedparams,
    ...shopQuery
  })
}
