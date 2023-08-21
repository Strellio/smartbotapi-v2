'use strict'
import axios from 'axios'
import crypto from "crypto"
import axiosRetry from 'axios-retry'

const retryLimit = 3

axiosRetry(axios, { retries: retryLimit })





export async function makeDigestRequest({
    method,
    url,
    username,
    password,
    data,
    headers,
  }: any) {
    let wwwAuthHeader;
  
    try {
      const response = await axios({ url, method });
      wwwAuthHeader = response.headers["www-authenticate"];
    } catch (error) {
      wwwAuthHeader = error.response.headers["www-authenticate"];
    }
  
    // Extract challenge details from the WWW-Authenticate header
    const realmMatch = wwwAuthHeader.match(/realm="([^"]+)"/);
    const nonceMatch = wwwAuthHeader.match(/nonce="([^"]+)"/);
  
    const realm = realmMatch[1];
    const nonce = nonceMatch[1];
  
    // Generate the cnonce (client nonce) and other required values
    const cnonce = crypto.randomBytes(16).toString("hex");
    // const method = 'GET';
    const qop = "auth";
    const nc = "00000002"; // Increase with each request
  
    // Calculate the response hash
    const ha1 = crypto
      .createHash("md5")
      .update(`${username}:${realm}:${password}`)
      .digest("hex");
    const ha2 = crypto.createHash("md5").update(`${method}:${url}`).digest("hex");
    const response = crypto
      .createHash("md5")
      .update(`${ha1}:${nonce}:${nc}:${cnonce}:${qop}:${ha2}`)
      .digest("hex");
  
    // Build the Authorization header
    const authHeader = `Digest username="${username}", realm="${realm}", nonce="${nonce}", uri="${url}", qop=${qop}, nc=${nc}, cnonce="${cnonce}", response="${response}", opaque=""`;

  
    return axios({
      method,
      url,
      data,
      headers: headers
        ? { ...headers, Authorization: authHeader }
        : { Authorization: authHeader },
    });
  }

export default axios
