import axios from "axios"

const publicKey = "YOUR_PUBLIC_KEY";
const privateKey = "YOUR_PRIVATE_KEY";
const groupId = "YOUR_GROUP_ID";
const clusterName = "YOUR_CLUSTER_NAME";

const authHeader = `Digest ${Buffer.from(`${publicKey}:${privateKey}`).toString(
  "base64"
)}`;

const headers = {
  Accept: "application/vnd.atlas.2023-02-01+json",
  Authorization: authHeader,
};

const url =
  `https://cloud.mongodb.com/api/atlas/v2/groups/${groupId}/clusters/${clusterName}/fts/indexes`

function createSearchIndex({ dbName, indexName, collectionName }) {
  const payload = {
    collectionName,
    database: dbName,
    mappings: {
        "dynamic": true,
        "fields": {
            "embedding": {
                "dimensions": 1536,
                "similarity": "cosine",
                "type": "knnVector"
            }
        }
    },
    name: indexName,
  };
    
    const response = axios.post(url, payload, {
       headers
   })
    
    
}
