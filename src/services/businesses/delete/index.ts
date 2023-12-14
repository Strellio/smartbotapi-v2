"use strict";
import BusinessModel from "../../../models/businesses";
import { Business } from "../../../models/businesses/types";
import { STATUS_MAP } from "../../../models/common";
export default async function deleteBusiness(
  businessId: string
): Promise<Business> {
  const business = await BusinessModel().updateById(businessId, {
    status: STATUS_MAP.DEACTIVATED,
    // is_deleted: true,
    $unset: {
      plan: "",
      // domain: "",
      // account_name: "",
      // "shop.external_platform_domain": "",
      // "shop.external_access_token": "",
      // "shop.external_refresh_token": "",
      // "shop.external_platform_secret": "",
      // "shop.external_platform_client": "",
    },
  });

  return business;
}
