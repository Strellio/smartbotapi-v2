'use strict'

import chatPlatformModel from '../../../models/chat-platforms'
import schema from './schema'
import { validate } from '../../../lib/utils'
import * as chatPlatforms from '../platforms'

interface updateParams {
  chat_platform_id: string
  status: string
  external_page_name: string
  external_user_access_token: string
  external_user_id: string
  external_user_name: string
  external_access_token: string
  external_id: string
}

export default async function update (params: updateParams) {
  const { chat_platform_id, ...rest } = validate(schema, params)
  await chatPlatformModel().getById(chat_platform_id)
  const transformedPayload = await chatPlatforms.transformByPlatform(rest)
  return chatPlatformModel().updateById(chat_platform_id, transformedPayload)
}
