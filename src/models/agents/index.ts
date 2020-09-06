'use strict'
import mongoose from 'mongoose'
import schema from './schema'
import BaseModel from '../common/base-model'
import { required } from '../../lib/utils'
import chatASchema from "../chat-platforms/schema/agents"
const chatAModel = mongoose.model("chat_platforms.agents", chatASchema)
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
    populate: ["linked_chat_agents_obj"]
})

export default {
    create,
    listByBusinessId,
    update
}
