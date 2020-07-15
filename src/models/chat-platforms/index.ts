'use strict'
import mongoose from 'mongoose'
import schema from './schema'
import BaseModel from '../common/base-model'
const Model = mongoose.model('chat_platforms', schema)
const ChatPlatformModel = BaseModel(Model)

export default ChatPlatformModel
