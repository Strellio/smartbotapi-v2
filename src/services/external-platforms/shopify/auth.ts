'use strict'

import shopifyLib from '../../../lib/shopify'
import { required, validate } from '../../../lib/utils'
import businessService from '../../businesses'
import schema from './schema'
import { STATUS_MAP } from '../../../models/common'
import config from '../../../config'
import { PLATFORM_MAP } from '../../../models/businesses/schema/enums'

export function install ({ shop = required('shop') }) {
  return shopifyLib().shopifyToken.generateAuthUrl(shop)
}

export async function callback (params: CallbackParams): Promise<string> {
  const payload = validate(schema, params)
  const { access_token }: any = await shopifyLib().shopifyToken.getAccessToken(
    params.shop,
    params.code
  )
  const shopDetails = await shopifyLib()
    .shopifyClient({ shop: params.shop, accessToken: access_token })
    .shop.get()

  const createBusinessPayload = {
    status: STATUS_MAP.ACTIVE,
    domain: `https://${shopDetails.myshopify_domain}`,
    email: shopDetails.email,
    phone_number: shopDetails.phone,
    shop: {
      external_platform_domain: `https://${shopDetails.domain}`,
      external_created_at: shopDetails.created_at,
      money_format: shopDetails.money_format,
      external_access_token: access_token
    },
    external_id: String(shopDetails.id),
    business_name: shopDetails.name,
    location: {
      country: shopDetails.country_name,
      city: shopDetails.city
    },
    platform: PLATFORM_MAP.SHOPIFY
  }

  const business = await businessService().getByExternalPlatformDomain(
    createBusinessPayload.shop.external_platform_domain
  )
  if (!business) {
    await businessService().create(createBusinessPayload)
  }

  return config.get('DASHBOARD_URL') as any
}

interface CallbackParams {
  code: string
  hmac: string
  shop: string
  time: string
}
