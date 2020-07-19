'use strict'
import mongoose from 'mongoose'
import schema from './schema'
import BaseModel from '../common/base-model'
const Model = mongoose.model('messages', schema)
const MessageBaseModel = BaseModel(Model)
function getCustomerMessages ({
  customer_id,
  business_id
}: {
  customer_id: string
  business_id: string
}) {
  return MessageBaseModel.fetch({
    query: { customer: customer_id, business: business_id }
  })
}

function getBusinessMessages (business_id: string) {
  return MessageBaseModel.fetch({
    query: { business: business_id }
  })
}

export default () => {
  return {
    ...MessageBaseModel,
    getCustomerMessages,
    getBusinessMessages
  }
}
