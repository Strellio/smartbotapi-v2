'use strict'
import updateById from './update-by-id'
import create from './create'
import businessModel from '../../models/businesses'

export default function businessService () {
  return {
    create,
    updateById,
    getByEmail: businessModel().getByEmail,
    getByExternalPlatformDomain: businessModel().getByExternalPlatformDomain,
    getById: businessModel().getById
  }
}
