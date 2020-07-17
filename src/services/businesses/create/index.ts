'use strict'
import BusinessModel from '../../../models/businesses'
import schema from './schema'
import { Business } from '../../../models/businesses/types'
import { validate } from '../../../lib/utils'
import errors from '../../../lib/errors'
import userService from '../../users'

interface CreateBusinessParams {
  domain: string
  email: string
  status: string
  external_id: string
  business_name: string
  shop: {
    external_created_at?: string
    external_updated_at?: string
    external_platform_domain: string
    external_access_token?: string
    external_refresh_token?: string
    money_format?: string
    external_platform_secret?: string
    external_platform_client?: string
  }
  full_name?: string
  location?: {
    country: string
    city: string
  }
}

const ensureBusinessDoesNotExist = async (externalPlatformDomain: string) => {
  const business = await BusinessModel().getByExternalPlatformDomain(
    externalPlatformDomain
  )
  if (business) {
    throw errors.throwError({
      name: errors.ResourceAlreadyExists,
      message: 'business already exists'
    })
  }
}

export default async function create (
  params: CreateBusinessParams
): Promise<Business> {
  validate(schema, params)
  await ensureBusinessDoesNotExist(params.shop.external_platform_domain)
  const user = await userService().updateOrCreate({
    email: params.email,
    full_name: params.full_name,
    country: params.location?.country
  })

  return BusinessModel().create({
    data: {
      ...params,
      user: user.id
    }
  })
}
