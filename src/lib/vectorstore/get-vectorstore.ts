import { MongoDBAtlasVectorSearch } from "langchain/vectorstores/mongodb_atlas";
import { MongoClient } from "mongodb";
import config from "../../config";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";


export async function getVectorStore({ dbName, indexName, collectionName, embeddings = new OpenAIEmbeddings(), textKey = "text", embeddingKey = "embedding" }) {

    const client = new MongoClient(config.get("ATLAS_DB_URL"));

    const collection = client.db(dbName).collection(collectionName);
    return new MongoDBAtlasVectorSearch(embeddings, {
        collection,
        indexName,// The name of the Atlas search index. Defaults to "default"
        textKey, // The name of the collection field containing the raw content. Defaults to "text"
        embeddingKey, // The name of the collection field containing the embedded text. Defaults to "embedding"
    })
    

}