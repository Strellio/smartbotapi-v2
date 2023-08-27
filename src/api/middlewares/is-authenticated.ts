'use strict'
import { required, decodeJwt } from '../../lib/utils'
import customError from '../../lib/errors/custom-error'
import businessService from '../../services/businesses'
import businesses from '../../models/businesses'

const throwAuthError = () =>
  customError({
    name: 'UnAuthenticatedError',
    message: 'you are not authorized to access this resource'
  })

export default async function isAuthenticated (
  token: string = required('token'),
  req: object = {}
) {
  try {
    const decoded: any = await decodeJwt(token)

    return {
      business: await businessService().getById(decoded.business_id),
      ...req
    }

  } catch (error) {
    console.log(error)
    throw throwAuthError()
  }
}
