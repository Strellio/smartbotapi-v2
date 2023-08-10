'use strict'

import mongoose, {mongo} from 'mongoose'
import config from '../../config'
import logger from '../logger'
import { MongoClient } from "mongodb";

import { HNLoader } from "langchain/document_loaders/web/hn";


export const connect = () => {
  return mongoose
    .connect(config.get('DB_URL') as any, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true
    })
    .then(() => {
      logger().info('db connected successfully')
    })
}

export const disconnect = () => mongoose.disconnect()









export async function createSearchIndex({ dbName, indexName, collectionName }) {
  console.log("createSearchIndex", config.get('ATLAS_DB_URL'));
  const client = new MongoClient(config.get('ATLAS_DB_URL') );

  try {

    // connect to your Atlas deployment

    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    // define an array of Atlas Search indexes
    const index = 
        {
            name: indexName,
            definition: {
              "mappings": {
                  "dynamic": true,
                  "fields": {
                      "embedding": {
                          "dimensions": 1536,
                          "similarity": "cosine",
                          "type": "knnVector"
                      }
                  }
              }
          }
        }
    
    
    // run the helper method
    const result = await collection.createSearchIndex(index);
    console.log(result);
  } finally {
    await client.close();
  }
}

