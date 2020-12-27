'use strict'
import mongoose from 'mongoose'
import schema from './schema'
import BaseModel from '../common/base-model'
import { required } from '../../lib/utils'
import { omitBy, isNil } from 'lodash'
import { Message } from './types'
const Model = mongoose.model('messages', schema)
const MessageBaseModel = BaseModel(Model)

const FIELDS_TO_POPULATE = [
  'agent',
  'source',
  'customer',
  { path: 'customer', populate: 'source' }
]

function listByBusiness ({
  business_id = required('business_id'),
  customer_id,
  cursor,
  limit,
  is_chat_with_live_agent
}: {
  customer_id?: string
  business_id: string
  cursor: string
  is_chat_with_live_agent?: string
  limit: string
}): Promise<{
  data: Message[]
  count: number
  next_item_cursor: string
}> {
  return MessageBaseModel.paginate({
    query: omitBy(
      { customer: customer_id, business: business_id, is_chat_with_live_agent },
      isNil
    ),
    after: cursor,
    limit,
    populate: FIELDS_TO_POPULATE
  })
}

const create = (data: any = required('data')): Promise<Message> =>
  MessageBaseModel.create({ data, populate: FIELDS_TO_POPULATE })

const countByBusinessId = (
  businessId: string = required('businessId'),
  extraQuery = {}
) => MessageBaseModel.count({ business: businessId, ...extraQuery })

export default () => {
  return {
    countByBusinessId,
    create,
    listByBusiness
  }
}
