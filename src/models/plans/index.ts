'use strict'
import mongoose from 'mongoose'
import schema from './schema'
import BaseModel from '../common/base-model'
import { required } from '../../lib/utils'

const Model = mongoose.model('plans', schema)
const PlanBaseModel = BaseModel(Model)

function getAll() {
  return PlanBaseModel.fetch({ query: {}, populate: [] })
}

function getById(id: string = required('id')) {
  return PlanBaseModel.ensureExists({ _id: id })
}

function updateOrCreateByName(
  name: string = required('name'),
  update: object = required('update')
) {
  return PlanBaseModel.upsert({
    query: {
      name
    },
    update
  })
}

export default function () {
  return {
    ...PlanBaseModel,
    getAll,
    getById,
    updateOrCreateByName
  }
}
