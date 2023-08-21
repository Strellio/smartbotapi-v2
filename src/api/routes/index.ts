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

      const shopifyLoader = new ShopifyLoader("https://smart-store-wis.myshopify.com", "products", "shpua_0b2ba5fa999251310ae908280c4ea62e")
      
      const documents = await shopifyLoader.load()

      await createVectoreStore({ dbName: "smart-store-wis", indexName: "products-retriever", collectionName: "products-store", documents })
      

      const vectorStore = await getVectorStore({ dbName: "smart-store-wis", indexName: "products-retriever", collectionName: "products-store" })


      const resultOne = await vectorStore.similaritySearch("sofa", 1);
        console.log(resultOne);
        
    })


    .post("/create-index", async (req, res) => {

      const queue = queues.repeatProductSyncQueue()
      
      queue.add({data: {foo:"bar"}, jobId:"rrurururu", repeat: 3600})


      //  createSearchIndex({ dbName: "smart-store-wis", indexName: "test-index", collectionName: "products-store" }).then(console.log).catch(console.log)
      
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
