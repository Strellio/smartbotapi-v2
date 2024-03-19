"use strict";
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

export { getWabaInfo };
