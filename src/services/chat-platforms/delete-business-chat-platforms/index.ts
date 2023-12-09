import chatPlatformModel from "../../../models/chat-platforms";
import { STATUS_MAP } from "../../../models/common";

export default async function deleteAllBusinessChatPlatforms(
  businessId: string
) {
  await chatPlatformModel().updateMany({
    query: { business: businessId },
    update: {
      is_deleted: true,
      $unset: {
        external_id: "",
        external_user_id: "",
        external_user_access_token: "",
        external_user_name: "",
        external_access_token: "",
        external_refresh_token: "",
        workspace_id: "",
        "agents.$[].external_id": "",
      },

      status: STATUS_MAP.DEACTIVATED,
    },
  });
}
