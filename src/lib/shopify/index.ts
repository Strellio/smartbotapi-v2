"use strict";
import "@shopify/shopify-api/adapters/node";
import {
  shopifyApi as OwnShopify,
  LATEST_API_VERSION,
} from "@shopify/shopify-api";
import ShopifyToken from "shopify-token";
import Shopify from "shopify-api-node";
import config from "../../config";
import { required } from "../utils";

const API_VERSION = "2020-04";

const hostName = `${config.APP_URL}/shopify/callback`;

const shopifySelf = OwnShopify({
  apiKey: config.SHOPIFY_APP_KEY,
  apiSecretKey: config.SHOPIFY_APP_SECRET,
  scopes: [
    "read_orders",
    "read_assigned_fulfillment_orders",
    "read_customers",
    "write_customers",
  ],
  hostName: hostName.replace(/https?:\/\//, "").replace(/http?:\/\//, ""),
  hostScheme: config.isProduction ? "https" : "http",
  apiVersion: LATEST_API_VERSION,
  isEmbeddedApp: false,
});

const shopifyToken = new ShopifyToken({
  sharedSecret: config.SHOPIFY_APP_SECRET,
  redirectUri: `${config.APP_URL}/shopify/callback`,
  apiKey: config.SHOPIFY_APP_KEY,
  scopes: [
    "read_content",
    "read_product_listings",
    "read_products",
    "read_customers",
    "read_orders",
    // 'read_all_orders',
    "read_script_tags",
    "write_script_tags",
  ],
});

const shopifyClient = ({
  shop = required("shop"),
  accessToken = required("accessToken"),
}: {
  shop: string;
  accessToken: string;
}) => {
  const shopify = new Shopify({
    shopName: shop.replace(/(^\w+:|^)\/\//, ""),
    accessToken,
    autoLimit: true,
    apiVersion: API_VERSION,
  });

  return shopify;
};

export default function shopifyLib() {
  return {
    shopifyToken,
    shopifyClient,
  };
}
