'use strict'
import facebook from './facebook'
import intercom from './intercom'

import { required } from '../../../lib/utils'

export const chatPlatforms = { facebook, intercom }

export default function sendMessageByPlatform (
  payload: any = required('payload')
) {
  const platforms: any = chatPlatforms
  const sendMessage = platforms[payload.platform]
  return sendMessage(payload)
}
