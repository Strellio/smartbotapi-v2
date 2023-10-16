import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createVectoreStore } from "../../lib/vectorstore/create-vectorstore";
import { Business } from "../../models/businesses/types";
import logger from "../../lib/logger";
import { deleteVectoreStore } from "../../lib/vectorstore/delete-vectorstore";
import stripTags from "striptags";
import { createSearchIndex } from "../../lib/db/atlas";

function concatenateStoreInfo(knowledgeBase: any) {
  const {
    return_refund_policy,
    privacy_policy,
    faq,
    terms_of_service,
    shipping_policy,
    cancellation_policy,
    promotions_discounts,
    contacts,
  } = knowledgeBase;

  // Concatenate all values into a single text
  const concatenatedText = [
    return_refund_policy,
    privacy_policy,
    ...(faq
      ? faq.map((entry, i) => `${i + 1}. ${entry.question}: ${entry.answer}`)
      : []),
    terms_of_service,
    shipping_policy,
    cancellation_policy,
    promotions_discounts,
    contacts,
  ];

  return concatenatedText.filter((text) => text);
}

export default async function createOrUpdateKnowledgeBaseVectorStore({
  knowledgeBase,
  business,
}: {
  knowledgeBase: any;
  business: Business;
}) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
    separators: ["\n\n"],
  });
  const documents = (
    await Promise.all(
      concatenateStoreInfo(knowledgeBase).map(async (text) => {
        const textdocuments = await splitter.createDocuments([stripTags(text)]);
        return textdocuments;
      })
    )
  ).reduce((acc, val) => acc.concat(val), []);

  await deleteVectoreStore({
    dbName: business.account_name,
    collectionName: "knowledge-base",
  }).catch((err) => {});

  await createVectoreStore({
    dbName: business.account_name,
    indexName: "knowledge-base-retriever",
    collectionName: "knowledge-base",
    documents,
  });

  logger().info(`knowledge-base vectore store created for ${business.domain}`);
}
