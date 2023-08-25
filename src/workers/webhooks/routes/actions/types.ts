import { MESSAGE_MEDIA_TYPE } from "../../../../models/messages/schema"




interface Author {
    type: 'lead';
    id: string;
    name: null | string;
    email: string;
  }
  
interface Attachment {
    content_type:string,
    url:string
    // Define properties for attachments if needed
  }
  
  interface Source {
    type: 'conversation';
    id: string;
    delivered_as: 'customer_initiated';
    subject: string;
    body: string;
    author: Author;
    attachments: Attachment[];
    url: string;
    redacted: boolean;
  }
  
  interface Contact {
    // Define properties for contacts if needed
  }
  
  interface FirstContactReply {
    created_at: number;
    type: 'conversation';
    url: string;
  }
  
  interface Statistics {
    // Define properties for statistics if needed
  }
  
  interface Teammates {
    // Define properties for teammates if needed
  }
  
  interface ConversationPart  {
        type: 'conversation_part';
        id: string;
        part_type: string;
        body: string;
        created_at: number;
        updated_at: number;
        notified_at: number;
        assigned_to: null | string;
        author: {
          id: string;
          type: string;
          name: null | string;
          email: string;
        };
        attachments: any[]; // Replace 'any[]' with a more specific type if you have more information about the structure of attachments
        external_id: null | any; // Replace 'any' with a more specific type if you have more information about the structure of external_id
        redacted: boolean;
    }

  
  interface Topics {
    // Define properties for topics if needed
  }
  
  interface IntercomConversation {
    type: 'conversation';
    id: string;
    created_at: number;
    updated_at: number;
    waiting_since: number;
    snoozed_until: null | number;
    source: Source;
    contacts: { type: 'contact.list'; contacts: Contact[] };
    first_contact_reply: FirstContactReply;
    admin_assignee_id: null | string;
    team_assignee_id: null | string;
    open: boolean;
    state: 'open';
    read: boolean;
    tags: { type: 'tag.list'; tags: string[] };
    priority: 'not_priority';
    sla_applied: null | string;
    statistics: Statistics;
    conversation_rating: null | string;
    teammates: Teammates;
    title: string;
    custom_attributes: Record<string, any>;
    topics: { type: 'topic.list'; topics: Topics[]; total_count: number };
    ticket: null | string;
    conversation_parts: {
      type: 'conversation_part.list';
      conversation_parts: ConversationPart[];
      total_count: number;
    };
  }
  

export type IntercomWebhookPayload = {
    type: string
    app_id: string
    data: {
        type: string,
        item: IntercomConversation
    },
    links: Record<string, any>;
    id: string;
    topic: string;
    delivery_status: string;
    delivery_attempts: number;
    delivered_at: number;
    first_sent_at: number;
    created_at: number;
    self: null | any; 
}


export type FaceBookWebhookPayload = {
    sender: { id: string }
    recipient: { id: string }
    timestamp: number
    message?: {
        mid: string
        text: string
        tags: { source: string }
        attachments?: {
            type: MESSAGE_MEDIA_TYPE,
            payload: { url: string }
        }[]
    }
    read?: { watermark: number }
}

export type HubspotWebhookPayload = {
    portalId: number
    userMessage: { message: string, quickReply: any }
    parsedResult: any
    bot: { nickname: string, conversationChannelType: string }
    module: {
        botNickname: string
        fallbackNextModuleNickname: any
        failureNextModuleNickname: any
        moduleType: string
        nickname: string
        prompt: null
        promptHtml: null
        config: {
            id: number
            timeout: number
            customPayload: string
            expectingResponse: boolean
        }
    },
    session: {
        vid: string
        conversationId: number
        botNickname: string
        currentModuleNickname: string
        sessionStartedAt: number
        lastInteractionAt: number
        state: string
        customState: any
        responseExpected: boolean
        parsedResponses: any
        properties: any
    },
}