'use strict'
import mongoose from 'mongoose'
import schema from './schema'
import BaseModel from '../common/base-model'
import { required } from '../../lib/utils'
import { ChatPlatform } from '../businesses/types'
import { omitBy, isNil } from 'lodash'
const Model = mongoose.model('chat_platforms', schema)
const chatPlatformModel = BaseModel(Model)

const getById = (id: string = required('id')): Promise<ChatPlatform> =>
  chatPlatformModel.ensureExists({
    _id: id
  })

const getByExternalIdAndPlatform = (
  platform: string = required('platform'),
  businessId: string = required('businessId'),
  externalId?: string
) =>
  chatPlatformModel.get({
    query: omitBy(
      {
        platform,
        external_id: externalId,
        business: businessId
      },
      isNil
    )
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

const create = (data = required('data')) =>
  chatPlatformModel.create({
    data
  })

export default function () {
  return {
    ...chatPlatformModel,
    create,
    updateById,
    getById,
    getByExternalIdAndPlatform
  }
}
