'use strict'
import mongoose from 'mongoose'
import schema from './schema'
import BaseModel from '../common/base-model'
import { required } from '../../lib/utils'
import { Customer } from './types'
const Model = mongoose.model('customers', schema)
const CustomerModel = BaseModel(Model)

const FIELDS_TO_POPULATE = ['source']

const createOrUpdate = ({
  update = required('data'),
  query = required('query')
}: {
  update: any
  query: any
}): Promise<Customer> =>
  CustomerModel.upsert({ query, update, populate: FIELDS_TO_POPULATE })

const fetchByBusinessId = ({
  businessId = required('businessId'),
  cursor,
  limit,
  name
}: {
  businessId: string
  cursor: string
  limit: string
  name?: string
}) =>
  CustomerModel.paginate({
    query: {
      business: businessId,
      ...(name ? { name: new RegExp(name, 'ig') } : {})
    },
    after: cursor,
    limit,
    populate: FIELDS_TO_POPULATE
  })

const getById = (id: string = required('id')): Promise<Customer> =>
  CustomerModel.ensureExists({ _id: id }, FIELDS_TO_POPULATE)

const countByBusinessId = (
  businessId: string = required('businessId'),
  extraQuery = {}
) => CustomerModel.count({ business: businessId, ...extraQuery })

export default function customerModel () {
  return {
    countByBusinessId,
    createOrUpdate,
    fetchByBusinessId,
    ensureExists: CustomerModel.ensureExists,
    getById
  }
}
