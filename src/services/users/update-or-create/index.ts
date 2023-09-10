'use strict'

import { validate } from '../../../lib/utils'
import schema from './schema'
import userModel from '../../../models/users'
import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet("11234567890", 16)

import {uploadToCloudStorage, isDataUrl, GOOGLE_STORAGE_URL} from "../../../lib/google"
import config from '../../../config'

export interface UserParams {
  email: string
  country?: string
  full_name?: string
  profile_url?: string

}

export default async function updateOrCreate (params: UserParams) {
  validate(schema, params)
  if (params.profile_url && isDataUrl(params.profile_url)) {

    const imageKey = `${params.full_name.replace(" ", "-")}-${nanoid()}`

    const result = await uploadToCloudStorage({
      url: params.profile_url,
      bucket: config.IMAGES_BUCKET_NAME,
      folderName: 'profile-pics',
      key:imageKey
        
    });
    
    const profileUrl = `${GOOGLE_STORAGE_URL}/${config.IMAGES_BUCKET_NAME}/profile-pics/${imageKey}.${result.type}`
    params.profile_url = profileUrl
  }
  return userModel().createOrUpdateByEmail(params.email, params)
}
