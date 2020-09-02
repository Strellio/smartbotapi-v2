'use strict'
import mongoose from 'mongoose'
import schema from './schema'
import BaseModel from '../common/base-model'
import { required } from '../../lib/utils'
const Model = mongoose.model('agents', schema)
const AgentModel = BaseModel(Model)

const create = (data: any = required("data")) => AgentModel.create({
    data
})
const listByBusinessId = (businessId = required("businessId")) => AgentModel.fetch({
    query: {
        business: businessId
    }
})

export default {
    create,
    listByBusinessId
}
