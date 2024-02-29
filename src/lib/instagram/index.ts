/**
 * Copyright 2021-present, Facebook, Inc. All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Instagram For Original Coast Clothing
 *
 */

"use strict";

import { URLSearchParams, URL } from "url";

import fetch from "node-fetch";

const apiUrl = "https://graph.facebook.com/v11.0";

async function callSendApi({ pageAccesToken, ...requestBody }) {
  let url = new URL(`${apiUrl}/me/messages`) as any;
  url.search = new URLSearchParams({
    access_token: pageAccesToken,
  });
  let response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });
  if (!response.ok) {
    console.warn(`Could not sent message.`, response.statusText);
  }
}

async function getUserProfile({ userId, pageAccesToken }) {
  let url = new URL(`${apiUrl}/${userId}`) as any;
  url.search = new URLSearchParams({
    access_token: pageAccesToken,
    fields: "name,profile_pic",
  });
  let response = await fetch(url);
  if (response.ok) {
    let userProfile = await response.json();
    return {
      name: userProfile.name,
      profile_pic: userProfile.profile_pic,
    };
  } else {
    console.log(response);
    console.warn(
      `Could not load profile for ${userId}: ${response.statusText}`
    );
    return null;
  }
}

async function setIcebreakers({ iceBreakers, pageAccesToken }) {
  let url = new URL(`${apiUrl}/me/messenger_profile`) as any;
  url.search = new URLSearchParams({
    access_token: pageAccesToken,
  });
  let json = {
    platform: "instagram",
    ice_breakers: iceBreakers,
  };
  let response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(json),
  });
  if (response.ok) {
    console.log(`Icebreakers have been set.`);
  } else {
    console.warn(`Error setting ice breakers`, response.statusText);
  }
}

async function setPersistentMenu({ persistentMenu, pageAccesToken }) {
  let url = new URL(`${apiUrl}/me/messenger_profile`) as any;
  url.search = new URLSearchParams({
    access_token: pageAccesToken,
  });
  let json = {
    platform: "instagram",
    persistent_menu: persistentMenu,
  };
  let response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(json),
  });
  if (response.ok) {
    console.log(`Persistent Menu has been set.`);
  } else {
    console.warn(`Error setting Persistent Menu`, response.statusText);
  }
}

async function setPageSubscriptions({ pageId, pageAccesToken }) {
  let url = new URL(`${apiUrl}/${pageId}/subscribed_apps`) as any;
  url.search = new URLSearchParams({
    access_token: pageAccesToken,
    subscribed_fields: "feed",
  });
  let response = await fetch(url, {
    method: "POST",
  });
  if (response.ok) {
    console.log(`Page subscriptions have been set.`);
  } else {
    console.warn(`Error setting page subscriptions`, response.statusText);
  }
}

export {
  callSendApi,
  getUserProfile,
  setIcebreakers,
  setPersistentMenu,
  setPageSubscriptions,
};
