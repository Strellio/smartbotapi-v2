'use strict'
import create from './create'
import update from './update'
import list from './list'
export default function chatPlatformService () {
  return { create, update, list }
}
