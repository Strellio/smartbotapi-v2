'use strict'
import "../../models/agents"  // to fix schema register issue
import messageModel from '../../models/messages'
import create from './create'

export default function conversationsService() {
  return {
    listByBusiness: messageModel().listByBusiness,
    create
  }
}
