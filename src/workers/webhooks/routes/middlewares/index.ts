'use strict'
import { Request, Response, NextFunction } from 'express'
import { createHmac } from '../../../../lib/utils'
import errors from '../../../../lib/errors'
import { get } from 'lodash/fp'
import isAuthenticated from '../../../../api/middlewares/is-authenticated'

export const verifyWebhook = ({
  path,
  secret,
  hasSplit = false
}: {
  path: string
  secret: string
  hasSplit: boolean
}) => (req: Request, res: Response, next: NextFunction) => {
  const hubSignature: string = get(path, req) || ''
  const [algorithm, signature] = hubSignature.split('=')
  const hmacFromHeader = hasSplit ? signature : hubSignature
  const hmacAlgorithm = -hasSplit ? algorithm : 'sha1'
  try {
    const hmac = createHmac({
      secret,
      data: JSON.stringify(req.body),
      algorithm: hmacAlgorithm
    })
    if (hmac !== hmacFromHeader) {
      throw errors.throwError({
        name: errors.WebhookValidationFailed,
        message: 'invalid signature'
      })
    }
    next()
  } catch (error) {
    res.status(403).json({
      message: error.message,
      name: error.name,
      time_thrown: error.time_thrown
    })
  }
}

export const isAuthenticatedMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1]
  return isAuthenticated(token)
    .then(({ business }) => {
      req.body.business_id = business.id
      next()
    })
    .catch(error =>
      res.status(400).json({
        error
      })
    )
}
