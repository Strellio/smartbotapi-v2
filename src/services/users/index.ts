'use strict'
import updateOrCreate from './update-or-create'
import userModel from '../../models/users'

export default function () {
  return {
    updateOrCreate,
    getById: userModel().getById,
    getByEmail: userModel().getByEmail
  }
}
