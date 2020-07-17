'use strict'

import { validate } from '../../../lib/utils'
import schema from './schema'
import userModel from '../../../models/users'

export interface UserParams {
  email: string
  country?: string
  full_name?: string
}

export default function updateOrCreate (params: UserParams) {
  validate(schema, params)
  return userModel().createOrUpdateByEmail(params.email, params)
}
