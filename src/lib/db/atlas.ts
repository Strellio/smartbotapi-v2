
import config from "../../config";
import { makeDigestRequest } from "../request";

const publicKey = config.get("MONGODB_PUBLIC_KEY")
const privateKey = config.get("MONGODB_PRIVATE_KEY")
const groupId = config.get("MONGODB_PROJECT_ID")
const clusterName =  config.get("MONGODB_CLUSTER_NAME")


const headers = {
  Accept: "application/vnd.atlas.2023-02-01+json",
};

const url = `https://cloud.mongodb.com/api/atlas/v2/groups/${groupId}/clusters/${clusterName}/fts/indexes`;

export async function createSearchIndex({ dbName, indexName, collectionName }) {
  const payload = {
    collectionName,
    database: dbName,
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
    name: indexName,
  };

  const response = await makeDigestRequest({
    url,
    method: "POST",
    data: payload,
    username: publicKey,
    password: privateKey,
    headers,
  });

  return response.data;
}


