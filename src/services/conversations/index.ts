'use strict'
import messageModel from '../../models/messages'
import addMessage from './add'

export default function conversationsService () {
  return {
    listByBusiness: messageModel().listByBusiness,
    addMessage: addMessage
  }
}
