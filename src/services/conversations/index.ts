'use strict'
import messageModel from '../../models/messages'

export default function conversationsService () {
  return {
    listByBusiness: messageModel().listByBusiness
  }
}
