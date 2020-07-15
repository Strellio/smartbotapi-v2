'use strict'
import mongoose from 'mongoose'
import schema from './schema'
import BaseModel from '../common/base-model'
const Model = mongoose.model('messages', schema)
const MessageModel = BaseModel(Model)

export default MessageModel
