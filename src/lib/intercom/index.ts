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

type Auth = {
  access_token: string
  token: string
}

export default function intercomLib () {
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
    admins: {
      get: (accessToken: string = required('accessToken')): Promise<Admin> =>
        request
          .get(`${INTERCOM_BASE_URL}/admins`, {
            headers: {
              Authorization: `Bearer ${accessToken}`
            }
          })
          .then(response => response.data)
    }
  }
}
