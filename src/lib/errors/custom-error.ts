'use strict'
import { createError } from 'apollo-errors'
import { required } from '../utils'

export default function customError ({
  name = required('name'),
  message = required('message'),
  data = {}
}: {
  name: string
  message: string
  data?: object
}) {
  const CustomError = createError(name, {
    message
  })

  return new CustomError(data)
}
