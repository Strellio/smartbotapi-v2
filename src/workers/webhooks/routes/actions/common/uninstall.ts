"use strict";

import businessService from "../../../../../services/businesses";
import deleteAllBusinessChatPlatforms from "../../../../../services/chat-platforms/delete-business-chat-platforms";

// const {
//   getAndPopulateSettingsByDomain,
//   updateShop,
//   updateSettings,
// } = require("../../../service/b");
// const { cancelOldSubscription } = require("../../../service/payments");

const cancelCharge = (settings) => {
  if (settings.shop_id.platform === "wordpress") {
    if (settings.shop_id.charge_id) {
      //   return cancelOldSubscription(settings.shop_id.charge_id);
    }
  }
};

export default async function uninstall(domain: string) {
  console.log("uninstall", domain);
  const business = await businessService().getByExternalPlatformDomain(domain);

  if (!business) return;

  await businessService().delete(business.id);

  await deleteAllBusinessChatPlatforms(business.id);
  return;
}
