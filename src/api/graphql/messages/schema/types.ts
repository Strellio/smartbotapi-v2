'use strict'

import { gql } from 'apollo-server-express'
import { MESSAGE_TYPE } from '../../../../models/messages/schema'

const message_type = Object.values(MESSAGE_TYPE)

export default gql`
enum MessageTypeEnum{
  ${message_type}
}

  type Message {
    customer: Customer!
    agent: Agent
    external_id: String!
    business: Business!
    source: ChatPlatform!
    type: MessageTypeEnum!
    media_url:URL
    text:String
    is_message_from_admin:Boolean!
    is_message_sent:Boolean!
  }
`
