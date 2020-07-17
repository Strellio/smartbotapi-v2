'use strict'
import shopifyService from '../../services/external-platforms/shopify'
import { Response, Request, NextFunction } from 'express'

export const shopifyAuthInstall = (req: Request, res: Response) =>
  res.redirect(shopifyService().auth.install(req.query))

export const shopifyAuthCallback = (
  req: Request,
  res: Response,
  next: NextFunction
) =>
  shopifyService()
    .auth.callback(req.query as any)
    .then(redirectUrl => res.redirect(redirectUrl))
    .catch(next)
