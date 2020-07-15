'use strict'
import mongoose from 'mongoose'
import schema from './schema'
import BaseModel from '../common/base-model'
const Model = mongoose.model('users', schema)
const UserModel = BaseModel(Model)

export default UserModel
