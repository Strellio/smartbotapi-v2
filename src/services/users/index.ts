'use strict'
import updateOrCreate from './update-or-create'
import userModel from '../../models/users'
import createUser from './create'

export default function () {
  return {
    updateOrCreate,
    getById: userModel().getById,
    getByEmail: userModel().getByEmail,
    createUser
  }
}
