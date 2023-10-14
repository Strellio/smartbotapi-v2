import { MongoClient } from "mongodb";
import config from "../../config";

export async function deleteVectoreStore({
  dbName,
  collectionName,
}) {
  const client = new MongoClient(config.ATLAS_DB_URL);

  const collection = client.db(dbName).collection(collectionName);

  await collection.drop();

  await client.close();
}
