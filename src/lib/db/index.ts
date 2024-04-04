"use strict";

import mongoose from "mongoose";
import config from "../../config";
import logger from "../logger";
import { MongoClient } from "mongodb";

export const connect = () => {
  return mongoose.connect(config.DB_URL).then(() => {
    console.log("config.DB_URL", config.DB_URL);
    logger().info("db connected successfully");
  });
};

export const disconnect = () => mongoose.disconnect();

async function createSearchIndex({ dbName, indexName, collectionName }) {
  console.log("createSearchIndex", config.ATLAS_DB_URL);
  const client = new MongoClient(config.ATLAS_DB_URL);

  try {
    // connect to your Atlas deployment

    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    // define an array of Atlas Search indexes
    const index = {
      name: indexName,
      definition: {
        mappings: {
          dynamic: true,
          fields: {
            embedding: {
              dimensions: 1536,
              similarity: "cosine",
              type: "knnVector",
            },
          },
        },
      },
    };

    // run the helper method
    await collection.createSearchIndex(index);
  } finally {
    await client.close();
  }
}
