'use strict'
import mongoose from 'mongoose'
import schema from './schema'
import BaseModel from '../common/base-model'
import { required } from '../../lib/utils'
import { omitBy, isNil } from 'lodash'
const Model = mongoose.model('messages', schema)
const MessageBaseModel = BaseModel(Model)

const FIELDS_TO_POPULATE = ['agent', "source", "customer"]


function listByBusiness({
  business_id = required('business_id'),
  customer_id,
  cursor,
  limit
}: {
  customer_id?: string
  business_id: string
  cursor: string
  limit: string
}) {
  return MessageBaseModel.paginate({
    query: omitBy({ customer: customer_id, business: business_id }, isNil),
    after: cursor,
    limit,
    populate: FIELDS_TO_POPULATE
  })
}

const create = (data: any = required("data")) => MessageBaseModel.create({ data, populate: FIELDS_TO_POPULATE })

export default () => {
  return {
    create,
    listByBusiness
  }
}
