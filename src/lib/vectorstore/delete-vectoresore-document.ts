import { MongoClient } from "mongodb";
import config from "../../config";

export async function deleteVectoreStoreDocument({
  dbName,
  collectionName,
  id,
}) {
  const client = new MongoClient(config.ATLAS_DB_URL);

  const collection = client.db(dbName).collection(collectionName);

  await collection.deleteOne({ id });

  await client.close();
}
