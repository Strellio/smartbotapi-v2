"use strict";

import Woocommerce from "woocommerce-api";

function woocommerce({ domain, consumerKey, consumerSecret }) {
  const woocommerceApi = new Woocommerce({
    url: domain,
    consumerKey,
    consumerSecret,
    version: "wc/v3",
    wpAPIPrefix: "wp-json",
    wpAPI: true,
  });

  return woocommerceApi;
}

export { woocommerce };
