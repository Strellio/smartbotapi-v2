'use strict'

import chatPlatformModel from '../../../models/chat-platforms'
import schema from './schema'
import { validate } from '../../../lib/utils'
import * as chatPlatforms from '../platforms'

interface updateParams {
  id: string
  status?: string
  external_page_name?: string
  external_user_access_token?: string
  external_user_id?: string
  external_user_name?: string
  external_access_token?: string
  external_id?: string
  agents?: [
    {
      external_id: string
      name: string
      profile_url: string
      is_person: string
    }
  ]
}

export default async function update (params: updateParams) {
  const { id, ...rest } = validate(schema, params)
  await chatPlatformModel().getById(id)
  const transformedPayload = await chatPlatforms.transformByPlatform(rest) 
  return chatPlatformModel().updateById(id, transformedPayload)
}
