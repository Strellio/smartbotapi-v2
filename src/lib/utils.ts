'use strict'
import { curry, reject } from 'lodash/fp'
import { Schema } from 'joi'
import moment from 'moment'
import crypto from 'crypto'
import jsonWebToken from 'jsonwebtoken'
import errors from './errors'
import config from '../config'


export const generateJwt = (payload: any, expiresIn = "10days")=>{
  return jsonWebToken.sign(payload, config.get("APP_KEY") as any, {
    expiresIn,
    algorithm: "HS512"
  })
}

export const decodeJwt = (token: string  =require("token"))=>{
return  new Promise((resolve, reject)=>{
  jsonWebToken.verify(token, config.get("APP_KEY") as any, (err:any, decoded:any)=>{    
    if(err) return reject(err)
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
  data
}: {
  secret: string
  data: string
}) =>
  crypto
    .createHmac('sha256', secret)
    .update(Buffer.from(data) as any, 'utf8')
    .digest('hex')
