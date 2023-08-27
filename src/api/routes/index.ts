"use strict";

import { Router } from "express";
import {
  shopifyAuthCallback,
  shopifyAuthInstall,
  intercomAuthCallback,
  activePlatformCharge,
  insertSeeds,
} from "./actions";
import { createSearchIndex } from "../../lib/db/atlas";
import Shopify from "shopify-api-node";
import { ShopifyLoader } from "../../lib/loaders/shopify";
import { createVectoreStore } from "../../lib/vectorstore/create-vectorstore";
import { getVectorStore } from "../../lib/vectorstore/get-vectorstore";
import queues from "../../lib/queues"

export default function router() {
  return Router()
    .get("/shopify/install", shopifyAuthInstall)
    .get("/shopify/callback", shopifyAuthCallback)
    .get("/plans/charge", activePlatformCharge)
    .get("/intercom/callback", intercomAuthCallback)
    .get("/seeds", insertSeeds)
    .post("/test-vectorstore", async (req, res) => {

      const shopifyLoader = new ShopifyLoader("https://design-studios-hub.myshopify.com", "products", "shpua_348cd5da4feb05fa566c82762018bc4a", {moneyFormat:'GH₵{{amount}}'})
      
      const documents = await shopifyLoader.load()

      await createVectoreStore({ dbName: "design-studios-hub", indexName: "products-retriever", collectionName: "products-store", documents })
      

      const vectorStore = await getVectorStore({ dbName: "design-studios-hub", indexName: "products-retriever", collectionName: "products-store" })


      const resultOne = await vectorStore.similaritySearch("sofa", 1);
        console.log(resultOne);
        
    })


    .post("/create-index", async (req, res) => {

      const queue = queues.productSyncQueue()
      
      queue.add({data: {business:{
          "user": "64e38dafb5e568293dcc07b6",
          "domain": "https://testfashionnana.myshopify.com",
          "email": "strellioltd@gmail.com",
          "status": "A",
          "is_external_platform": true,
          "external_id": "66395111719",
          "platform": "shopify",
          "business_name": "testfashionnana",
          "account_name": "testfashionnana",
          "location": {
            "country": "United States",
            "city": "New York"
          },
          "shop": {
            "external_created_at": "2022-10-15T15:25:52.000Z",
            "external_platform_domain": "https://testfashionnana.myshopify.com",
            "external_access_token": "shpua_0ffb3018fba288d7bcb2459b02a46cd3",
            "money_format": "${{amount}}"
          },
          "_id": "64ea740d2a826747bfb6a4cb",
          "created_at": "2023-08-26T21:52:13.811Z",
          "updated_at": "2023-08-26T21:52:13.811Z",
          "__v": 0,
          "id": "64ea740d2a826747bfb6a4cb"
        
      }}, jobId:"64e38dafb5e568293dcc07b1wur"})


      
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
