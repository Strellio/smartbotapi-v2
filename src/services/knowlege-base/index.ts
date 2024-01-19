"use strict";
import queues from "../../lib/queues";
import KnowlegeBaseModel from "../../models/knowledge-base";

async function createOrUpdateKnowlegeBase({ businessId, ...rest }) {
  const result = await KnowlegeBaseModel().upsert({
    query: { business: businessId },
    update: { ...rest, business: businessId },
    populate: "business",
  });

  const knowlegeBaseUpdateQueue = queues.knowledgeBaseUpdateQueue();

  await knowlegeBaseUpdateQueue.add({
    data: { business: result.business, knowlegeBase: result },
    jobId: `${result.id}${Math.random()}}`,
  });

  console.log("added knowlegebase to queue ", result.id);
  return result;
}

export default {
  ...KnowlegeBaseModel(),
  createOrUpdateKnowlegeBase,
};
