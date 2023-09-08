'use strict'

import { validate } from '../../../lib/utils'
import schema from './schema'
import userModel from '../../../models/users'

export interface UserParams {
  email: string
  profile_url: string
  country: string
  full_name: string
  password: string
}

export default function createUser (params: UserParams) {
  validate(schema, params)
  return userModel().create({ data: params })
}
