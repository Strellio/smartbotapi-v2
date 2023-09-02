import { ShopifyLoader, ShopifyResource } from "../../../lib/loaders/shopify"
import { createVectoreStore } from "../../../lib/vectorstore/create-vectorstore"
import { Business } from "../../../models/businesses/types"

 const syncData = (resource: ShopifyResource) => async ({
    business,

}: {
    business: Business
      
    }) => {
    
     const { shop } = business
         
    const shopifyLoader = new ShopifyLoader(shop.external_platform_domain, resource, shop.external_access_token, {moneyFormat:shop.money_format})
      
     return shopifyLoader.load()
     
 
 }

 export default syncData