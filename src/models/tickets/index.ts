'use strict'
import mongoose from 'mongoose'
import schema from './schema'
import BaseModel from '../common/base-model'
import { required } from '../../lib/utils'

const FIELDS_TO_POPULATE = ["business", "source", "customer"]

const Model = mongoose.model('tickets', schema)
const TicketBaseModel = BaseModel(Model)

function listByBusiness(businessId: string) {
    return TicketBaseModel.fetch({ query: { business: businessId }, populate: FIELDS_TO_POPULATE })
}

const create = (data: any = required("data")) => TicketBaseModel.create({ data, populate: FIELDS_TO_POPULATE })

const update = (_id: string = required("id"), business: string = required("business"), data: any = required("data")) => TicketBaseModel.updateOne({ query: { _id, business }, update: data, populate: FIELDS_TO_POPULATE })





export default function () {
    return {
        ...TicketBaseModel,
        listByBusiness,
        create,
        update
    }
}
