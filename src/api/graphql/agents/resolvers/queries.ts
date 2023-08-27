
'use strict'
import agentService from '../../../../services/agents'
import H from 'highland'
import { flattenDeep } from "lodash";


const attachChatPlatform = (agent: any) => {
    const { linked_chat_agents, linked_chat_agents_platforms, ...rest } = agent?.toObject()
    const linkedAgentsList: string[] = linked_chat_agents.map((agentId: any) => String(agentId))
    const linkedChatPlatforms = flattenDeep(
        flattenDeep(linked_chat_agents_platforms).map((chatPlatform: any) => {
            return chatPlatform.agents.map((chatAgent: any) => ({
                ...chatAgent,
                platform: chatPlatform.platform
            }))
        })
    )
    const onlyLinkedChatPlatforms = linkedChatPlatforms.filter((chatAgent: any) => {
        return linkedAgentsList.includes(String(chatAgent.id))
    })
    return {
        ...rest,
        linked_chat_agents: onlyLinkedChatPlatforms
    }
}

export default {
    Query: {
        listAgents: (parent: any, { input }: any, { business }: any) => {
            return H(agentService.listByBusinessId(business.id)).map(attachChatPlatform).collect().toPromise(Promise as any)
        }
    }
}
