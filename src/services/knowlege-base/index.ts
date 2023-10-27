"use strict";
import KnowlegeBaseModel from "../../models/knowledge-base";
import createOrUpdateKnowledgeBaseVectorStore from "./create-vector-store";

async function createOrUpdateKnowlegeBase({ businessId, ...rest }) {
  const result = await KnowlegeBaseModel().upsert({
    query: { business: businessId },
    update: { ...rest, business: businessId },
    populate: "business",
  });
  await createOrUpdateKnowledgeBaseVectorStore({
    knowledgeBase: result,
    business: result.business,
  });
  return result;
}

export default {
  ...KnowlegeBaseModel(),
  createOrUpdateKnowlegeBase,
};
