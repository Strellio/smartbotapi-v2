import { MongoDBAtlasVectorSearch } from "langchain/vectorstores/mongodb_atlas";
import { MongoClient } from "mongodb";
import config from "../../config";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";

export async function createVectoreStore({
  dbName,
  indexName,
  collectionName,
  documents,
  embeddings = new OpenAIEmbeddings(),
  textKey = "text",
  embeddingKey = "embedding",
}) {
  const client = new MongoClient(config.ATLAS_DB_URL);

  const collection = client.db(dbName).collection(collectionName);

  console.log("ggggggggggggggggggg")


  await MongoDBAtlasVectorSearch.fromDocuments(documents, embeddings, {
    collection,
    indexName, // The name of the Atlas search index. Defaults to "default"
    textKey, // The name of the collection field containing the raw content. Defaults to "text"
    embeddingKey, // The name of the collection field containing the embedded text. Defaults to "embedding"
  });

  console.log("ggggggggggggggggggg")

  await client.close();
}
