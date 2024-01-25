"use strict";
import mongoose from "mongoose";
import schema from "./schema";
import BaseModel from "../common/base-model";
import { required } from "../../lib/utils";
import { Agent } from "../businesses/types";
const Model = mongoose.model("agents", schema);
const AgentModel = BaseModel(Model);

const create = (data: any = required("data")) =>
  AgentModel.create({
    data,
    populate: [
      { path: "linked_chat_agents_platforms", select: "agents platform" },
      { path: "user" },
    ],
  });
const update = (
  _id: string = required("id"),
  business: string = required("business"),
  data: any = required("data")
) =>
  AgentModel.updateOne({
    query: { _id, business },
    update: data,
    populate: [
      { path: "linked_chat_agents_platforms", select: "agents platform" },
      { path: "user" },
    ],
  });

const listByBusinessId = (businessId: string = required("businessId")) =>
  AgentModel.fetch({
    query: {
      business: businessId,
    },
    populate: [
      { path: "linked_chat_agents_platforms", select: "agents platform" },
      { path: "user" },
    ],
  });

const getById = (_id: string = required("id")): Promise<Agent> =>
  AgentModel.get({
    query: { _id },
    populate: [
      { path: "linked_chat_agents_platforms", select: "agents platform" },
      { path: "user" },
    ],
  }) as any;

const listByUserId = (userId: string = required("userId")) =>
  AgentModel.fetch({
    query: {
      user: userId,
    },
    populate: [
      { path: "linked_chat_agents_platforms", select: "agents platform" },
      { path: "user" },
    ],
  });

const getByBusinessAndUserId = ({
  userId,
  businessId,
}: {
  userId: string;
  businessId: string;
}) =>
  AgentModel.get({
    query: {
      user: userId,
      business: businessId,
    },
    populate: [
      { path: "linked_chat_agents_platforms", select: "agents platform" },
      { path: "user" },
    ],
  });

const getBotAgent = (businessId: string) =>
  AgentModel.get({
    query: {
      is_person: false,
      business: businessId,
    },
    populate: [
      { path: "linked_chat_agents_platforms", select: "agents platform" },
      { path: "user" },
    ],
  });

export default {
  ...AgentModel,
  create,
  listByBusinessId,
  update,
  getById,
  listByUserId,
  getByBusinessAndUserId,
  getBotAgent,
};
