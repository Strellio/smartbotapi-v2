'use strict'
import mongoose from 'mongoose'
import schema from './schema'
import BaseModel from '../common/base-model'
import { required } from '../../lib/utils'
import { ChatPlatform } from '../businesses/types'
const Model = mongoose.model('chat_platforms', schema)
const chatPlatformModel = BaseModel(Model)

const getById = (id: string = required('id')): Promise<ChatPlatform> =>
  chatPlatformModel.ensureExists({
    _id: id
  })

const getByExternalIdAndPlatform = (
  id: string = required('id'),
  platform: string = required('platform')
) =>
  chatPlatformModel.get({
    query: {
      platform,
      _id: id
    }
  })

const updateById = (
  id: string = required('id'),
  update: object = required('update')
): Promise<ChatPlatform> =>
  chatPlatformModel.updateOne({
    query: {
      _id: id
    },
    update
  })

export default function () {
  return {
    ...chatPlatformModel,
    updateById,
    getById,
    getByExternalIdAndPlatform
  }
}
