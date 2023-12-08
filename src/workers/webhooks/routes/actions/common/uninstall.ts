"use strict";

import deleteBusiness from "../../../../../services/businesses/delete";
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

/**
 *
 * @returns {Promise}
 */
export default async function uninstall(domain) {
  const business = await deleteBusiness(domain);

  await deleteAllBusinessChatPlatforms(business.id);
}
