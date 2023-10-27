import chatPlatformModel from "../../../models/chat-platforms";

export default async function deleteChatPlatform({
  businessId,
  chatPlatformId,
}: {
  businessId: string;
  chatPlatformId: string;
}) {
  await chatPlatformModel().updateOne({
    query: { business: businessId, _id: chatPlatformId },
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
      },
    },
  });
}
