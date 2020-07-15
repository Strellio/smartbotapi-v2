'use strict'
import mongoose from 'mongoose'
import schema from './schema'
import BaseModel from '../common/base-model'
const Model = mongoose.model('email_analytics', schema)
const EmailAnalyticsModel = BaseModel(Model)

export default EmailAnalyticsModel
