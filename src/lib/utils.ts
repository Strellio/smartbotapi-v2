'use strict'
import { curry, reject } from 'lodash/fp'
import { Schema } from 'joi'
import moment from 'moment'
import crypto from 'crypto'
import jsonWebToken, { Algorithm } from 'jsonwebtoken'
import errors from './errors'
import config from '../config'


export const generateJwt = (payload: any, expiresIn = "10days", algorithm: Algorithm = "HS512") => {
  return jsonWebToken.sign(payload, config.get("APP_KEY") as any, {
    expiresIn,
    algorithm
  })
}


export const decodeJwt = (token: string = require("token")) => {
  return new Promise((resolve, reject) => {
    jsonWebToken.verify(token, config.get("APP_KEY") as any, (err: any, decoded: any) => {
      if (err) return reject(err)
      resolve(decoded)
    })
  })
}

export const required = (data: any) => {
  throw errors.throwError({
    name: errors.MissingFunctionParamError,
    message: `${data} is required`
  })
}

export const convertBufferToObject = (buffer: any) => {
  try {
    return JSON.parse(buffer.toString())
  } catch (error) {
    return null
  }
}

export const validate = curry((schema: Schema, data: any) => {
  const { error, value } = schema.validate(data, { stripUnknown: true })
  if (error) {
    throw errors.throwError({
      name: errors.ValidationError,
      message: error.message
    })
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

export const parseString = (str: string) => {
  try {
    return JSON.parse(str)
  } catch (error) {
    return str
  }
}

export const createHmac = ({
  secret,
  data,
  algorithm = "sha256"
}: {
  secret: string
  data: string
  algorithm?: string
}) =>
  crypto
    .createHmac(algorithm, secret)
    .update(Buffer.from(data) as any, 'utf8')
    .digest('hex')



export const convertObjectToDotNotation = (queryKey: string, queryObject: any, operator = ".$") => Object.keys(queryObject).reduce((acc: {
  [x: string]: any
}, key) => {
  const value = queryObject[key]
  acc[`${queryKey}${operator}.${key}`] = value
  return acc
}, {})