"use strict";
import BusinessModel from "../../../models/businesses";
import { Business } from "../../../models/businesses/types";
export default async function deleteBusiness(
  externalPlatformDomain: string
): Promise<Business> {
  const business = await BusinessModel().updateOne({
    query: { "shop.external_platform_domain": externalPlatformDomain },
    update: {
      is_deleted: true,
      $unset: {
        plan: "",
        account_name: "",
        "shop.external_platform_domain": "",
        "shop.external_access_token": "",
        "shop.external_refresh_token": "",
        "shop.external_platform_secret": "",
        "shop.external_platform_client": "",
      },
    },
  });

  return business;
}
