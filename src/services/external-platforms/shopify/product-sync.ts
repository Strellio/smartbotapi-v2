import { ShopifyLoader } from "../../../lib/loaders/shopify"
import logger from "../../../lib/logger"
import { createVectoreStore } from "../../../lib/vectorstore/create-vectorstore"
import { Business } from "../../../models/businesses/types"

 const syncProduct = async ({
    business,

}: {
    business: Business
      
    }) => {
    
     const { shop } = business
         
    const shopifyLoader = new ShopifyLoader(shop.external_platform_domain, "products", shop.external_access_token, {moneyFormat:shop.money_format})
      
     return shopifyLoader.load()
     
 
 }

 export default syncProduct