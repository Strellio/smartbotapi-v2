'use strict'
import joi from 'joi'

export default joi.object({
  code: joi.string().required(),
  hmac: joi.string().required(),
  shop: joi.string().required(),
  time: joi.string()
})
