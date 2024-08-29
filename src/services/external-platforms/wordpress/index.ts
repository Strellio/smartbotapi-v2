"use strict";

import { da } from "date-fns/locale";
import { required } from "../../../lib/utils";
import { PLATFORM_MAP } from "../../../models/businesses/schema/enums";
import businessService from "../../businesses";
import { STATUS_MAP } from "../../../models/common";
import getSymbolFromCurrency from "currency-symbol-map";
import registerWebhooks from "./register-webhooks";

const checkDomainStatus = async ({ domain = required("domain") }) => {
  console.log("checkDomainStatus", domain);
  const store = await businessService().getByExternalPlatformDomain(domain);

  if (!store) {
    return { success: false };
  }

  return { success: true };
};

const install = async (data: any = required("data")) => {
  console.log("installStore", data);
  if (!data.domain) {
    throw new Error("domain is required");
  }

  return { success: true, ...data };
};

const callback = async (data: any = required("data")) => {
  console.log("installStore", data);
  if (!data.domain) {
    throw new Error("domain is required");
  }

  const createBusinessPayload = {
    status: STATUS_MAP.ACTIVE,
    domain: data.domain,
    email: data.customer_email,
    shop: {
      external_platform_domain: data.domain,
      money_format: `${getSymbolFromCurrency(data.currency)} {{amount}}`,
      external_platform_client: data.woocommerce_client,
      external_platform_secret: data.woocommerce_secret,
    },
    business_name: data.store_name,
    platform: PLATFORM_MAP.WORDPRESS,
    full_name: `Admin`,
  };

  let business = await businessService().getByExternalPlatformDomain(
    createBusinessPayload.shop.external_platform_domain
  );

  if (!business) {
    console.log("createBusinessPayload", createBusinessPayload);
    business = await businessService().create(createBusinessPayload);
  } else {
    business = await businessService().updateById({
      id: business.id,
      ...createBusinessPayload,
    });
  }

  await registerWebhooks({
    domain: data.domain,
    consumerKey: data.woocommerce_client,
    consumerSecret: data.woocommerce_secret,
  });

  return { success: true };
};

export default function shopifyService() {
  return {
    checkDomainStatus,
    install,
    callback,
  };
}
