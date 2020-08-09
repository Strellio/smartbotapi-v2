"use strict";
import mongoose from "mongoose";
import schema, { CHAT_TYPE } from "./schema";
import BaseModel from "../common/base-model";
import { required } from "../../lib/utils";
import { ChatPlatform } from "../businesses/types";
import { omitBy, isNil } from "lodash";
import { STATUS_MAP } from "../common";
const Model = mongoose.model("chat_platforms", schema);
const chatPlatformModel = BaseModel(Model);

const getById = (id: string = required("id")): Promise<ChatPlatform> =>
  chatPlatformModel.ensureExists({
    _id: id,
  });

const getByExternalIdAndPlatform = (
  platform: string = required("platform"),
  businessId: string = required("businessId"),
  externalId?: string
) =>
  chatPlatformModel.get({
    query: omitBy(
      {
        platform,
        external_id: externalId,
        business: businessId,
      },
      isNil
    ),
  });

const updateById = (
  id: string = required("id"),
  update: any = required("update")
): Promise<ChatPlatform> => {
  const { agent, ...rest } = update;
  const transformedUpdate = rest;

  if (agent) {
    transformedUpdate.$addToSet = {
      agents: agent,
    };
  }

  return chatPlatformModel.updateOne({
    query: {
      _id: id,
    },
    update: transformedUpdate,
  });
};

const create = (data: any = required("data")) => {
  const { agent, ...rest } = data;
  if (agent) {
    rest.agents = [agent];
  }
  return chatPlatformModel.create({
    data: rest,
  });
};

const listByBusinessId = (
  businessId: string = required("businessId"),
  payload = {}
) =>
  chatPlatformModel.fetch({
    query: {
      business: businessId,
      ...payload,
    },
  });

export default function () {
  return {
    ...chatPlatformModel,
    create,
    updateById,
    getById,
    getByExternalIdAndPlatform,
    listByBusinessId,
  };
}
