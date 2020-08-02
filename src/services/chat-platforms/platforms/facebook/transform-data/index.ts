'use strict'
import {
  generateLongAccessToken,
  generatePageAccessToken
} from '../../../../../lib/facebook'
import { required } from '../../../../../lib/utils'

export default async function transformData (
  payload: any = required('payload')
) {
  if (payload.external_user_access_token) { 
    const { access_token } = await generateLongAccessToken(
      payload.external_user_access_token
    )
    payload.external_user_access_token = access_token
  }
  if (payload.external_id) {
    const pageResponse = await generatePageAccessToken({
      pageId: payload.external_id,
      accessToken: payload.external_user_access_token
    })
    payload.external_page_access_token = pageResponse.access_token
  }

  return payload
}
