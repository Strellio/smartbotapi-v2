"use strict";

import gql from "graphql-tag";
import { PLATFORM_MAP } from "../../../../models/businesses/schema/enums";
import {
  CHAT_PLATFORMS,
  CHAT_TYPE,
} from "../../../../models/chat-platforms/schema";
import {
  STATUS_MAP,
  ACTION_TYPE_TO_MONGODB_FIELD,
} from "../../../../models/common";

const platforms = Object.values(PLATFORM_MAP);
const chatPlatforms = Object.values(CHAT_PLATFORMS);
const chatTypes = Object.values(CHAT_TYPE);
const statusTypes = Object.values(STATUS_MAP);
const actionTypes = Object.keys(ACTION_TYPE_TO_MONGODB_FIELD);
export default gql`
  # Scalars
  enum StatusEnum {
    ${statusTypes}
  }

  enum PlatformEnum {
    ${platforms}
  }
  enum ChatPlatformEnum{
    ${chatPlatforms}
  }
  enum ChatTypeEnum{
    ${chatTypes}
  }

  enum ActionTypes{
   ${actionTypes}
  }
`;
