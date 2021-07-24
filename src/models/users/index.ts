'use strict'
import mongoose from 'mongoose'
import schema from './schema'
import BaseModel from '../common/base-model'
import { required } from '../../lib/utils'
import { User } from './types'

const Model = mongoose.model('users', schema)
const UserModel = BaseModel(Model)

const commonPopulate = ['businesses']

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
  UserModel.ensureExists(
    {
      email
    },
    commonPopulate
  )

const getById = (id: string = required('id')): Promise<User> =>
  UserModel.ensureExists(
    {
      _id: id
    },
    commonPopulate
  )

const countByBusinessId = (
  businessId: string = required('businessId'),
  extraQuery = {}
) => UserModel.count({ business_id: businessId, ...extraQuery })

export default () => ({
  ...UserModel,
  countByBusinessId,
  createOrUpdateByEmail,
  getByEmail,
  getById
})
