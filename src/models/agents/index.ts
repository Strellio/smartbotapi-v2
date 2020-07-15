'use strict'
import mongoose from 'mongoose'
import schema from './schema'
import BaseModel from '../common/base-model'
const Model = mongoose.model('agents', schema)
const AgentModel = BaseModel(Model)

export default AgentModel
