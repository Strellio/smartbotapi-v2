import { ShopifyLoader, ShopifyResource } from "../../../lib/loaders/shopify"
import { createVectoreStore } from "../../../lib/vectorstore/create-vectorstore"
import { Business } from "../../../models/businesses/types"

 const getDocument = (resource: ShopifyResource) => async ({
     business,
     data,

}: {
         business: Business
    data:any
      
    }) => {
    
     const { shop } = business
         
    const shopifyLoader = new ShopifyLoader(shop.external_platform_domain, resource, shop.external_access_token, {moneyFormat:shop.money_format})
      
     return shopifyLoader.getDocuments([data])
     
 
 }

 export default getDocument