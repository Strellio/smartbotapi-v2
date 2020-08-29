'use strict'
import mongoose from 'mongoose'
import schema from './schema'
import BaseModel from '../common/base-model'
import { required } from '../../lib/utils'
import { Customer } from './types'
const Model = mongoose.model('customers', schema)
const CustomerModel = BaseModel(Model)


const FIELDS_TO_POPULATE = ["source"]

const createOrUpdate = ({ update = required("data"), query = required("query") }: {
    update: any
    query: any
}): Promise<Customer> => CustomerModel.upsert({ query, update, populate: FIELDS_TO_POPULATE })

const fetchByBusinessId = ({ businessId = required("businessId"), cursor, limit }: {
    businessId: string
    cursor: string,
    limit: string
}) => CustomerModel.paginate({
    query: {
        business: businessId
    },
    after: cursor,
    limit,
    populate: FIELDS_TO_POPULATE
})

export default function customerModel() {
    return {
        createOrUpdate,
        fetchByBusinessId
    }
} 
