'use strict'
import joi from 'joi'

export default joi.object({
  email: joi
    .string()
    .email()
    .required(),
  full_name: joi.string().required(),
  country: joi.string().required(),
  password: joi.string(),
  profile_url:joi.string()
})
