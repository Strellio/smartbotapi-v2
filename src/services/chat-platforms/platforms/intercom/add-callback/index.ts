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
    const workspace = await intercomLib().getWorkSpace(access_token)    

    await create({
      business_id: business.id,
      external_access_token: access_token,
      platform: CHAT_PLATFORMS.INTERCOM,
      type: CHAT_TYPE.ON_SITE,
      workspace_id: workspace.app.id_code
    }) 

    redirectUrl = `${config.get(
      'DASHBOARD_URL'
    )}/chat-platforms?intercom_connection=successfully`
  } catch (error) {
    redirectUrl = `${config.get(
      'DASHBOARD_URL'
    )}/chat-platforms?intercom_connection=failed&errorMessage=${error.message}`
  }
  return redirectUrl
}
