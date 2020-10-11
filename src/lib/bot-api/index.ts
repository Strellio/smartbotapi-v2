'use strict'

import request from '../request'
import { required } from '../utils'
import config from '../../config'

export type BotResponseCustomData = {
  title: string
  image_url: string
  subtitle?: string
  default_action: {
    type: 'web_url'
    url: string
    webview_height_ratio: string
  }
  buttons: {
    type: 'web_url'
    url: string
  }[]
}

type BotResponse = {
  text?: string
  recipient_id: string
  custom?: {
    data: BotResponseCustomData[]
    type: string
  }
  buttons?: {
    title: string
    payload: string
  }[]
}

export default function getBotResponse ({
  senderId = required('senderId'),
  message = required('message'),
  metadata = {}
}: {
  senderId?: string
  message: string
  metadata: any
}): Promise<BotResponse[]> {
  return request
    .post(`${config.get('BOT_API')}/webhooks/rest/webhook`, {
      sender: senderId,
      message,
      metadata
    })
    .then(response => response?.data)
}
