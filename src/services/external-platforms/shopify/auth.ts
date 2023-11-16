"use strict";
import { NextFunction, Request, Response } from "express";

import shopifyLib from "../../../lib/shopify";
import { required, validate, generateJwt } from "../../../lib/utils";
import businessService from "../../businesses";
import schema from "./schema";
import { STATUS_MAP } from "../../../models/common";
import config from "../../../config";
import { PLATFORM_MAP } from "../../../models/businesses/schema/enums";
import { User } from "../../../models/users/types";
import { DeliveryMethod, PubSubWebhookHandler } from "@shopify/shopify-api";
import logger from "../../../lib/logger";
import knowlegeBase from "../../knowlege-base";
import queues from "../../../lib/queues";

export const install = (req: Request, res: Response, next: NextFunction) => {
  try {
    return shopifyLib.auth.begin({
      shop: shopifyLib.utils.sanitizeShop(
        req.query.shop as never,
        true
      ) as string,
      callbackPath: `/shopify/callback`,
      isOnline: false,
      rawRequest: req,
      rawResponse: res,
    });
  } catch (error) {
    next(error);
  }
};

const getWidgetCode = (businessId: string) => {
  return `${config.APP_URL}/static/js/wl.js?token=${generateJwt(
    { business_id: businessId },
    "1year",
    "HS256"
  )}`;
};

// export async function callback(params: CallbackParams): Promise<string> {
export const callback = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = validate(schema, req.query);

    const response = await shopifyLib
      .getAccessToken(payload.shop, payload.code)
      .catch((err) => {
        logger().error(err);
      });

    if (!response) {
      return;
    }

    const shopifyClient = shopifyLib.api({
      platformDomain: response.shop,
      accessToken: response.accessToken as string,
    });

    // const shop = await client.shop.get()

    // const payload = validate(schema, params);
    // const { access_token }: any = await shopifyLib().shopifyToken.getAccessToken(
    //   payload.shop,
    //   payload.code
    // );
    // const shopifyClient = shopifyLib().shopifyClient({
    //   shop: payload.shop,
    //   accessToken: access_token,
    // });
    const shopDetails = await shopifyClient.shop.get();

    const createBusinessPayload = {
      status: STATUS_MAP.ACTIVE,
      domain: `https://${shopDetails.domain}`,
      email: shopDetails.email,
      phone_number: shopDetails.phone,
      shop: {
        external_platform_domain: `https://${shopDetails.myshopify_domain}`,
        external_created_at: shopDetails.created_at,
        money_format: shopDetails.money_format,
        external_access_token: response.accessToken,
      },
      external_id: String(shopDetails.id),
      business_name: shopDetails.name,
      location: {
        country: shopDetails.country_name,
        city: shopDetails.city,
      },
      platform: PLATFORM_MAP.SHOPIFY,
      full_name: `Admin`,
    };

    let business = await businessService().getByExternalPlatformDomain(
      createBusinessPayload.shop.external_platform_domain
    );

    if (!business) {
      business = await businessService().create(createBusinessPayload);
      const shopifyPolicyMap = {
        "contact-information": "contacts",
        "privacy-policy": "privacy_policy",
        "terms-of-service": "terms_of_service",
        "refund-policy": "return_refund_policy",
        "shipping-policy": "shipping_policy",
      };

      const policies = await shopifyClient.policy.list();
      if (policies.length > 0) {
        const policiesMap = policies.reduce((acc: any, policy: any) => {
          acc[shopifyPolicyMap[policy.handle]] = policy.body;
          return acc;
        }, {});

        const knowlegeBaseRes = await knowlegeBase.createOrUpdateKnowlegeBase({
          ...policiesMap,
          businessId: business.id,
        });

        const knowlegeBaseUpdateQueue = queues.knowledgeBaseUpdateQueue();

        knowlegeBaseUpdateQueue.add({
          data: { business, knowlegeBase: knowlegeBaseRes },
          jobId: knowlegeBaseRes.id,
        });
      }
    } else {
      business = await businessService().updateById({
        id: business.id,
        ...createBusinessPayload,
      });
    }

    await shopifyClient.scriptTag.list().then(async (scriptTags) => {
      await Promise.all(
        scriptTags.map(async (scriptTag) => {
          if (scriptTag.src.includes(`static/js/wl.js`)) {
            await shopifyClient.scriptTag.delete(scriptTag.id);
          }
        })
      );
    });

    await shopifyClient.scriptTag
      .create({
        src: getWidgetCode(business.id),
        event: "onload",
      })
      .catch((err) => {
        console.log(err.response.body.errors);
      });

    try {
      const pubsubHandler: PubSubWebhookHandler = {
        deliveryMethod: DeliveryMethod.PubSub,
        pubSubProject: config.GOOGLE_CLOUD_PROJECT,
        pubSubTopic: config.SHOPIFY_GOOGLE_PUB_SUB_TOPIC,
      };

      shopifyLib.webhooks.addHandlers({
        ORDERS_CREATE: [pubsubHandler],
        ORDERS_UPDATED: [pubsubHandler],
        ORDERS_DELETE: [pubsubHandler],
        PRODUCTS_CREATE: [pubsubHandler],
        PRODUCTS_UPDATE: [pubsubHandler],
        PRODUCTS_DELETE: [pubsubHandler],
        APP_UNINSTALLED: [pubsubHandler],
      });
      const result = await shopifyLib.webhooks.register({
        session: {
          shop: response.shop,
          accessToken: response.accessToken,
          ...req.query,
        } as any,
      });

      logger().info("done registering webhooks ");
      logger().info(result);
    } catch (error) {
      console.log("error registering webhooks", error);
      logger().error(error);
    }

    const redirectUrl = `${config.DASHBOARD_URL}/auth/token?token=${generateJwt(
      {
        business_id: business.id,
        user_id: business.user.toString(),
      }
    )}&business_id=${business.id}&user_id=${business.user.toString()}` as any;

    res.redirect(redirectUrl);
  } catch (error) {
    // logger().error(error);

    console.log("Error in shopify callback", error.message);
    console.log(error);
    next(error);
  }
};
