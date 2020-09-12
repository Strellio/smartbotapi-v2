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
const update = (_id: string = required("id"), business: string = required("business"), data: any = required("data")) => AgentModel.updateOne({ query: { _id, business }, update: data, populate: ["linked_chat_agents"] })
const listByBusinessId = (businessId = required("businessId")) => AgentModel.fetch({
    query: {
        business: businessId
    },
    populate: [{ path: 'linked_chat_agents_platforms', select: "agents platform" }]
})

const getById = (_id: string = required("id")) => AgentModel.get({ query: { _id }, populate: [{ path: 'linked_chat_agents_platforms', select: "agents platform" }] })

export default {
    create,
    listByBusinessId,
    update,
    getById
}
