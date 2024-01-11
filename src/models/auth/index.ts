"use strict";
import mongoose from "mongoose";
import schema from "./schema";
import BaseModel from "../common/base-model";
import { required } from "../../lib/utils";

const Model = mongoose.model("apikeys", schema);
const APIKeyBaseModel = BaseModel(Model);

function getByKey(key: string = required("key")) {
  return APIKeyBaseModel.ensureExists({ key: key }, ["business"]);
}

export default function () {
  return {
    ...APIKeyBaseModel,
    getByKey,
  };
}
