"use strict";

import chatPlatformModel from "../../../models/chat-platforms";
import schema from "./schema";
import { validate } from "../../../lib/utils";
import * as chatPlatforms from "../platforms";
import { STATUS_MAP } from "../../../models/common";
import H from "highland";
import { CHAT_TYPE, CHAT_PLATFORMS, } from "../../../models/chat-platforms/schema";
import errors from "../errors";

interface updateParams {
  id: string;
  status?: string;
  business_id: string;
  external_page_name?: string;
  external_user_access_token?: string;
  external_user_id?: string;
  external_user_name?: string;
  external_access_token?: string;
  type: CHAT_TYPE
  external_id?: string;
  agent?: {
    id?: string
    external_id?: string;
    name: string;
    profile_url: string;
    is_person: boolean;
  };
}

const ensureNoPlatformIsOnsiteAndActive = async (
  status: STATUS_MAP,
  businessId: string,
  platform: CHAT_PLATFORMS,
  type: CHAT_TYPE
) => {
  if (status === STATUS_MAP.DEACTIVATED) return;
  const list: Array<any> = await H(
    chatPlatformModel().listByBusinessId(businessId, {
      status: STATUS_MAP.ACTIVE,
      type: { $in: [CHAT_TYPE.BOTH, CHAT_TYPE.ON_SITE] },
    })
  )
    .collect()
    .toPromise(Promise as any);
  const isTypeBothOrOnSite = type == CHAT_TYPE.BOTH || type === CHAT_TYPE.ON_SITE
  if (list.length && list[0].platform !== platform && isTypeBothOrOnSite) {
    throw errors.onlyOneChatPlatformCanBeOnSiteAndActiveError(list[0].platform);
  }
};

export default async function update(params: updateParams) {
  const { id, business_id: businessId, ...rest }: updateParams = validate(
    schema,
    params
  );
  const chatPlatform = await chatPlatformModel().getById(id);

  await ensureNoPlatformIsOnsiteAndActive(rest.status as any, businessId, chatPlatform.platform, rest.type);
  const transformedPayload = await chatPlatforms.transformByPlatform({
    payload: {
      ...rest,
      platform: chatPlatform.platform,
    },
    dbPayload: chatPlatform,
  });
  return chatPlatformModel().updateById(id, transformedPayload);
}
