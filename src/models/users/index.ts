'use strict'
import mongoose from 'mongoose'
import schema from './schema'
import BaseModel from '../common/base-model'
import { required } from '../../lib/utils'
import { User } from './types'

const Model = mongoose.model('users', schema)
const UserModel = BaseModel(Model)

/**
 * Update or create by email
 */
const createOrUpdateByEmail = (
  email: string = required('email'),
  payload: any = {}
): Promise<User> =>
  UserModel.upsert({
    query: { email },
    update: payload
  })

const getByEmail = (email: string = required('email')): Promise<User> =>
  UserModel.ensureExists({
    email
  })

const getById = (email: string = required('email')): Promise<User> =>
  UserModel.ensureExists({
    email
  })

export default () => ({
  ...UserModel,
  createOrUpdateByEmail,
  getByEmail,
  getById
})
