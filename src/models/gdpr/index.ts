'use strict'
import mongoose from "mongoose"

import schema from "./schema"
import { required } from "../../lib/utils"
import BaseModel from "../common/base-model"


const Model = mongoose.model('gdpr', schema)

const GdprBaseModel = BaseModel(Model)






export default function () {
    return {
      ...GdprBaseModel
    }
  }
