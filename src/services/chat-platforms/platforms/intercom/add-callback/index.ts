'use strict'

import { required } from '../../../../../lib/utils'
import businessModel from '../../../../../models/businesses'
import intercomLib from '../../../../../lib/intercom'
import create from '../../../create'
import {
  CHAT_PLATFORMS,
  CHAT_TYPE
} from '../../../../../models/chat-platforms/schema'
import config from '../../../../../config'

export default async function addCallback (
  businessId: string = required('businessId'),
  code: string = required('code')
) {
  let redirectUrl: string

  try {
    const business = await businessModel().getById(businessId)
    const { access_token } = await intercomLib().geToken(code)
    await create({
      business_id: business.id,
      external_access_token: access_token,
      platform: CHAT_PLATFORMS.INTERCOM,
      type: CHAT_TYPE.ON_SITE
    })
    redirectUrl = `${config.get(
      'DASHBOARD_URL'
    )}/settings?intercom_connect_state=success`
  } catch (error) {
    redirectUrl = `${config.get(
      'DASHBOARD_URL'
    )}/settings?intercom_connect_state=failed&errorMessage=${error.message}`
  }
  return redirectUrl
}
