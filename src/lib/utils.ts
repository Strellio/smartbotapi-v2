'use strict'
import { curry } from 'lodash/fp'
import { Schema } from 'joi'
import errors from './errors'
import moment from 'moment'
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

export const calculateTrialDays = (bonusDays: number, date?: Date) => {
  if (!date) {
    return {
      date: moment(new Date())
        .add('days', bonusDays)
        .toDate(),
      days: 30
    }
  }
  const isAfter = moment(date).diff(new Date(), 'days')
  const days = isAfter > 0 ? isAfter : 0

  return { date, days }
}
