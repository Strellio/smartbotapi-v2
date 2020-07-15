'use strict'
import mongoose from 'mongoose'
import schema from './schema'
import BaseModel from '../common/base-model'
const Model = mongoose.model('plans', schema)
const PlanModel = BaseModel(Model)

export default PlanModel
