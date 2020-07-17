'use strict'
import request from '../request'
import { required, createHmac, parseString } from '../utils'
import config from '../../config'
const FB_LONG_ACCESS_TOKEN_URL = `https://graph.facebook.com/oauth/access_token`

const formPageUrl = (pageId: string) => `https://graph.facebook.com/${pageId}`

const generateAppProf = (accessToken: string) =>
  createHmac({
    secret: config.get('FB_CLIENT_SECRET') as any,
    data: accessToken
  })

/**
 * Generate long access token for fb
 */
function generateLongAccessToken (
  accessToken: string = required('accessToken')
) {
  return request
    .get(FB_LONG_ACCESS_TOKEN_URL, {
      searchParams: {
        grant_type: 'fb_exchange_token',
        client_id: config.get('FB_CLIENT_ID'),
        client_secret: config.get('FB_CLIENT_SECRET'),
        fb_exchange_token: accessToken
      }
    })
    .then(({ body }) => parseString(body))
}

/***
 * Generate long access token
 */
function generatePageAccessToken ({
  pageId = required('pageId'),
  accessToken = required('accessToken')
}: {
  pageId: string
  accessToken: string
}) {
  return request(formPageUrl(pageId), {
    searchParams: {
      fields: 'access_token',
      access_token: accessToken,
      appsecret_proof: generateAppProf(accessToken)
    }
  }).then(({ body }) => parseString(body))
}

export { generateLongAccessToken, generatePageAccessToken }
