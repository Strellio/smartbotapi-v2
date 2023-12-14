"use strict";
import errors from "../../../lib/errors";
import { startCase } from "lodash";

export default {
  onlyOneChatPlatformCanBeOnSiteAndActiveError: (chatPlatformName: string) => {
    return errors.throwError({
      name: errors.OnlyOneChatPlatformCanBeOnSiteAndActiveError,
      message: `You currently have ${startCase(
        chatPlatformName
      )} as your onsite chat platform. To continue you need to deactivate it`,
    });
  },

  upgradeToAccessChatPlatformError: (chatPlatformName: string) => {
    return errors.throwError({
      name: errors.UpgradePlanError,
      message: `You need to upgrade your plan to have access to ${startCase(
        chatPlatformName
      )}`,
    });
  },
};
