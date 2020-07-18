'use strict'
import joi from 'joi'

export default joi.object({
  email: joi
    .string()
    .email()
    .required(),
  full_name: joi.string(),
  country: joi.string()
})
