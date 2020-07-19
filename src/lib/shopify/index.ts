'use strict'
import ShopifyToken from 'shopify-token'
import Shopify from 'shopify-api-node'
import config from '../../config'
import { required } from '../utils'

const API_VERSION = '2020-04'

const shopifyToken = new ShopifyToken({
  sharedSecret: config.get('SHOPIFY_APP_SECRET') as any,
  redirectUri: `${config.get('APP_URL')}/shopify/callback`,
  apiKey: config.get('SHOPIFY_APP_KEY') as any,
  scopes: ['read_content', 'read_product_listings', 'read_products']
})

const shopifyClient = ({
  shop = required('shop'),
  accessToken = required('accessToken')
}: {
  shop: string
  accessToken: string
}) => {
  const shopify = new Shopify({
    shopName: shop.replace(/(^\w+:|^)\/\//, ''),
    accessToken,
    autoLimit: true,
    apiVersion: API_VERSION
  })

  return shopify
}

export default function shopifyLib () {
  return {
    shopifyToken,
    shopifyClient
  }
}
