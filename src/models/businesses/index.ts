'use strict'
import mongoose from 'mongoose'
import schema from './schema'
import BaseModel from '../common/base-model'
import { required } from '../../lib/utils'
import { Business } from './types'
const Model = mongoose.model('businesses', schema)
const BusinessBaseModel = BaseModel(Model)

const POPULATE = ["plan", "chat_platforms"]

const getByEmail = (email: string = required('email')): Promise<Business> =>
  BusinessBaseModel.ensureExists({
    email
  })

const getByExternalPlatformDomain = (
  externalPlatformDomain: string = required('domain')
): Promise<Business> =>
  BusinessBaseModel.get({
    query: {
      'shop.external_platform_domain': externalPlatformDomain
    },
    populate: POPULATE
  })

const getById = (id: string = required('id')): Promise<Business> =>
  BusinessBaseModel.ensureExists({
    _id: id
  }, POPULATE)

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
