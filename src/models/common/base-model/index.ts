'use strict'

import { required } from '../../../lib/utils'
import { Model as MongooseModel, QueryCursor } from 'mongoose'
import paginate from './paginate'
import errors from '../../../lib/errors'

const create = (Model: MongooseModel<any>) => async ({
  data = required('data'),
  populate
}: {
  data: any
  populate?: any
}) => {
  const item = new Model(data)
  let doc = await item.save()
  if (populate) {
    doc = await doc.populate(populate).execPopulate()
  }
  return doc.toObject()
}

const findOne = (Model: MongooseModel<any>) => async ({
  query = required('query'),
  populate,
  lean
}: {
  populate?: string | Array<any>
  query: object
  lean?: boolean
}) => {
  const doc = Model.findOne(query)
  if (populate) {
    doc.populate(populate)
  }
  if (lean) {
    doc.lean(lean)
  }
  const item = await doc.exec()
  return item.toObject()
}

const updateOne = (Model: MongooseModel<any>) => async ({
  query = required('query'),
  update,
  populate,
  options = {}
}: {
  update: object
  query: object
  populate?: any
  options?: object
}): Promise<any> => {
  const opts = Object.assign({}, { new: true, runValidators: true }, options)

  let doc = Model.findOneAndUpdate(query, update, opts).populate(populate)
  return doc.lean().exec()
}

const upsert = (Model: MongooseModel<any>) => async ({
  query,
  update,
  populate
}: {
  query: object
  update: object
  populate?: any
}) => {
  const doc = await findOne(Model)({ query })
  if (doc) return updateOne(Model)({ query, update })
  return create(Model)({ data: update, populate })
}

const fetch = (Model: MongooseModel<any>) => ({
  query = required('query'),
  populate,
  lean,
  batchSize,
  timeout = true,
  mapper
}: {
  populate: string | Array<any>
  query: object
  lean?: boolean
  batchSize?: number
  timeout?: boolean
  mapper?: any
}): QueryCursor<any> => {
  const doc = Model.find(query)

  return doc
    .batchSize(200)
    .populate(populate)
    .cursor()
    .map(mapper || (doc => doc))
}

const deleteOne = (Model: MongooseModel<any>) => async ({
  query = required('query')
}: {
  query: object
}) => {
  const doc = await Model.findOneAndDelete(query).exec()
  return doc
}

const deleteMany = (Model: MongooseModel<any>) => async ({
  query = required('query')
}: {
  query: object
}) => {
  return Model.deleteMany(query).exec()
}

/**
 *
 * Create base model
 */
const BaseModel = (Model: MongooseModel<any>) => {
  return {
    /**
     * Create new item
     */
    create: create(Model),
    /**
     * Fetch batch items
     */
    fetch: fetch(Model),
    /**
     * Delete one
     */
    deleteOne: deleteOne(Model),
    /**
     * Delete many
     */
    deleteMany: deleteMany(Model),
    /**
     * Get one
     */
    get: findOne(Model),
    /**
     * Paginate resources
     */
    paginate: paginate(Model),
    upsert: upsert(Model),
    updateOne: updateOne(Model),
    ensureExists: async (
      query: object = required('query'),
      populate?: string,
      lean?: boolean
    ) => {
      const doc = await findOne(Model)({ query, populate, lean })
      if (!doc) {
        throw errors.throwError({
          name: errors.ResourceDoesNotExists,
          message: `resource does not exist ${Object.keys(query).join(',')}`
        })
      }
      return doc
    }
  }
}

export default BaseModel
