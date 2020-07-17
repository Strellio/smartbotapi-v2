'use strict'
import businessModel from '../../../models/businesses'
import { validate } from '../../../lib/utils'
import schema from './schema'
import * as chatPlatforms from '../platforms'
import chatPlatformModel from '../../../models/chat-platforms'
import errors from '../../../lib/errors'

interface createParams {
  business_id: string
  platform: string
  external_page_name: string
  external_user_access_token: string
  external_user_id: string
  external_user_name: string
  external_access_token: string
  external_id: string
  type: string
}

const ensureChatPlatformNotAddedByExternalId = async (
  externalId: string,
  platform: string
) => {
  const chatPlatform = await chatPlatformModel().getByExternalIdAndPlatform(
    externalId,
    platform
  )
  if (chatPlatform) {
    throw errors.throwError({
      name: errors.MissingFunctionParamError,
      message: 'chat platform already exists'
    })
  }
}

export default async function create (params: createParams) {
  const payload = validate(schema, params)
  const business = await businessModel().getById(params.business_id)
  await ensureChatPlatformNotAddedByExternalId(
    params.external_id,
    params.platform
  )
  const transformedPayload = await chatPlatforms.transformByPlatform(payload)
  return chatPlatformModel().create({
    ...transformedPayload,
    business: business.id
  })
}
