'use strict'
import messageModel from '../../models/messages'

export default function conversationService () {
  return {
    getCustomerConversation: messageModel().getCustomerMessages,
    getBusinessCoversation: messageModel().getBusinessMessages
  }
}
