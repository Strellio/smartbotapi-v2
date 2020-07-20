'use strict'
import create from './create'
import update from './update'
import list from './list'
import {sendMessageToCustomer} from "./platforms"
export default function chatPlatformService () {
  return { create, update, list, sendMessageToCustomer }
}
