"use strict";

import { Router } from "express";
import {
  shopifyAuthCallback,
  shopifyAuthInstall,
  intercomAuthCallback,
  activePlatformCharge,
  insertSeeds,
} from "./actions";
import { ShopifyLoader } from "../../lib/loaders/shopify";
import { createVectoreStore } from "../../lib/vectorstore/create-vectorstore";
import { getVectorStore } from "../../lib/vectorstore/get-vectorstore";
import queues from "../../lib/queues"
import { ShopifyResource } from "../../lib/loaders/shopify";
import { createSearchIndex } from "../../lib/db/atlas";

export default function router() {
  return Router()
    .get("/shopify/install", shopifyAuthInstall)
    .get("/shopify/callback", shopifyAuthCallback)
    .get("/plans/charge", activePlatformCharge)
    .get("/intercom/callback", intercomAuthCallback)
    .get("/seeds", insertSeeds)
    .post("/test-vectorstore", async (req, res) => {

      const shopifyLoader = new ShopifyLoader("https://design-studios-hub.myshopify.com", ShopifyResource.PRODUCTS, "shpua_348cd5da4feb05fa566c82762018bc4a", {moneyFormat:'GH₵{{amount}}'})
      
      const documents = await shopifyLoader.load()

      await createVectoreStore({ dbName: "design-studios-hub", indexName: "products-retriever", collectionName: "products-store", documents })
      

      const vectorStore = await getVectorStore({ dbName: "design-studios-hub", indexName: "products-retriever", collectionName: "products-store" })


      const resultOne = await vectorStore.similaritySearch("sofa", 1);
        console.log(resultOne);
        
    })


    .post("/create-index", async (req, res) => {


   const result = await  createSearchIndex({
        dbName: "design-studios-hub",
        indexName: "orders-retriever",
        collectionName: "orders-store",
   })
      
      console.log(result)

      // const queue = queues.orderSyncQueue()
      
      // queue.add({data: {business:{
      //   "location": { "country": "Ghana", "city": "Accra" },
      //   "shop": {
      //     "external_platform_domain": "https://design-studios-hub.myshopify.com",
      //     "external_created_at": "2019-12-21T14:53:59.000Z",
      //     "money_format": "GH₵{{amount}}",
      //     "external_access_token": "shpua_348cd5da4feb05fa566c82762018bc4a",
      //     "charge_id": "24267718796"
      //   },
      //   "_id": "64e38dafb5e568293dcc07b7",
      //   "status": "A",
      //   "is_external_platform": true,
      //   "domain": "https://design-studios-hub.myshopify.com",
      //   "email": "strellioltd@gmail.com",
      //   "external_id": "28462776460",
      //   "business_name": "design studios hub",
      //   "platform": "shopify",
      //   "user": "64e38dafb5e568293dcc07b6",
      //   "created_at": "2023-08-21T16:15:43.535Z",
      //   "updated_at": "2023-08-29T01:39:51.478Z",
      //   "__v": 0,
      //   "date_upgraded": "2023-08-21T16:22:29.663Z",
      //   account_name:"design-studios-hub"
      // }
      // }, jobId:"64e38dafb5e568293dcc07b7"})


      
      return res.sendStatus(200)
        
    })

    .get("/ticket/:id", (req, res) => {
      return res.json({
        id: "123",
        status: "pending",
        customer_id: req.body.customer_id,
        title: req.body.title,
        description: req.body.description,
        priority: "low",
        complete: false,
      });
    });
}
