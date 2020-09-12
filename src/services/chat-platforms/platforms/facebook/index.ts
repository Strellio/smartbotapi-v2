'use strict'
import transformData from './transform-data'
import { sendTextMessage } from "../../../../lib/facebook"

export { transformData }

export async function sendMessage(params: any) {
    return sendTextMessage({ accessToken: params.access_token, text: params.text, recipientId: params.receipient_id, personaId: params.agent_external_id })
}

