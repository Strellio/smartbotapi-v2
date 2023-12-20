"use strict";
import { Request, Response, NextFunction } from "express";
import { createHmac } from "../../../../lib/utils";
import errors from "../../../../lib/errors";
import { get } from "lodash/fp";
import isAuthenticated from "../../../../api/middlewares/is-authenticated";
import config from "../../../../config";
import crypto from "crypto";

export function validateShopifyHmac(
  req: any,
  res: Response,
  next: NextFunction
) {
  try {
    console.log("validateShopifyHmac", req.rawBody);
    const calculatedHmac = crypto
      .createHmac("SHA256", config.SHOPIFY_APP_SECRET)
      .update(req.rawBody, "utf8")
      .digest("base64");

    const shopifyHmac = req.headers["x-shopify-hmac-sha256"];
    if (calculatedHmac !== shopifyHmac) {
      console.log("Invalid signature");
      throw new Error("Invalid signature");
    }

    req.shop = req.headers["x-shopify-shop-domain"];

    console.log("valid signature ", req.shop);

    next();
  } catch (error) {
    console.log(error);
    res.status(403).json({
      message: error.message,
      name: error.name,
      time_thrown: error.time_thrown,
    });
  }
}

export const verifyWebhook =
  ({
    path,
    secret,
    hasSplit = false,
  }: {
    path: string;
    secret: string;
    hasSplit: boolean;
  }) =>
  (req: Request, res: Response, next: NextFunction) => {
    const hubSignature: string = get(path, req) || "";
    const [algorithm, signature] = hubSignature.split("=");
    const hmacFromHeader = hasSplit ? signature : hubSignature;
    const hmacAlgorithm = -hasSplit ? algorithm : "sha1";
    try {
      const hmac = createHmac({
        secret,
        data: JSON.stringify(req.body),
        algorithm: hmacAlgorithm,
      });
      if (hmac !== hmacFromHeader) {
        throw errors.throwError({
          name: errors.WebhookValidationFailed,
          message: "invalid signature",
        });
      }
      next();
    } catch (error) {
      res.status(403).json({
        message: error.message,
        name: error.name,
        time_thrown: error.time_thrown,
      });
    }
  };

export const isAuthenticatedMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  return isAuthenticated(token)
    .then(({ business }) => {
      req.body.business_id = business.id;
      next();
    })
    .catch((error) =>
      res.status(400).json({
        error,
      })
    );
};
