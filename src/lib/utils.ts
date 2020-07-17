'use strict'
import { curry } from 'lodash/fp'
import joiLib, { Schema } from 'joi'
import errors from './errors'

export const required = (data: any) => {
  throw errors.throwError({
    name: errors.MissingFunctionParamError,
    message: `${data} is required`
  })
}

export const validate = curry((schema: Schema, data: any) => {
  const { error, value } = schema.validate(data, { stripUnknown: true })
  if (error) {
    throw error
  }
  return value
})
