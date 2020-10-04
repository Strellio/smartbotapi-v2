'use strict'
import request from '../request'
import { required, createHmac } from '../utils'
import config from '../../config'
import { omitBy } from 'lodash/fp'
import { isNil } from 'highland'
const { MessengerClient } = require('messaging-api-messenger')
const FB_LONG_ACCESS_TOKEN_URL = `https://graph.facebook.com/oauth/access_token`
const MESSENGER_PROFILE_BASE_URL =
  'https://graph.facebook.com/v8.0/me/messenger_profile'

const formPageOrPersonaUrl = (pageId: string) =>
  `https://graph.facebook.com/${pageId}`

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
      params: {
        grant_type: 'fb_exchange_token',
        client_id: config.get('FB_CLIENT_ID'),
        client_secret: config.get('FB_CLIENT_SECRET'),
        fb_exchange_token: accessToken
      }
    })
    .then(response => response.data)
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
  return request(formPageOrPersonaUrl(pageId), {
    params: {
      fields: 'access_token',
      access_token: accessToken,
      appsecret_proof: generateAppProf(accessToken)
    }
  }).then(response => response.data)
}

/***
 * Create persona
 */
function createPersona ({
  name,
  profile_url,
  pageAccessToken = required('pageAccessToken')
}: {
  name: string
  profile_url: string
  pageAccessToken: string
}) {
  return request
    .post(
      'https://graph.facebook.com/me/personas',
      {
        name,
        profile_picture_url: profile_url
      },
      {
        params: {
          appsecret_proof: generateAppProf(pageAccessToken),
          access_token: pageAccessToken
        }
      }
    )
    .then(response => response.data)
}

const deletePersona = ({
  id = required('id'),
  pageAccessToken = required('pageAccessToken')
}: {
  id: string
  pageAccessToken: string
}) =>
  request.delete(formPageOrPersonaUrl(id), {
    params: {
      access_token: pageAccessToken,
      appsecret_proof: generateAppProf(pageAccessToken)
    }
  })

const updateMessengerProfile = ({
  pageAccessToken = required('pageAccessToken'),
  whitelistedDomains
}: {
  pageAccessToken: string
  whitelistedDomains?: Array<String>
}) =>
  request.post(
    MESSENGER_PROFILE_BASE_URL,
    omitBy(isNil, { whitelisted_domains: whitelistedDomains }),
    {
      params: {
        access_token: pageAccessToken,
        appsecret_proof: generateAppProf(pageAccessToken)
      }
    }
  )

const messengerClient = (accessToken: string) =>
  MessengerClient.connect({
    accessToken,
    appId: config.get('FB_CLIENT_ID'),
    appSecret: config.get('FB_CLIENT_SECRET'),
    version: '8.0'
  })

const sendTextMessage = async ({
  accessToken = required('accessToken'),
  recipientId = required('recipientId'),
  text = required('text'),
  personaId,
  options = { persona_id: personaId }
}: any) => {
  const client = messengerClient(accessToken)
  await client.sendSenderAction(recipientId, 'typing_on')

  return client.sendText(recipientId, text, options)
}

const sendMediaMessage = async ({
  accessToken = required('accessToken'),
  recipientId = required('recipientId'),
  url = required('url'),
  type = required('type'),
  personaId,
  options = { persona_id: personaId }
}: {
  accessToken: string
  recipientId: string
  url: string
  type: string
  personaId?: string
  options?: object
}) => {
  const client = messengerClient(accessToken)
  await client.sendSenderAction(recipientId, 'typing_on')

  return client.sendAttachment(
    recipientId,
    {
      type,
      payload: {
        url
      }
    },
    options
  )
}

const sendGenericTemplate = async ({
  accessToken = required('accessToken'),
  recipientId = required('recipientId'),
  elements = required('elements'),
  personaId,
  options = { persona_id: personaId }
}: any) => {
  const client = messengerClient(accessToken)
  await client.sendSenderAction(recipientId, 'typing_on')

  return client.sendGenericTemplate(recipientId, elements, options)
}

const getChatUserProfile = ({
  accessToken = required('accessToken'),
  userId = required('userId')
}: {
  accessToken: string
  userId: string
}) => {
  const client = messengerClient(accessToken)
  return client.getUserProfile(userId, [
    'id',
    'name',
    'first_name',
    'last_name',
    'profile_pic',
    'locale',
    'timezone',
    'gender'
  ])
}

export {
  sendMediaMessage,
  getChatUserProfile,
  sendGenericTemplate,
  sendTextMessage,
  updateMessengerProfile,
  generateLongAccessToken,
  generatePageAccessToken,
  deletePersona,
  createPersona
}
