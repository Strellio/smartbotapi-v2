'use strict'
import mongoose from 'mongoose'
import schema from './schema'
import BaseModel from '../common/base-model'
const Model = mongoose.model('customers', schema)
const CustomerModel = BaseModel(Model)

export default CustomerModel
