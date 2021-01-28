'use strict'

import { gql } from 'apollo-server-express'
import {
  MESSAGE_TYPE,
  MESSAGE_MEDIA_TYPE
} from '../../../../models/messages/schema'

const messageType = Object.values(MESSAGE_TYPE)
const messageMedia = Object.values(MESSAGE_MEDIA_TYPE)

export default gql`
enum MessageTypeEnum{
  ${messageType}
}

  type Message {
    id:ID!
    customer: Customer!
    agent: Agent
    external_id: String 
    business: ObjectID!
    type: MessageTypeEnum!
    media: [MessageMedia!]
    text:String
    is_chat_with_live_agent:Boolean!
    is_message_from_customer:Boolean!
    is_message_sent:Boolean!
    source: MessageSource!
    created_at: DateTime!
    generic_templates: [MessageGenericTemplate!]
    buttons: [Buttons!]
  }

  type Buttons {
    payload: String
    title: String
  }

  type GenericTempButton {
    type: String!
    url: URL
    title: String
  }

  type MessageGenericTemplate{
    title: String!
    subtitle: String
    image_url: URL!
    link: URL
    buttons:[GenericTempButton]

  }

  type MessageSource{
    id:String!
    platform: String
  }

  type MessageMedia {
    url:URL!
    type: MessageMediaEnum!
  }

  type ListMessages{
    next_item_cursor: ObjectID
    data: [Message!]
    count: Int!
    
  }

  #Input
 input ListConversationsInput{
   customer_id:ObjectID!
   is_chat_with_live_agent:Boolean
   cursor: String
   limit: PositiveInt = 10
 }

 input AddMessageInput{
  customer_id:ObjectID!
  agent_id:ObjectID
  external_id:String
  source:ObjectID
  type:MessageTypeEnum!
  media:[MessageMediaInput!] 
  text:String
  agent_external_id:String
  is_message_from_customer:Boolean=false
  is_chat_with_live_agent:Boolean=true
 }

 input MessageMediaInput {
    url:String!
    type: MessageMediaEnum!
  }

 enum MessageMediaEnum{
   ${messageMedia}
 }

 input NewCustomerMessageInput{
   customer_id: ObjectID!
 }
`
