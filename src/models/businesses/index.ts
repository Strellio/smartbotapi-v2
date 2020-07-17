'use strict'
import mongoose from 'mongoose'
import schema from './schema'
import BaseModel from '../common/base-model'
import { required } from '../../lib/utils'
import { Business } from './types'
const Model = mongoose.model('businesses', schema)
const BusinessBaseModel = BaseModel(Model)

const getByEmail = (email: string = required('email')): Promise<Business> =>
  BusinessBaseModel.ensureExists({
    email
  })

const getByExternalPlatformDomain = (
  domain: string = required('domain')
): Promise<Business> =>
  BusinessBaseModel.ensureExists({
    domain
  })

const getById = (email: string = required('email')): Promise<Business> =>
  BusinessBaseModel.ensureExists({
    email
  })

const updateById = (
  id: string = required('id'),
  update: object = required('update')
): Promise<Business> =>
  BusinessBaseModel.updateOne({
    query: {
      _id: id
    },
    update
  })

export default () => ({
  ...BusinessBaseModel,
  getByEmail,
  getById,
  getByExternalPlatformDomain,
  updateById
})
