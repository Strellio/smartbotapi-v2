"use strict";
import shopifyService from "../../services/external-platforms/shopify";
import { Response, Request, NextFunction } from "express";
import { addCallback } from "../../services/chat-platforms/platforms/intercom";
import activateCharge from "../../services/plans/activate-charge";
import planModel from "../../models/plans";
import PLANS from "../../models/plans/seeds";
import wordpressService from "../../services/external-platforms/wordpress";

export const shopifyAuthInstall = shopifyService().auth.install;

export const shopifyAuthCallback = shopifyService().auth.callback;

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
      async (plan) => await planModel().updateOrCreateByName(plan.name, plan)
    )
  );
  return res.sendStatus(200);
};

export const checkWordpressStatus = (
  req: Request,
  res: Response,
  next: NextFunction
) =>
  wordpressService()
    .checkDomainStatus(req.query)
    .then((result) => {
      res.json(result);
    })
    .catch(next);

export const wordpressInstall = (
  req: Request,
  res: Response,
  next: NextFunction
) =>
  wordpressService()
    .install(req.body)
    .then((result) => res.json(result))
    .catch(next);

export const wordpressCallback = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("wordpressCallback", req.body, req.query);
  const transformBody = {
    woocommerce_secret: req.body.consumer_secret,
    woocommerce_client: req.body.consumer_key,
    external_id: req.body.key_id,
    domain: req.body.user_id,
    ...req.query,
  };

  return wordpressService()
    .callback(transformBody)
    .then((result) => res.json(result))
    .catch(next);
};
