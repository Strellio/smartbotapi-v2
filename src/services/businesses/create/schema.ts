'use strict'
import joi from 'joi'
import { STATUS_MAP } from '../../../models/common'
import { PLATFORM_MAP } from '../../../models/businesses/schema/enums'
const status_map = Object.values(STATUS_MAP)
const platform_map = Object.values(PLATFORM_MAP)

export default joi.object({
  domain: joi
    .string()
    .uri()
    .required(),
  email: joi
    .string()
    .email()
    .required(),
  status: joi
    .string()
    .valid(status_map)
    .required(),
  external_id: joi.string().required(),
  platform: joi
    .string()
    .valid(platform_map)
    .required(),
  // plan_id: joi
  //   .string()
  //   .uuid()
  //   .required(),
  business_name: joi.string().required(),
  external_created_at: joi.date(),
  external_updated_at: joi.date(),
  external_platform_domain: joi
    .string()
    .uri()
    .required(),
  external_access_token: joi
    .string()
    .when('platform', { is: PLATFORM_MAP.SHOPIFY, then: joi.required() }),
  external_refresh_token: joi.string(),
  currency: joi.string(),
  external_platform_secret: joi
    .string()
    .when('platform', { is: PLATFORM_MAP.WORDPRESS, then: joi.required() }),
  external_platform_client: joi
    .string()
    .when('platform', { is: PLATFORM_MAP.WORDPRESS, then: joi.required() }),
  full_name: joi.string(),
  country: joi.string()
})
