'use strict'
import add from './add'
import addCallback from './add-callback'
import listAgents from './list-agents'
import transformData from './transform-data'
import intercomLib from '../../../../lib/intercom'

export async function sendMessage(params: any) {
    return intercomLib().conversations.create({ conversationId: params.conversation_id, accessToken: params.access_token, text: params.text, recipientId: params.receipient_id, personaId: params.agent_external_id })
}
export { add, addCallback, listAgents, transformData }



