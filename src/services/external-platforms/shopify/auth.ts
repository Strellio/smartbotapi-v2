'use strict'

import shopifyLib from '../../../lib/shopify'
import { required, validate, generateJwt } from '../../../lib/utils'
import businessService from '../../businesses'
import schema from './schema'
import { STATUS_MAP } from '../../../models/common'
import config from '../../../config'
import { PLATFORM_MAP } from '../../../models/businesses/schema/enums'


export function install ({ shop = required('shop') }) {
  return shopifyLib().shopifyToken.generateAuthUrl(shop)
}

const getWidgetCode =(businessId: string)=>{
  return `${config.get("APP_URL")}?token=${generateJwt({business_id: businessId}, "1year")}`
}

export async function callback (params: CallbackParams): Promise<string> {
  const payload = validate(schema, params)
  const { access_token }: any = await shopifyLib().shopifyToken.getAccessToken(
    payload.shop,
    payload.code
  )
  const shopifyClient = shopifyLib().shopifyClient({ shop: payload.shop, accessToken: access_token })
  const shopDetails = await  shopifyClient.shop.get()


  const createBusinessPayload = {
    status: STATUS_MAP.ACTIVE,
    domain: `https://${shopDetails.domain}`,
    email: shopDetails.email,
    phone_number: shopDetails.phone,
    shop: {
      external_platform_domain: `https://${shopDetails.myshopify_domain}`,
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

  let business = await businessService().getByExternalPlatformDomain(
    createBusinessPayload.shop.external_platform_domain
  )
  if (!business) {
    business = await businessService().create(createBusinessPayload)
    console.log(getWidgetCode(business.id));
    
    await shopifyClient.scriptTag.create({
      src: getWidgetCode(business.id),
      event: "onload"
    }).catch(err=>{
      console.log(err.message);
      
    })
  }

  return `${config.get('DASHBOARD_URL')}/api/auth?token=${generateJwt({
    business_id: business.id
  })}&business_id=${business.id}` as any
}

interface CallbackParams {
  code: string
  hmac: string
  shop: string
  time: string
}
