'use strict'
import request from '../request'
import { required } from '../utils'
import config from '../../config'

const INTERCOM_BASE_URL = 'https://app.intercom.com'

type Admin = {
  id: string
  email: string
  type: string
  name: string
  away_mode_enabled: string
  away_mode_reassign: string
  has_inbox_seat: string
}

type WorkSpace = {
  type: string
  id: string
  email: string
  app: {
    type: string
    id_code: string
    name: string
  }
  avatar: {
    type: string
    image_url: string
  }
}

type Auth = {
  access_token: string
  token: string
}

export default function intercomLib() {
  return {
    getAuthRedirect: (businessId: string = required('businessId')) =>
      `${INTERCOM_BASE_URL}/a/oauth/connect?client_id=${config.get(
        'INTERCOM_CLIENT_ID'
      )}&state=${businessId}`,
    geToken: (code: string = required('code')): Promise<Auth> =>
      request
        .post(`${INTERCOM_BASE_URL}/auth/eagle/token`, {
          code,
          client_id: config.get('INTERCOM_CLIENT_ID'),
          client_secret: config.get('INTERCOM_CLIENT_SECRET')
        })
        .then(response => response.data),
    getWorkSpace: (accessToken: string = required("accessToken")): Promise<WorkSpace> => {
      return request.get(`${INTERCOM_BASE_URL}/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }).then(response => response.data)
    },
    admins: {
      get: (accessToken: string = required('accessToken')): Promise<Array<Admin>> =>
        request
          .get(`${INTERCOM_BASE_URL}/admins`, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          })
          .then(response => response.data.admins)
    },
    conversations: {
      create: ({ conversationId = required("conversationId"), recipientId = required("recipientId"), accessToken = required("accessToken"), personaId = required("personaId"), text = "", attachments = [] }: {
        conversationId: string
        recipientId: string
        accessToken: string
        personaId: string
        text?: string
        attachments?: string[]
      }) => request.post(`${INTERCOM_BASE_URL}/conversations/${conversationId}/reply`, {
        message_type: 'comment',
        type: 'admin',
        body: text,
        intercom_user_id: recipientId,
        admin_id: personaId,
        attachment_urls: attachments
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      })
    }
  }
}
