'use strict'

import { required } from '../../../../../lib/utils'
import businessModel from '../../../../../models/businesses'
import intercomLib from '../../../../../lib/intercom'
import chatPlatformModel from '../../../../../models/chat-platforms'

export default async function listAgents(
  businessId: string = required('businessId'),
  chatPlatformId: string = required('chatId')
) {
  await businessModel().getById(businessId)
  const chatPlatform = await chatPlatformModel().getById(chatPlatformId)
  return intercomLib().admins.get(chatPlatform.external_access_token)
}
