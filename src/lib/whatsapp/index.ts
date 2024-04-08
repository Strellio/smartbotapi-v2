"use strict";
import config from "../../config";
import request from "../request";
import { required } from "../utils";
const GRAPH_API_VERSION = "v19.0";
const BASE_API_URL = `https://graph.facebook.com/${GRAPH_API_VERSION}`;
/**
 * Debug token
 */
function getWabaInfo({
  accessToken = required("accessToken"),
  wabaId = required("wabaId"),
}: {
  accessToken: string;
  wabaId: string;
}) {
  return request
    .get(`${BASE_API_URL}/${wabaId}`, {
      params: {
        access_token: accessToken,
      },
    })
    .then((response) => response.data);
}

function getSystemUsers({
  businessId = required("businessId"),
}: {
  businessId: string;
}) {
  return request
    .get(`${BASE_API_URL}/${businessId}/system_users`, {
      params: {
        access_token: config.FB_SYSTEM_USER_ACCESS_TOKEN,
      },
    })
    .then((response) => response.data);
}

function assignSystemUserToWaba({
  wabaId = required("wabaId"),
  systemUserId = required("systemUserId"),
  tasks = ["MANAGE"],
}: {
  tasks: ("MANAGE" | "DEVELOP")[];
  wabaId: string;
  systemUserId: string;
}) {
  return request
    .post(
      `${BASE_API_URL}/${wabaId}/assigned_users`,
      {},
      {
        params: {
          access_token: config.FB_ADMIN_SYSTEM_USER_ACCESS_TOKEN,
          tasks,
          user: systemUserId,
        },
      }
    )
    .then((response) => response.data);
}

function getWabaUsers({ wabaId = required("wabaId") }) {
  return request
    .get(`${BASE_API_URL}/${wabaId}/assigned_users`, {
      params: {
        access_token: config.FB_SYSTEM_USER_ACCESS_TOKEN,
      },
    })
    .then((response) => response.data);
}

function registerPhone({
  phoneNumber = required("phoneNumber"),
  pin = "041897",
}: {
  phoneNumber: string;
  pin?: string;
}) {
  return request
    .post(
      `${BASE_API_URL}/${phoneNumber}/register`,
      {
        messaging_product: "whatsapp",
        pin,
      },
      {
        params: {
          access_token: config.FB_SYSTEM_USER_ACCESS_TOKEN,
        },
      }
    )
    .then((response) => response.data);
}

function sendTemplateMessage({
  phoneNumber = required("phoneNumber"),
  templateName = required("templateName"),
  languageCode = "en_US",
  to = required("to"),
}) {
  return request
    .post(
      `${BASE_API_URL}/${phoneNumber}/messages`,
      {
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: templateName,
          language: {
            code: languageCode,
          },
        },
      },
      {
        params: {
          access_token: config.FB_SYSTEM_USER_ACCESS_TOKEN,
        },
      }
    )
    .then((response) => response.data);
}

function sendTextMessage({
  phoneNumber = required("phoneNumber"),
  body = required("body"),
  to = required("to"),
}: {
  phoneNumber: string;
  body: string;
  to: string;
}) {
  return request
    .post(
      `${BASE_API_URL}/${phoneNumber}/messages`,
      {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: {
          body: body,
          preview_url: true,
        },
      },
      {
        params: {
          access_token: config.FB_SYSTEM_USER_ACCESS_TOKEN,
        },
      }
    )
    .then((response) => response.data);
}

function subscribeAppToWaba({
  wabaId = required("wabaId"),
  accessToken = required("accessToken"),
}: {
  wabaId: string;
  accessToken: string;
}) {
  return request
    .post(
      `${BASE_API_URL}/${wabaId}/subscribed_apps`,
      {},
      {
        params: {
          access_token: accessToken,
        },
      }
    )
    .then((response) => response.data);
}

export {
  getWabaInfo,
  getSystemUsers,
  assignSystemUserToWaba,
  getWabaUsers,
  registerPhone,
  sendTemplateMessage,
  sendTextMessage,
  subscribeAppToWaba,
};
