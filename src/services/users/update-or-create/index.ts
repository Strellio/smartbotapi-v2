'use strict'

import { validate } from '../../../lib/utils'
import schema from './schema'
import userModel from '../../../models/users'
import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet("11234567890", 16)

import {uploadToCloudStorage, isDataUrl, GOOGLE_STORAGE_URL} from "../../../lib/google"
import config from '../../../config'
import { uploadProfile } from '../create'

export interface UserParams {
  email: string
  country?: string
  full_name?: string
  profile_url?: string

}

export default async function updateOrCreate (params: UserParams) {
  validate(schema, params)
  const profileUrl = await uploadProfile(params)

  if (profileUrl) {
    params.profile_url = profileUrl

  }
  return userModel().createOrUpdateByEmail(params.email, params)
}
