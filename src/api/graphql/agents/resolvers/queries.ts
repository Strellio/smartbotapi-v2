"use strict";
import agentService from "../../../../services/agents";
import H from "highland";
import { flattenDeep } from "lodash";

export const attachChatPlatform = (agent: any) => {
  const { linked_chat_agents, linked_chat_agents_platforms, ...rest } =
    agent?.toObject ? agent?.toObject() : agent;
  const linkedAgentsList: string[] = linked_chat_agents.map((agentId: any) =>
    String(agentId)
  );
  const linkedChatPlatformAgents = flattenDeep(
    flattenDeep(linked_chat_agents_platforms)
      .filter((chatPlatform: any) => !chatPlatform.is_deleted)
      .map((chatPlatform: any) => {
        console.log(chatPlatform);
        return chatPlatform.agents.map((chatAgent: any) => ({
          ...chatAgent,
          platform: chatPlatform.platform,
        }));
      })
  );
  const onlyLinkedChatPlatformAgents = linkedChatPlatformAgents.filter(
    (chatAgent: any) => {
      return linkedAgentsList.includes(String(chatAgent.id));
    }
  );
  return {
    ...rest,
    linked_chat_agents: onlyLinkedChatPlatformAgents,
  };
};

export default {
  Query: {
    listAgents: (parent: any, { input }: any, { business }: any) => {
      return H(agentService.listByBusinessId(business.id))
        .map(attachChatPlatform)
        .collect()
        .toPromise(Promise as any);
    },
    getAgent: (parent: any, { input }: any, { agent }: any) =>
      attachChatPlatform(agent),
    getBotAgent: (parent: any, { input }: any, { business }: any) =>
      agentService.getBotAgent(business.id),
  },
};
