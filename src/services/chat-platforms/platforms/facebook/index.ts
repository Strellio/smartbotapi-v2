'use strict'
import transformData from './transform-data'
import { sendTextMessage, sendMediaMessage } from '../../../../lib/facebook'
import { MESSAGE_TYPE } from '../../../../models/messages/schema'

export { transformData }

export async function sendMessage (params: any) {
  if (params.type === MESSAGE_TYPE.TEXT)
    return sendTextMessage({
      accessToken: params.access_token,
      text: params.text,
      recipientId: params.receipient_id,
      personaId: params.agent_external_id
    })
  if (params.type === MESSAGE_TYPE.MEDIA)
    return sendMediaMessage({
      accessToken: params.access_token,
      type: params.media[0]?.type,
      recipientId: params.receipient_id,
      personaId: params.agent_external_id,
      url: params.media[0]?.url
    })
}
