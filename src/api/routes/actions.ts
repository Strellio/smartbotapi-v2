"use strict";
import shopifyService from "../../services/external-platforms/shopify";
import { Response, Request, NextFunction } from "express";
import { addCallback } from "../../services/chat-platforms/platforms/intercom";
import activateCharge from "../../services/plans/activate-charge";
import planModel from "../../models/plans";
import PLANS from "../../models/plans/seeds";

export const shopifyAuthInstall = (req: Request, res: Response) =>
  res.redirect(shopifyService().auth.install(req.query));

export const shopifyAuthCallback = (
  req: Request,
  res: Response,
  next: NextFunction
) =>
  shopifyService()
    .auth.callback(req.query as any)
    .then((redirectUrl) => res.redirect(redirectUrl))
    .catch(next);

export const intercomAuthCallback = (
  req: Request,
  res: Response,
  next: NextFunction
) =>
  addCallback(req.query.state as any, req.query?.code as any)
    .then((redirectUrl) => res.redirect(redirectUrl))
    .catch(next);

export const activePlatformCharge = (
  req: Request,
  res: Response,
  next: NextFunction
) =>
  activateCharge(req.query as any)
    .then((redirectUrl) => res.redirect(redirectUrl))
    .catch(next);

export const insertSeeds = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await Promise.all(
    PLANS.map(
      async (plan) =>
        await planModel().upsert({ query: { name: plan.name }, update: plan })
    )
  );
  return res.sendStatus(200);
};
