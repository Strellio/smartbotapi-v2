'use strict'
import mongoose from 'mongoose'
import schema from './schema'
import BaseModel from '../common/base-model'
const Model = mongoose.model('businesses', schema)
const BusinessModel = BaseModel(Model)

export default BusinessModel
