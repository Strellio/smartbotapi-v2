"use strict";
import mongoose from "mongoose";
import schema from "./schema";
import BaseModel from "../common/base-model";
import { required } from "../../lib/utils";
import { ChatPlatform } from "../businesses/types";
import { omitBy, isNil } from "lodash";
import { convertObjectBasedOnActionType, ACTION_TYPE_TO_MONGODB_FIELD } from "../common";
const Model = mongoose.model("chat_platforms", schema);
const chatPlatformModel = BaseModel(Model);

const FIELDS_TO_POPULATE = ["business"]

const getById = (id: string = required("id")): Promise<ChatPlatform> =>
  chatPlatformModel.ensureExists({
    _id: id,
  });

const getByWorkSpaceId = (workSpaceId: string = required("workSpaceId")): Promise<ChatPlatform> => chatPlatformModel.ensureExists(
  {
    workspace_id: workSpaceId
  },
  FIELDS_TO_POPULATE
)

const getByExternalIdAndPlatform = (
  platform: string = required("platform"),
  businessId?: string,
  externalId?: string
): Promise<ChatPlatform> =>
  chatPlatformModel.get({
    query: omitBy(
      {
        platform,
        external_id: externalId,
        business: businessId,
      },
      isNil
    ),
    populate: FIELDS_TO_POPULATE
  });

const updateById = (
  id: string = required("id"),
  update: any = required("update")
): Promise<ChatPlatform> => {
  const query = update.agent?.action_type === ACTION_TYPE_TO_MONGODB_FIELD.EDIT ? {
    _id: id, "agents._id": update.agent.id
  } : {
      _id: id
    }

  const newUpdate = convertObjectBasedOnActionType({ payloadFieldName: "agent", updatePayload: update, dbFieldName: "agents" })
  return chatPlatformModel.updateOne({
    query,
    update: newUpdate
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
    getByWorkSpaceId
  };
}
