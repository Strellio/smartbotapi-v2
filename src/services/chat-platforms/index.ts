'use strict'
import create from './create'
import update from './update'
import list from './list'
import { sendMessageToCustomer } from "./platforms"
import chatPlatformModel from '../../models/chat-platforms'



export default function chatPlatformService() {
  return { create, update, list, sendMessageToCustomer, getByWorkSpaceId: chatPlatformModel().getByWorkSpaceId, getByExternalIdAndPlatform: chatPlatformModel().getByExternalIdAndPlatform }
}
