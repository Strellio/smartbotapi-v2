"use strict";
import create from "./create";
import update from "./update";
import list from "./list";
import { sendMessageToCustomer } from "./platforms";
import chatPlatformModel from "../../models/chat-platforms";
import deleteChatPlatform from "./delete";

export default function chatPlatformService() {
  return {
    create,
    update,
    deleteChatPlatform,
    list,
    sendMessageToCustomer,
    getByWorkSpaceId: chatPlatformModel().getByWorkSpaceId,
    getByExternalIdAndPlatform: chatPlatformModel().getByExternalIdAndPlatform,
    getById: chatPlatformModel().ensureExists,
  };
}
