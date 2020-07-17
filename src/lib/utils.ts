'use strict'
import { curry } from 'lodash/fp'
import joi from 'joi'
import errors from './errors'

export const required = (data: any) => {
  throw errors.throwError({
    name: errors.MissingFunctionParamError,
    message: `${data} is required`
  })
}

export const validate = curry((schema: any, data: any) => {
  const { error } = joi.validate(data, schema)
  if (error) {
    throw error
  }
  return data
})
