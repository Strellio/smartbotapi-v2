'use strict'

import { gql } from 'apollo-server-express'
import { PLATFORM_MAP } from '../../../../models/businesses/schema/enums'
import {
  CHAT_PLATFORMS,
  CHAT_TYPE
} from '../../../../models/chat-platforms/schema'

const platforms = Object.values(PLATFORM_MAP)
const chatPlatforms = Object.values(CHAT_PLATFORMS)
const chatTypes = Object.values(CHAT_TYPE)
export default gql`
  # Scalars
  enum StatusEnum {
    A
    D
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
`
