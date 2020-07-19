'use strict'
import mongoose from 'mongoose'
import schema from './schema'
import BaseModel from '../common/base-model'
import { required } from '../../lib/utils'
import { omitBy, isNil } from 'lodash'
const Model = mongoose.model('messages', schema)
const MessageBaseModel = BaseModel(Model)

function listByBusiness ({
  business_id = required('business_id'),
  customer_id
}: {
  customer_id?: string
  business_id: string
}) {
  return MessageBaseModel.paginate({
    query: omitBy({ customer: customer_id, business: business_id }, isNil)
  })
}

export default () => {
  return {
    ...MessageBaseModel,
    listByBusiness
  }
}
