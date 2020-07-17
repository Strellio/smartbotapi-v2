'use strict'

import joi from 'joi'

export default joi.object({
  name: joi.string().required(),
  display_name: joi.string().required(),
  price: joi.number().min(0),
  features: joi.object().unknown()
})
