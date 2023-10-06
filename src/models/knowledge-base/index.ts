'use strict'
import mongoose from "mongoose"

import schema from "./schema"
import BaseModel from "../common/base-model"


const Model = mongoose.model('knowlege_base', schema)

const KnowledgeBaseModel = BaseModel(Model)






export default function () {
    return {
      ...KnowledgeBaseModel
    }
  }
