'use strict'
import joi from 'joi'
import { STATUS_MAP } from '../../../models/common'
const status_map = Object.values(STATUS_MAP)

export default joi.object({
  id: joi.string(),
  status: joi.string().valid(status_map),
  plan_id: joi.string(),
  business_name: joi.string(),
  external_created_at: joi.date(),
  external_updated_at: joi.date(),
  external_access_token: joi.string(),
  external_refresh_token: joi.string(),
  currency: joi.string(),
  external_platform_secret: joi.string(),
  external_platform_client: joi.string()
})
