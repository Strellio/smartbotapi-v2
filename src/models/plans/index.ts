'use strict'
import mongoose from 'mongoose'
import schema from './schema'
import BaseModel from '../common/base-model'
const Model = mongoose.model('plans', schema)
const PlanBaseModel = BaseModel(Model)

function getAll () {
  return PlanBaseModel.fetch({ query: {}, populate: [], lean: true })
}

export default {
  ...PlanBaseModel,
  getAll
}
